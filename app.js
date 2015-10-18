/*
 * Neighbor nodejs server/routing backend
 * Date: October 18, 2015
 *
 */

var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var logger = require("morgan");
var chalk = require("chalk");

/*
 *	String.startsWith polyfill
 */
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(searchString, position) {
		position = position || 0;
		return this.indexOf(searchString, position) === position;
	};
}

/*
 *	Number.toRad polyfill
 */
if (!Number.prototype.toRad) {
	Number.prototype.toRad = function() {
		return this * (Math.PI / 180);
	};
}

permitAccessTo("css");
permitAccessTo("scripts");
permitAccessTo("view");
permitAccessTo("images");

app.use(logger("dev")); // enable logging

http.listen(8080, function(){
	console.log('program listening on *:8080');
});

var users = [];
var matched_users = [];
var rooms = {};

/********************************** ROUTING **********************************/

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/view/index.html");
});

app.get("/loading", function(req, res) {
	res.sendFile(__dirname + "/view/loading.html");
});

app.get('/chat', function(req, res) {
	res.sendFile(__dirname + "/view/chat.html");
});

/****************************** EVENT HANDLERS *******************************/

io.on('connection', function(socket){
	serverLog(5, "user connected");
	socket.on("location", function(position) {
		serverLog(-2, "position passed: " + position + "\nposition.coords: " + position.coords);
		if (position.coords) {
			serverLog(4, "got location...");
			var userObj = {};
			userObj[socket.id] = {
				"lat": position.coords.latitude,
				"lon": position.coords.longitude,
				"connectedTo": null,
				"searchStart": Date.now()
			};
			users.push(userObj);
			matchmaker(userObj);
		}
	});
	socket.on("next", function(currentRoomId) {
		serverLog(1, "next button pressed");
	});
	socket.on("chat message", function(content) {
		if (content.trim()) {
			serverLog(2, "content: " + content);
			io.emit("chat message", content);
		}
	});
	socket.on("disconnect", function() {
		serverLog(0, "user disconnected");
	});
});


/***************************** MAIN FUNCTIONS ********************************/

/*
 *	This function returns the most relevant user to connect to, given a userObject
 */
function match(userObj) {
	var closest_user;
	var closest_dist = -1; // initialize to negative distance -- i.e. impossible value
	
	Object.keys(users).forEach(function(key) {
		if (users[key].connectedTo === null) {
			var dist = coordDistance(userObj.lat, userObj.lon, users[key].lat, users[key].lon);
			if (dist < closest_dist || ((closest_dist < 0) && dist > closest_dist)) { 
				// TODO: better checking of negative (can't have negative distance)
				closest_dist = dist;
				closest_user = key;
				serverLog(1, "dist found");
			}
		}
	});
	if (closest_dist < 0) {
		serverLog(0, "no users found");
		return null;
	} else {
		var roomID = guid();
		serverLog(2, "room generated");
		userObj.connectedTo = roomID;
		users[closest_user].connectedTo = roomID;
		rooms[roomID] = {
			"user1": userObj,
			"user2": users[closest_user]
		}
		// TODO: trigger an event when someone wants to move on to another person
		return closest_user;
	}
}

/**************************** HELPER FUNCTIONS ******************************/


function matchmaker(userObj) {
	var matched_user = match(userObj);
	if (matched_user) {
		serverLog(3, "emitting roomID");
		io.sockets.socket(socket.id).emit("matched", userObj.connectedTo);
		io.sockets.socket(matched_user).emit("matched", users[matched_user].connectedTo);
		matched_users[matched_user] = users[matched_user];
		matched_users[userObj] = users[userObj];
	} else {
		serverLog(0, "no matches");
		io.sockets.socket(socket.id).emit("notMatched");
	}
}

/*
 *	Determines distance between two coordinate points
 */ 
function coordDistance(lat1, lon1, lat2, lon2) {
	var R = 6371;
	var dLat = (lat2 - lat1).toRad();
	var dLon = (lon2 - lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return R * c;
}

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000) .toString(16) .substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
}

/*
 *	Adds access to a given directory to be able to be "GETted"
 */
function permitAccessTo(path) {
	if (typeof path === "string") {
		if (!path.startsWith("/")) {
			path = "/" + path;
		}
		app.use(path, express.static(__dirname + path));
	} else {
		badType("permitAccessTo", path, "string");
	}
}

/*
 *	Use me to create awesome logs
 *	TODO: use extra if it exists
 */
function serverLog(type, message, extra) {
	var okay = true;
	if (typeof type !== "number") {
		badType("serverLog", type, "number");
		okay = false;
	}
	if (typeof message !== "string") {
		badType("serverLog", message, "string");
		okay = false;
	}
	var output = [
		function(msg) { return chalk.bgRed("[-] " + msg); },   // -2 
		function(msg) { return chalk.red("[-] " + msg); },     // -1
		function(msg) { return chalk.yellow("[!] " + msg); },  //  0
		function(msg) { return chalk.cyan("[*] " + msg); },    //  1
		function(msg) { return chalk.magenta("[*] " + msg); }, //  2
		function(msg) { return ("[*] " + msg); },              //  3
		function(msg) { return chalk.inverse("[*] " + msg); }, //  4
		function(msg) { return chalk.green("[+] " + msg); }    //  5
	];
	var outputtedMsg = output[type + 2](message);
	if (type < 0 ) {
		console.error(outputtedMsg);
	} else {
		console.log(outputtedMsg);
	}
}

/*
 *	Call me if there is a warning but not an error
 */
function warn(message) {
	serverLog(0, message);
}

/*
 *	Call me if there was a problem but you don't need to kill the server.
 */ 
function minorError(message) {
	serverLog(-1, message);
}

/*
 *	Call me if a problem requires breaking the program
 */
function majorError(message) {
	serverLog(-2, message);
	if (!(message instanceof Error)) {
		message = Error(message);
	} 
	message.stack();
	throw message;
}

/*
 *	Call me if someone passed a bad variable type to your function
 */
function badType(fName, thing, expected) {
	var blah = fName + " type mismatch; a " + typeof thing + " was provided ";
	blah += "-- expected a " + expected;
	serverLog(-1, blah);
}

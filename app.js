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

permitAccessTo("css");
permitAccessTo("scripts");
permitAccessTo("view");
permitAccessTo("images");

app.use(logger("dev")); // enable logging

http.listen(8080, function(){
	console.log('program listening on *:8080');
});

/********************************** ROUTING **********************************/

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/view/index.html");
});

/****************************** EVENT HANDLERS *******************************/

io.on('connection', function(socket){
	console.log('user connected');
	socket.on("chat message", function(content) {
		console.log("content: " + content);
		io.emit("chat message", content);
	});
	socket.on("disconnect", function() {
		console.log("user disconnected");
	});
});


/**************************** HELPER FUNCTIONS ******************************/

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
		function(msg) { return chalk.bgRed(msg); },   // -2 
		function(msg) { return chalk.red(msg); },     // -1
		function(msg) { return chalk.yellow(msg); },  //  0
		function(msg) { return chalk.cyan(msg); },    //  1
		function(msg) { return chalk.magenta(msg); }, //  2
		function(msg) { return (msg); },              //  3
		function(msg) { return chalk.inverse(msg); }, //  4
		function(msg) { return chalk.green(msg); }    //  5
	];
	var outputtedMsg = output[type + 2];
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

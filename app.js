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

permitAccessTo("/css");
permitAccessTo("/scripts");
permitAccessTo("/view");

app.use(logger("dev")); // enable logging

http.listen(8080, function(){
	console.log('program listening on *:8080');
});

/********************************** ROUTING **********************************/
app.get('/', function(req, res) {
	res.sendFile(__dirname + "/view/index.html");
});

app.get('/createRoom', function(req, res) {
	
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

function permitAccessTo(path) {
	if (typeof path === "string") {
		// if (!path.startsWith("/")) {
		// 	path = "/" + path;
		// }
		app.use(path, express.static(__dirname + path));
	} else {
		serverLog(-1, "permitAccessTo() requires a string argument; you provided a(n) " + typeof path);
	}
}

function serverLog(type, message, extra) {
	if (typeof type !== "number") {
		badType("serverLog", type, "number");
	}
	if (typeof message !== "string") {
		badType("serverLog", message, "string");
	}
	if (type > 0) {

	} else if (type === 0) {

	} else if (type < 0) {
		if (type === -1) {
			chalk.red(message);
		} else if (type === -2) {
			chalk.bgRed(message);
		}
	}

}

function badType(fName, thing, expected) {
	var blah = fName + " type mismatch; a " + typeof thing + " was provided ";
	blah += "-- expected a " + expected;
	serverLog(-1, blah);
}

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

app.use(logger("dev")); // enable logging

http.listen(8080, function(){
	console.log('program listening on *:8080');
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/view/index.html");
});


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
		if (!path.startsWith("/")) {
			path = "/" + path;
		}
		app.use(path, express.static(__dirname + path));
	} else {
		serverLog(-1, "permitAccessTo() requires a string argument; you provided a(n) " + typeof path);
	}
}

function serverLog(type, message, extra) {
	if (typeof type !== "number") {
		serverLog(-1, "serverLog type 
}

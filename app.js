var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static("chat_demo"));

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/index.html");//'/client/index.html');
});

http.listen(8080, function(){
	console.log('program listening on *:8080');
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

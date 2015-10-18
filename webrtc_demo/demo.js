var express = require('express');
var app = express();
var http = require('http').Server(app);

http.listen(8080, function() {
	console.log("Opening connection on port 8080");
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

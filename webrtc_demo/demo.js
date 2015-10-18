var express = require('express');
var app = express();
var http = require('http').Server(app);

http.listen(3000, function() {
	console.log("Opening connection on port 3000");
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + 'index.html');
});

var webrtc = new SimpleWebRTC({
	localVideoE1: 'localVideo',
	remoteVideosE1: 'remotes',
	autoRequestMedia: true
});

webrtc.on('readyToCall', function() {
	webrtc.joinRoom('epicRoom');;
});

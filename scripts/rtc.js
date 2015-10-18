// construct webrtc and point it at the divs
var webrtc = new SimpleWebRTC({
	localVideoEl: 'localVideo',
	remoteVideoEl: 'remoteVideo',
	autoRequestMedia: true,
});

// note: 'coolroom' is the room being joined
webrtc.on('readyToCall', function() {
	webrtc.joinRoom('coolroom');
});

// whenever a user joins the room, adds them to remoteVideo div
webrtc.on('videoAdded', function (video, peer) {
	var remotes = document.getElementById('remoteVideo');
	while(remotes.firstChild) {
		remotes.removeChild(remotes.firstChild);
	}
	if(remotes) {
		video.id = 'container_' + webrtc.getDomId(peer);
		remotes.appendChild(video);
	}

});

// whenever a user leaves the room, removes them from remoteVideo div and
// displays a leave message
webrtc.on('videoRemoved', function (video, peer) {
	var el = document.getElementById("remoteVideo");
	if(el) {
		el.removeChild(video);
		var mesg = document.createElement('p');
		mesg.id = "disconnect-mesg";
		mesg.textContent = "User disconnected";
		el.appendChild(mesg);
	}
});

webrtc.on('message', function(data) {
	if(data.type === 'chat') {
		console.log(data);		
	}
});

$('#msgSend').click(function(){
	var msg = $('#msg').val();
	webrtc.sendToAll('chat', {message: msg});
	$('#msg').val('');
});

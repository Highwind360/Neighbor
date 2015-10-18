var webrtc = new SimpleWebRTC({
	localVideoEl: 'localVideo',
	remoteVideoEl: 'remoteVideos',
	autoRequestMedia: true,
});

webrtc.on('readyToCall', function() {
	webrtc.joinRoom('coolroom');
});

webrtc.on('videoAdded', function (video, peer) {
	var remotes = document.getElementById('remoteVideos');
	if(remotes) {
		var container = document.createElement('div');
		container.className = 'videoContainer';
		container.id = 'container_' + webrtc.getDomId(peer);
		container.appendChild(video);
		remotes.appendChild(container);
	}
});

webrtc.on('videoRemoved', function (video, peer) {
	var remotes = document.getElementById('remoteVideos');
	var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 
		'localScreenContainer');
	if(remotes && el) {
		el.removeChild(video);
		var mesg = document.createElement('p');
		mesg.classList.add("disconnect-mesg");
		mesg.textContent = "User disconnected";
		el.appendChild(mesg);
	}
});

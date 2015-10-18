var socket = io();

window.onload = function(){
	$("#loadingIcon").hide();

	$("#startChat").click(function(){
		// alert("emitting location");
		navigator.geolocation.getCurrentPosition(function(position) {
			socket.emit("location", position);
		});
		
		// put loading info on page
		$('#startChat').hide();
		$('#loadingIcon').show();
		$('#prompter').text("Please wait while we find a chat partner near you.");
	});

	socket.on("matched", function(roomId) {
		window.location.replace("/chat");
	});
};

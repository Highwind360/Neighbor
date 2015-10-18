var socket = io();

window.onload = function(){
	$("#loadingIcon").hide();
	$("#loadingMessage").hide();

	$("#startChat").click(function(){
		// alert("emitting location");
		navigator.geolocation.getCurrentPosition(function(position) {
			var temp = {
				"latitude": position.coords.latitude,
				"longitude": position.coords.longitude
			};
			socket.emit("location", temp);
		});
		
		$('#startChat').hide();
		$('#loadingIcon').show();
		$('#welcomeMessage').hide();
		$('#loadingMessage').show();
	});

	socket.on("matched", function(roomId) {
		console.log("found a match. Matching with room id: " + roomId);
		window.location.replace("/chat?room=" + roomId);
	});
};

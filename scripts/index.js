var socket = io();

window.onload = function(){
	$("#startChat").click(function(){
		// alert("emitting location");
		navigator.geolocation.getCurrentPosition(function(position) {
			socket.emit("location", position);
		});
		window.location.assign("/loading");
	});

	socket.on("match", function(roomId) {
		console.log("motched with room id: " + roomId);
	});
};

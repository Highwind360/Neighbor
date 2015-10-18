var socket = io();

window.onload = function(){
	$("#startChat").click(function(){
		// alert("emitting location");
		navigator.geolocation.getCurrentPosition(function(position) {
			socket.emit("location", position);
		});
		window.location.assign("/view/loading.html");
	});
};

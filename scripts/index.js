var socket = io();

window.onload = function(){
	$("#startChat").click(function(){
		alert("hi");
		socket.emit("location", null);
	});
};

var socket = io();

window.onload = function() {
	$("#msg").submit(function() {
		socket.emit("chat message", $("#m").val());
		$("#m").val("");
		return false;
	});
	socket.on("chat message", recieveChat);
};

function recieveChat(content) {
	var node = document.createTextNode(content);
	var msg = document.createElement("li");
	$("#messages").appendChild(msg).appendChild(node);
};
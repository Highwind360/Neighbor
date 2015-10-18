var socket = io();

window.onload = function() {
	$("#msg").submit(function() {
		socket.emit("chat message", $("#msgBox").val());
		$("#msgBox").val("");
		return false;
	});
	socket.on("chat message", recieveChat);
	$("#nextRoom").click(function() {
		var roomID = window.location.search.match(/room=(.*)/)[1];
		socket.emit("next", roomID);
	});
};


function recieveChat(content) {
	var node = document.createTextNode(content);
	var msg = document.createElement("li");
	msg.appendChild(node);
	document.getElementById("messages").appendChild(msg);
};

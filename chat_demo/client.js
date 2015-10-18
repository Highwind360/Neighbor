(function() {

	var socket = io();

	window.onload = function() {
		document.getElementById("msg").submit = sendChat;
		socket.on("chat message", recieveChat);
	};

	function sendChat() {
		var content = document.getElementById("m").value;
		socket.emit("chat message", content);
		document.getElementById("m").value = "";
		return false;
	}

	function recieveChat(content) {
		var node = document.createTextNode(content);
		var msg = document.createElement("li");
		document.getElementById("messages").appendChild(msg).appendChild(node);
	}

})();

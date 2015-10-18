(function() {
	var socket = io();

	window.onload = function(){
		var startChatButton = $("#startChat");
		startChatButton.onclick = startChat;
	};

	function startChat(){
		socket.emit("location", null);
	}
});

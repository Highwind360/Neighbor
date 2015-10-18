var socket = io();

window.onload = function(){
	$("#loadingIcon").hide();

	$("#startChat").click(function(){
		var maxWaitTime = 10000;

		// alert("emitting location");
		navigator.geolocation.getCurrentPosition(function(position) {
			socket.emit("location", position);
		});
		
		// put loading info on page, if request times out,
		// page returns to home screen
		toggleLoading();
		window.setTimeout(function() {
			connectFailure();
		}, maxWaitTime);
	});

	socket.on("matched", function(roomId) {
		console.log("found a match. Matching with room id: " + roomId);
		window.location.replace("/chat");
	});

	socket.on("notmatched");

	// Helper function to put the page in a welcome/loading state
	function toggleLoading() {
		for (var el in ['#startChat', '#loadingIcon', 
				'#welcomeMessage', 'loadingMessage']) {
			$(el).toggle();
		}
	}

	function connectFailure() {
		alert("Connection failed");
		toggleLoading();
	}
};

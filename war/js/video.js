var localStream, remoteStream;
var id;
var connection;
function init(){
	var peer = new Peer({ key: 'n7pxsonvz1uivn29', debug: 3, config: {'iceServers': [{ url: 'stun:stun.l.google.com:19302' }]}});
	peer.on('open', function(id) {
		id = id;
		console.log('My peer ID is: ' + id);
		sendToken(id);
	});

	peer.on('connection', function(conn) {
		connection = conn;
		conn.on('data', function(data){
			try{
				var message = JSON.parse(data);
				if (message.type=="load_res"){
					var im = document.getElementById("res_img");
					im.src = message.url;
				}
				if (message.type=="chat_text"){
					var chat = document.getElementById("chat_box");
					chat.value += message.text + "\r\n";
				}

			}catch(e){}
		});
	});
	peer.on('call', function(call) {
		// Answer the call, providing our mediaStream
		navigator.getUserMedia({video:true, audio:true},
				function(stream){
			call.on('stream', function(rStream) {
				// `stream` is the MediaStream of the remote peer.
				// Here you'd add it to an HTML video/canvas element.
				remoteStream = rStream;
				video = document.getElementById("live_video");
				video.src = window.URL.createObjectURL(remoteStream);
			});
			localStream = stream;
			call.answer(stream);

		},
		function(error){
			console.log(error);
		});

	});
	document.getElementById("chat_input").addEventListener("keypress", onkeypress);
}

function onkeypress(e){
	if (e.keyCode == 13){
		sendMessage();
	}
}

function sendMessage(){
	var text = document.getElementById("chat_input").value;
	var chat = document.getElementById("chat_box");
	chat.value += "me: "+ text + "\r\n";
	if (connection){
		connection.send(JSON.stringify({type:"chat_text", text:text}));
	}
	 document.getElementById("chat_input").value="";
}

function stop(){
	video = document.getElementById("live_video");
	video.src ="";
	localStream.stop();
	remoteStream.stop();
}

function sendToken(token){
	var xhr = new XMLHttpRequest();
	var url = "/pandavideochat/token";
	var params = "token="+token;
	xhr.open("POST", url, true);

	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	/*
	xhr.onreadystatechange = function() {//Call a function when the state changes.
	    if(xhr.readyState == 4 && xhr.status == 200) {
	        alert(xhr.responseText);
	    }
	}
	 */
	xhr.send(params);
}

init();

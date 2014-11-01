var localStream,remoteStream;
var conn, connOk;
var slideNum = 0;
var peer

function init(){
	peer = new Peer({key: 'n7pxsonvz1uivn29', debug: 3, config: {'iceServers': [{ url: 'stun:stun.l.google.com:19302' }]}});
	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
	});
	document.getElementById("chat_input").addEventListener("keypress", onkeypress);
}

function onkeypress(e){
	if (e.keyCode == 13){
		sendMessage();
	}
}


function connect(){
	//var id = document.getElementById("connection").value;
	getToken(function(id){
		conn = peer.connect(id);
		conn.on('open', function(){
			connOk = true;
			enableResControl();
		});
		conn.on('data', function(data){
			try{
				var message = JSON.parse(data);
				if (message.type=="chat_text"){
					var chat = document.getElementById("chat_box");
					chat.value += message.text + "\r\n";
				}
			}catch(e){}
		});
		video = document.getElementById("live_video");
		navigator.getUserMedia({video:true, audio:true},
				function(stream){
			localStream = stream;
			// Call a peer, providing our mediaStream
			var call = peer.call(id,  localStream);
			call.on('stream', function(rStream) {
				// `stream` is the MediaStream of the remote peer.
				// Here you'd add it to an HTML video/canvas element.
				remoteStream = rStream;
				video.src = window.URL.createObjectURL(remoteStream);
			});
		},
		function(error){
			console.log(error);
		});
	});
}

function enableResControl(){
	var controls = document.getElementsByClassName('res_control');
	for (var button in controls){
		controls[button].disabled = false;
	}
}

function load(){
	slideNum = 1
	showSlide(slideNum);
}

function next(){
	showSlide(++slideNum);
}

function prev(){
	showSlide(--slideNum);
}

function showSlide(i){
	var url = "res/panda/"+i+".jpg";
	var im = document.getElementById("res_img");
	im.src = url;
	if (connOk){
		conn.send(JSON.stringify({type:"load_res", url:url}));
	}
}

function sendMessage(){
	var text =  document.getElementById("chat_input").value;
	var chat = document.getElementById("chat_box");
	chat.value += "me: "+ text + "\r\n";
	if (connOk){
		conn.send(JSON.stringify({type:"chat_text", text:text}));
	}
	 document.getElementById("chat_input").value="";
}

function stop(){
	video = document.getElementById("live_video");
	video.src ="";
	localStream.stop();
	remoteStream.stop();
}

function getToken(callback){
	var xhr = new XMLHttpRequest();
	var url = "/pandavideochat/token";
	xhr.open("GET", url, true);

	xhr.onreadystatechange = function() {//Call a function when the state changes.
		if(xhr.readyState == 4 && xhr.status == 200) {
			callback(xhr.responseText);
		}
	}
	xhr.send();
}

init();
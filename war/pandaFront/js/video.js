var VideoChat = (function(){
	
	function openPeer(id, onOpen, onConnect, onCall, onData, onStream){
		var peer;
		if (id){
			peer = new Peer(id, { key: 'n7pxsonvz1uivn29', debug: 3, config: {'iceServers': [{ url: 'stun:stun.l.google.com:19302' }]}});
		}else{
			peer = new Peer({ key: 'n7pxsonvz1uivn29', debug: 3, config: {'iceServers': [{ url: 'stun:stun.l.google.com:19302' }]}});
		}
		initPeerListeners(peer, onOpen, onConnect, onCall, onData, onStream);
	}

	function initPeerListeners(peer, onOpen, onConnect, onCall, onData, onStream){
		peer.on('open', function(id) {
			onOpen(peer,id);
			console.log('My peer ID is: ' + id);
		});

		peer.on('connection', function(conn) {
			var connection = conn;
			initConnListeners(connection, onData);
			onConnect(connection);
		});

		peer.on('call', function(call) {
			initCallListeners(call, onStream);
			onCall(call, onStream);
		});
		peer.on('error', function(err) {
			if (err.type == 'unavailable-id'){
				openPeer("", onOpen, onConnect, onCall, onData, onStream);
			}
		});
	}

	function connectToRemotePeer(peer,remoteId, onData){
		connection = peer.connect(remoteId);
		initConnListeners(connection, onData);
		return connection;
	}

	function initConnListeners(connection, onData){
		connection.on('data', function(data){
			onData(data);
		});
	}

	function callToRemotePeer(peer,remoteId, stream, onStream){
		call = peer.call(remoteId, stream);
		initCallListeners(call, onStream);
		return call;
	}

	function initCallListeners(call, onStream){
		call.on('stream', function(remoteStream){
			onStream(remoteStream);
		});
	}
	
	
	return {
		openPeer: openPeer,
		connectToRemotePeer: connectToRemotePeer,
		callToRemotePeer: callToRemotePeer
	}
})();
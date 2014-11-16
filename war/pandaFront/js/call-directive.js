(function (){
	var app = angular.module('call',['ui.bootstrap']);
	app.directive('call', ['$http', function($http){
		var callData = {};
		var profileCB;
		var postCallData = {};
		function uiInit(callCtrl){
			$( ".draggable" ).draggable();
			$( ".resizable" ).resizable({
				aspectRatio: 16 / 11
			});
			$('.call-screen select').change(function(){
				setTimeout(function(){
					callData.connection.send(JSON.stringify({type:"load_res", url:$scope.selectedRes.urls[$scope.currImg]}));
				},0);

			});
			$('.call-screen textarea').height('80px');
		}

		function answerCall(video, answer, decline){
			bootbox.dialog({
				message: "Someone is calling you",
				title: "Incoming call",
				buttons: {
					danger: {
						label: "Decline",
						className: "btn-danger",
						callback: decline
					},
					success: {
						label: "Answer",
						className: "btn-success",
						callback: answer
					},
					video:{
						label: "Video",
						className: "btn-success",
						callback: video
					}
				}
			});
		}

		function updateTextarea(text){
			var $ta = $('.call-screen textarea');
			$ta.text($ta.text() + text + "\n" );
			$ta.scrollTop($ta[0].scrollHeight);
		}
		return {
			restrict: 'E',
			templateUrl:'common/call.html',
			scope: {},
			require: '^tabs',
			controller: function($scope, $modal){
				uiInit(this);
				$scope.showPostCall = false;
				function onStream(remoteStream){
					//$scope.video = window.URL.createObjectURL(remoteStream);
					postCallData.start = (new Date()).getTime();
					$('.call-screen video').attr('src',window.URL.createObjectURL(remoteStream));
				}
				function onData(remoteData){
					//$scope.chatLog += remoteData + "\n";
					try{
						var message = JSON.parse(remoteData);
						if (message.type=="load_res"){
							$('.call-screen img').removeAttr('ng-src');
							$('.call-screen img').attr('src',message.url);
						}
						if (message.type=="chat_text"){
							updateTextarea(message.text);
						}

					}catch(e){}
				}
				function onClose(scope){
					scope.stopCall();
				}
				this.getProfile = function(callback){
					profileCB = callback;
				}

				function showCallScreen(){
					profileCB($scope.caller);
					VideoChat.openPeer($scope.currCall.callId, function(peer,id){
						callData.peer = peer;
						callData.peer.id = id;
						$scope.peerActive = true;
						if ($scope.currCall.callId == callData.peer.id){ //meaning this is the first person in page
							//wait for someone to connect to you
						} else { // connect to remote peer with the call id
							callData.remotePeerId = $scope.currCall.callId;
							callData.connection = VideoChat.connectToRemotePeer(callData.peer,callData.remotePeerId, onData);
							$scope.activeConnection = true;
						}
					}, function (connection){
						$scope.activeConnection = true;
						callData.connection = connection;
						callData.remotePeerId = connection.peer;
					}, function (call){
						$scope.activeCall = true;
						callData.call = call;
						answerCall(function(){
							getUserMedia({video:true, audio:true}, function(stream){
								callData.call.stream = stream;
								callData.call.answer(stream);
							},function(error){
								console.log(error);
							});
						},function(){
							getUserMedia({video:false, audio:true}, function(stream){
								callData.call.stream = stream;
								callData.call.answer(stream);
							},function(error){
								console.log(error);
							});
						}, function(){})
					}, onData, onStream, function(){onClose($scope)});

				}
				$scope.getCurrentCall = function(user){
					$scope.user = user;
					$http.post('/calls', {type:"get-current-call",message: (new Date()).getTime() ,userId:user.userId}).success(function (call){
						if(call){
							$scope.currCall = call[0];
							$scope.caller = call[1];
							$scope.product = call[2];
							if (user.type == "MEDREP"){
								var m = $modal.open({
									templateUrl: 'medrep/pre-call.html',
									controller: function($scope, $modalInstance){
										$http.post('/post-call', {type:"get-last-call-data", id:call[0].callId, userId:call[1].userId}).success(function (data){
											if (data.postCallId){
												$scope.lastCall = data;
												postCallData.sessionNumber = data.sessionNumber + 1;
											} else {
												postCallData.sessionNumber = 1;
												$scope.firstCall = true;
											}
											
											$scope.doctor = call[1];
											$scope.product = call[2];
											$scope.ok = function (){
												$modalInstance.close();
											}
										});

									},
									size: '',
									resolve: {},
									controllerAs: 'preCall'
								});
								m.result.then(function(data){
									showCallScreen();
								});
							} else {
								showCallScreen();
							}
						}else{
							$scope.noCall = true;
						}
					});	

				}
				$scope.chatText;
				$scope.chatLog = "";
				$scope.selectedRes;
				$scope.activeCall = false;
				$scope.currImg = 0;
				$scope.nextImg = function (){
					$scope.currImg++;
					callData.connection.send(JSON.stringify({type:"load_res", url:$scope.selectedRes.urls[$scope.currImg]}));
				}
				$scope.prevImg = function (){
					$scope.currImg--;
					callData.connection.send(JSON.stringify({type:"load_res", url:$scope.selectedRes.urls[$scope.currImg]}));
				}
				$scope.startCall = function(){
					$scope.activeCall = true;
					getUserMedia({video:false, audio:true}, function(stream){
						callData.call = VideoChat.callToRemotePeer(callData.peer,callData.remotePeerId, stream, onStream);
						callData.call.stream = stream;
					},function(error){
						console.log(error);
					});
				}

				$scope.startVideoCall = function(){
					$scope.activeCall = true;
					getUserMedia({video:true, audio:true}, function(stream){
						callData.call = VideoChat.callToRemotePeer(callData.peer,callData.remotePeerId, stream, onStream);
						callData.call.stream = stream;
					},function(error){
						console.log(error);
					});
				}

				$scope.stopCall = function(){
					postCallData.callLength = (new Date()).getTime() - postCallData.start;
					$('.call-screen video').attr('src','');
					if (callData.call && callData.call.stream){
						callData.call.stream.stop();
					}
					$scope.activeCall = false;
					var tUrl;
					if ($scope.user.type == "MEDREP"){
						tUrl = 'medrep/post-call.html'
					} else {
						tUrl = 'doctor/post-call.html'
					}
					var m = $modal.open({
						templateUrl: tUrl,
						controller: function($modalInstance){
							var rating;
							this.init = function(){
								$("#star-rating").rating({showClear:false, showCaption:false}).on('rating.change', function (event, value, caption){
									rating = value;
								});
							}
							this.rate = function(){
								$modalInstance.close({rating: rating, details: this.details});
							}
						},
						size: '',
						resolve: {},
						controllerAs: 'postCall'
					});
					m.result.then(function(data){
						if ($scope.user.type == "DOCTOR"){
							$http.post('/post-call', {type:"doc-rate-call",message: JSON.stringify(data), id:$scope.currCall.callId});
						} else {
							$.extend(data, postCallData)
							$http.post('/post-call', {type:"rep-rate-call",message: JSON.stringify(data), id:$scope.currCall.callId});
						}

					})

				}
				$scope.chat = function(){
					updateTextarea("Me: " +$scope.chatText);
					callData.connection.send(JSON.stringify({type:"chat_text", text:$scope.chatText}));
					$scope.chatText = "";
				}
				this.closePostCall = function(){
					$scope.showPostCall = false;
				}

			},
			controllerAs: 'callCtrl',
			link: function(scope, element, attrs, controller) {
				controller.onSelect('call', function(){
					var user = controller.getActiveUser();
					scope.getCurrentCall(user);
				})
			}
		};
	}]);

	app.directive('callerProfile', ['$http',function($http){
		return {
			restrict: 'E',
			templateUrl:'common/caller-profile.html',
			require: '^call',
			scope:{},
			controller: function($scope){
				$scope.profile = {imageUrl: "//placehold.it/100"};
			},
			controllerAs: 'callerProfile',
			link: function(scope, element, attrs, controller) {
				controller.getProfile(function(profile){
					scope.profile = profile;
				});
			}
		};
	}]);

})();
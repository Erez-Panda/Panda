(function (){
	var app = angular.module('welcome',[]);
	
	app.directive('tabs', function($compile){
		function appendTabs(tabs, scope){
			var tabsElm = angular.element(document.getElementById("tabs"));
			for (var tab in tabs){
				var directive = tabs[tab].directive;
				tabsElm.append($compile('<div ng-model="myModel" ng-show="isSet(\''+directive+'\')"><'+directive+'>'+'</'+directive+'></div>')(scope));
			}
		}
		return{
			restrict: 'E',
			templateUrl: 'common/tabs.html',
			scope:{},
			controller: function ($scope){
				$scope.tabs = [{name:'Notifications', directive:'notifications'},
				               {name:'Calendar', directive:'calendar'},
				               {name:'Profile', directive:'profile'},
				               {name:'Feature Request', directive:'features'},
				               {name:'Call', directive:'call'}
				];
				$scope.currTab = 'notifications';
				this.setTab = function (tabIndex){
					$scope.currTab = tabIndex;
				};
				$scope.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				appendTabs($scope.tabs, $scope);

			},
			controllerAs:'tabCtrl'
		}
	});
	
	app.directive('features', function(){
		return {
			restrict: 'E',
			templateUrl:'doctor/features.html',
			scope: {},
			controller: function($scope){
				$scope.features = Data.features; //server
				$scope.products = Data.products;
				$scope.sample = {};
				$scope.samples = [];
				$scope.address;
				$scope.phone;
				$scope.letter= {};
				$scope.promo = {};
				$scope.currTab = 'Sampels';
				this.setTab = function (tabIndex){
					$scope.currTab = tabIndex;
				};
				$scope.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				
				$scope.addSample = function (){
					$scope.samples.push($scope.sample);
					$scope.sample = {};
				}
				$scope.sendSamples = function (){
					//send to server
					$scope.samples = [];
					bootbox.alert("Your request was sent", function() {}); 
				}
				
				$scope.sendLetter = function(){
					//send to server
					$scope.letter = {};
					bootbox.alert("Your request was sent", function() {}); 
				}
				
				$scope.sendPromo = function(){
					//send to server
					$scope.promo = {};
					bootbox.alert("Your request was sent", function() {}); 
				}
			},
			controllerAs: "featuresCtrl"
		}
	})
	app.directive('notifications', function(){
		return {
			restrict: 'E',
			templateUrl:'common/notifications.html',
			controller: function(){
				var board = this;
				board.notifications = Data.notifications; //should get from server
			},
			controllerAs: 'notificationCtrl'
		};
	});
	
	
	app.directive('calendar', function(){
		return {
			restrict: 'E',
			templateUrl:'common/calendar.html',
			controller: function(){
			    this.calendar = $("#calendar").calendar(
			            {
			                tmpl_path: "/pandaFront/res/calendar/tmpls/",
			                events_source: function () { return Data.calls; } //should get from server
			            });
				this.currView = 'month';
				this.setView = function (view){
					this.currView = view;
					this.calendar.view(view);
				};
				
				this.isView = function (view){
					return this.currView === view;
				};
			},
			controllerAs: 'calCtrl'
		};
	});
	
	app.directive('profile', function(){
		return {
			restrict: 'E',
			templateUrl:'doctor/profile.html',
			scope: {},
			controller: function($scope){
				$scope.profile = Data.profile; //server
				$scope.specialties = Data.specialties; // server
				$scope.languages = ['English','Franch'];
				$scope.callHours = ['Morning (9:00-12:00)','Noon (12:00-16:00)', 'Evening (16:00-20:00)'];
				$scope.frequency = ['Once in two weeks', 'Once a month', 'Once a qurter', 'Once in six months'];
				$scope.isEdit = false;
				$scope.currTab = 1;
				$scope.setTab = function (tabIndex){
					$scope.currTab = tabIndex;
				};
				$scope.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				$scope.edit = function (){
					$scope.isEdit = true;
				}
				
			},
			controllerAs: 'profileCtrl'
		};
	});
	
	app.directive('call', function(){
		var callData = {};
		
		function uiInit(callCtrl){
			$( ".draggable" ).draggable();
			$( ".resizable" ).resizable({
			      aspectRatio: 16 / 11
		    });
			$('.call-screen select').change(function(){
				setTimeout(function(){
					callData.connection.send(JSON.stringify({type:"load_res", url:callCtrl.selectedRes.urls[callCtrl.currImg]}));
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
			controller: function(){
				uiInit(this);
				var callCtrl = this;
				function onStream(remoteStream){
					//callCtrl.video = window.URL.createObjectURL(remoteStream);
					$('.call-screen video').attr('src',window.URL.createObjectURL(remoteStream));
				}
				function onData(remoteData){
					//callCtrl.chatLog += remoteData + "\n";
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
				callCtrl.currCall = Data.currentCall; //should get from server
				VideoChat.openPeer(callCtrl.currCall.id, function(peer,id){
					callData.peer = peer;
					callData.peer.id = id;
					callCtrl.peerActive = true;
					if (callCtrl.currCall.id == callData.peer.id){ //meaning this is the first person in page
						//wait for someone to connect to you
					} else { // connect to remote peer with the call id
						callData.remotePeerId = callCtrl.currCall.id;
						callData.connection = VideoChat.connectToRemotePeer(callData.peer,callData.remotePeerId, onData);
						callCtrl.activeConnection = true;
					}
					}, function (connection){
						callCtrl.activeConnection = true;
						callData.connection = connection;
						callData.remotePeerId = connection.peer;
					}, function (call){
						callCtrl.activeCall = true;
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
					}, onData, onStream);
				callCtrl.chatText;
				callCtrl.chatLog = "";
				callCtrl.selectedRes;
				callCtrl.activeCall = false;
				callCtrl.currImg = 0;
				this.nextImg = function (){
					callCtrl.currImg++;
					callData.connection.send(JSON.stringify({type:"load_res", url:callCtrl.selectedRes.urls[callCtrl.currImg]}));
				}
				this.prevImg = function (){
					callCtrl.currImg--;
					callData.connection.send(JSON.stringify({type:"load_res", url:callCtrl.selectedRes.urls[callCtrl.currImg]}));
				}
				this.startCall = function(){
					callCtrl.activeCall = true;
					getUserMedia({video:false, audio:true}, function(stream){
						callData.call = VideoChat.callToRemotePeer(callData.peer,callData.remotePeerId, stream, onStream);
						callData.call.stream = stream;
						},function(error){
						console.log(error);
					});
				}
				
				this.startVideoCall = function(){
					callCtrl.activeCall = true;
					getUserMedia({video:true, audio:true}, function(stream){
						callData.call = VideoChat.callToRemotePeer(callData.peer,callData.remotePeerId, stream, onStream);
						callData.call.stream = stream;
						},function(error){
						console.log(error);
					});
				}
				
				this.stopCall = function(){
					$('.call-screen video').attr('src','');
					if (callData.call && callData.call.stream){
						callData.call.stream.stop();
					}
					callCtrl.activeCall = false;
				}
				this.chat = function(){
					updateTextarea("Me: " +callCtrl.chatText);
					callData.connection.send(JSON.stringify({type:"chat_text", text:callCtrl.chatText}));
					callCtrl.chatText = "";
				}
				
			},
			controllerAs: 'callCtrl'
		};
	});

	

})();

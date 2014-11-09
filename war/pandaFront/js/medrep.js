(function (){
	var app = angular.module('medRep',[]);
	var _user;
	Array.prototype.clean = function(deleteValue) {
		  for (var i = 0; i < this.length; i++) {
		    if (this[i] == deleteValue) {         
		      this.splice(i, 1);
		      i--;
		    }
		  }
		  return this;
	};
	
	app.directive('tabs', ['$http','$compile', function($http, $compile){
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
				$http.post('/login',"").success(function (user){
					if (!user.firstName){
						var href = document.location.href;
						document.location.href = (href.replace('medrep','welcome'));
					} else {
						_user = user;
						appendTabs($scope.tabs, $scope);
					}
				})
				$scope.tabs = [{name:'Notifications', directive:'notifications'},
				               {name:'Training', directive:'training'},
				               {name:'Calendar', directive:'calendar'},
				               {name:'Profile', directive:'profile'},				               
				               {name:'Call', directive:'call'}
				];
				$scope.currTab = 'notifications';
				this.setTab = function (tabIndex){
					$scope.currTab = tabIndex;
				};
				$scope.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				

			},
			controllerAs:'tabCtrl'
		}
	}]);
	
	app.directive('notifications', ['$http',function($http){
		return {
			restrict: 'E',
			templateUrl:'common/notifications.html',
			controller: function(){
				var board = this;
				board.notifications = Data.notifications; //should get from server
			},
			controllerAs: 'notificationCtrl'
		};
	}]);
	
	app.directive('training', function(){
		return {
			restrict: 'E',
			templateUrl:'medrep/training.html',
			controller: function(){
				var trainingCtrl = this;
				this.currTraining = {};
				trainingCtrl.dueIn30 = function(training) {
					var d = new Date();
					return training.dueDate < d.setDate(d.getDate()+30);
				};
				trainingCtrl.dueLater = function(training) {
					var d = new Date();
					return training.dueDate >= d.setDate(d.getDate()+30);
				};
				this.setTraning = function(training){
					this.currTraining = training;
				}
				this.getProgress = function(training){
					if (!training.resources){
						return 0;
					}
					var completed = 0;
					for (var lesson in training.resources){
						if (training.resources[lesson].completed){
							completed++;
						}
					}
					return Math.round(100*completed/training.resources.length);
				}
				trainingCtrl.trainings = Data.trainings; //should get from server
			},
			controllerAs: 'trainingCtrl'
		};
	});
	
	app.directive('calendar', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'common/calendar.html',
			controller: function(){
				var calendar;
				$http.post('/calls', {type:"get-calls", userId:_user.userId}).success(function (calls){
					calls.clean(null);
				    calendar = $("#calendar").calendar(
			            {
			                tmpl_path: "/pandaFront/res/calendar/tmpls/",
			                events_source: function () { 
			                	return calls; 
			                }
			            });
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
	}]);
	
	app.directive('profile', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'medrep/profile.html',
			controller: function(){
				var profileCtrl = this;
				$http.post('/user', {type:"get-profile",userId:_user.userId}).success(function (profile){
						$.extend(_user,profile);
						profileCtrl.profile = _user; 
				});
				profileCtrl.degreesList = Data.degreesList; //should get from server
				
				//also handle pills
				this.currTab = 1;
				this.currRadio = 'graduate';
				this.setTab = function (tabIndex){
					this.currTab = tabIndex;
				};
				this.isSet = function (tabIndex){
					return this.currTab === tabIndex;
				};
				this.setRadio = function (radio){
					this.currRadio = radio;
				};
				this.isRadio = function (radio){
					return this.currRadio === radio;
				};
				this.saveChanges = function(profile){
					profileCtrl.profile = profile;
					console.log(profileCtrl.profile);
				}
				
			},
			controllerAs: 'profileCtrl'
		};
	}]);
	
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

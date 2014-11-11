(function (){
	var app = angular.module('welcome',[]);
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
						document.location.href = (href.replace('doctor','welcome'));
					} else {
						_user = user;
						appendTabs($scope.tabs, $scope);
					}
				})
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
				$scope.logout = function(){
					$http.post('/login',{type:"logout"}).success(function (){
						var href = document.location.href;
						document.location.href = (href.replace('doctor','welcome'));
					})
				}
				

			},
			controllerAs:'tabCtrl'
		}
	}]);
	
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
	
	app.directive('profile',['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'doctor/profile.html',
			scope: {},
			controller: function($scope){
				$http.post('/user', {type:"get-profile",userId:_user.userId}).success(function (profile){
					$.extend(_user,profile);
					$scope.profile = _user; 
				});
				//$scope.profile = _user;
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
				$scope.saveChanges = function(){
					$scope.isEdit = false;
					var updateUser = {
							firstName: $scope.profile.firstName,
							lastName: $scope.profile.lastName,
							email: $scope.profile.email,
							password: $scope.profile.password,
							phone: $scope.profile.phone,
							address: $scope.profile.address
					}
					$http.post('/user', {type:"update-user",message: JSON.stringify(updateUser), userId:_user.userId}).success(function (profile){
					});
				}
				$scope.saveProfile = function(){
					$scope.isEdit = false;
					var updateProfile = {
							lang: $scope.profile.lang,
							callHour: $scope.profile.callHour,
							callFreq: $scope.profile.ecallFreqmail,
							foi: $scope.profile.foi,
							scheduleBy: $scope.profile.scheduleBy
					}
					$http.post('/user', {type:"update-doc-profile",message: JSON.stringify(updateProfile), userId:$scope.profile.id}).success(function (profile){

					});
				}
				$scope.enableEdit = function(){
					$scope.isEdit = true;
				}
				
			},
			controllerAs: 'profileCtrl'
		};
	}]);
	
	app.directive('call', ['$http', function($http){
		var callData = {};
		
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
			controller: function($scope){
				uiInit(this);
				function onStream(remoteStream){
					//$scope.video = window.URL.createObjectURL(remoteStream);
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
				$http.post('/calls', {type:"get-current-call",message: (new Date()).getTime() ,userId:_user.userId}).success(function (call){
					if (call){
						$scope.currCall = call;
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
							}, onData, onStream);
					}else {
						$scope.noCall = true;
					}
				});
				$scope.chatText;
				$scope.chatLog = "";
				$scope.selectedRes;
				$scope.activeCall = false;
				$scope.currImg = 0;
				this.nextImg = function (){
					$scope.currImg++;
					callData.connection.send(JSON.stringify({type:"load_res", url:$scope.selectedRes.urls[$scope.currImg]}));
				}
				this.prevImg = function (){
					$scope.currImg--;
					callData.connection.send(JSON.stringify({type:"load_res", url:$scope.selectedRes.urls[$scope.currImg]}));
				}
				this.startCall = function(){
					$scope.activeCall = true;
					getUserMedia({video:false, audio:true}, function(stream){
						callData.call = VideoChat.callToRemotePeer(callData.peer,callData.remotePeerId, stream, onStream);
						callData.call.stream = stream;
						},function(error){
						console.log(error);
					});
				}
				
				this.startVideoCall = function(){
					$scope.activeCall = true;
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
					$scope.activeCall = false;
				}
				this.chat = function(){
					updateTextarea("Me: " +$scope.chatText);
					callData.connection.send(JSON.stringify({type:"chat_text", text:$scope.chatText}));
					$scope.chatText = "";
				}
				
			},
			controllerAs: 'callCtrl'
		};
	}]);

	

})();

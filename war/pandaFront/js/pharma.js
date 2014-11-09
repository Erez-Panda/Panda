(function (){
	var app = angular.module('pharma',[]);
	var _user; 
	
	app.service('fileUpload', ['$http', function ($http) {
	    this.uploadFileToUrl = function(file, uploadUrl, callback){
	        var fd = new FormData();
	        fd.append('file', file);
	        $http.post(uploadUrl, fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(id){
	        	callback(id);
	        	console.log(id);
	        })
	        .error(function(){
	        });
	    }
	}]);
	
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
					if (!user.companyName){
						var href = document.location.href;
						document.location.href = (href.replace('pharma','welcome'));
					} else {
						_user = user;
						appendTabs($scope.tabs, $scope);
					}
				})
				$scope.tabs = [{name:'Whats-new', directive:'whats-new'},
				               {name:'Uploads', directive:'uploads'},
				               {name:'Calendar', directive:'calendar'},
				               {name:'Profile', directive:'profile'},
				               {name:'Dashboard', directive:'dashboard'},
				               {name:'Call', directive:'call'}
				];
				$scope.currTab = 'whats-new';
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
	

	app.directive('whatsNew', function(){
		var setTab;
		return {
			require: '^tabs',
			restrict: 'E',
			scope:{},
			templateUrl:'pharma/whats-new.html',
			controller: function($scope){
				$scope.company = Data.companyInfo; //should get from server
				$scope.messages = Data.whatsNew;
				$scope.progress = Math.round(100*$scope.company.deliveredCalls/$scope.company.totalCalls);
				$scope.changeTab = function (tab){
					setTab(tab);
				}
			},
			controllerAs: 'wnCtrl',
			link: function(scope, element, attrs, controller) {
				setTab = controller.setTab;
			}
		};
	});
	
	app.directive('addCallResource', ['$parse', 'fileUpload', function($parse, fileUpload){
		var addCallResource;
		return {
			require: '^uploads',
			restrict: 'E',
			scope: {},
			templateUrl:'pharma/add-resource-form.html',
			controller: function($scope){
				$scope.resource = {};
				$scope.resourceTypes = Data.resourceTypes; //should get from server
				$scope.addResource = function (){
			        //console.log('file is ' + JSON.stringify($scope.resource.file));
			        var uploadUrl = "/fileUpload";
			        fileUpload.uploadFileToUrl($scope.resource.file, uploadUrl, function(id){
			        	$scope.resource.url = "/fileUpload?id="+id;
						addCallResource($scope.resource);
						$scope.resource = {}; 	
			        });

				}

			},
			controllerAs: 'addResCtrl',
			link: function(scope, element, attrs, controller) {
				addCallResource = controller.addCallResource;
	            
	            element.bind('change', function(){
	                scope.$apply(function(){
	                	scope.resource.file = element.find('input')[2].files[0];
	                });
	            });
			}
		};
	}]);
	
	app.directive('addTrainingResource', function(){
		var addTrainingResource;
		return {
			require: '^uploads',
			restrict: 'E',
			scope:{},
			templateUrl:'pharma/add-resource-form.html',
			controller: function($scope){
				$scope.resource = {};
				$scope.resourceTypes = Data.resourceTypes; //should get from server
				$scope.addResource = function (){
					addTrainingResource($scope.resource);
					$scope.resource = {};
				}

			},
			controllerAs: 'addResCtrl',
			link: function(scope, element, attrs, controller) {
				addTrainingResource = controller.addTrainingResource;
			}
		};
	});
	
	app.directive('uploads', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'pharma/uploads.html',
			controller: function(){
				var uploadCtrl = this;
				$http.post('/products', {type:"get-products", userId:_user.userId}).success(function (products){
					uploadCtrl.products = products;
				});
				uploadCtrl.selectedProduct = {};
				uploadCtrl.training = {};
				
				uploadCtrl.addCallResource = function (resource){
					if (!uploadCtrl.selectedProduct.callResources){
						uploadCtrl.selectedProduct.callResources = [];
					}
					$http.post('/resources', {type:"new-resource",message:JSON.stringify(resource), userId:_user.userId}).success(function (){
						uploadCtrl.selectedProduct.callResources.push(resource);
						uploadCtrl.callResource = {};
					});
				};
				uploadCtrl.addTrainingResource = function (resource){
					if (!uploadCtrl.selectedProduct.selectedTraining.resources){
						uploadCtrl.selectedProduct.selectedTraining.resources = [];
					}
					uploadCtrl.selectedProduct.selectedTraining.resources.push(resource);
					uploadCtrl.callResource = {};
				};
				uploadCtrl.addTraining = function (training){
					if (!uploadCtrl.selectedProduct.training){
						uploadCtrl.selectedProduct.training = [];
					}
					uploadCtrl.selectedProduct.training.push(training);
					uploadCtrl.selectedProduct.selectedTraining = training;
					uploadCtrl.training = {};
				};
				
			},
			controllerAs: 'uploadCtrl'
		};
	}]);
	
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
			templateUrl:'pharma/profile.html',
			controller: function(){
				var profileCtrl = this;
				profileCtrl.profile = Data.profile; //should get from server
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

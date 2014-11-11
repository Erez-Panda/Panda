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
				$scope.logout = function(){
					$http.post('/login',{type:"logout"}).success(function (){
						var href = document.location.href;
						document.location.href = (href.replace('pharma','welcome'));
					})
				}
				

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
	
	app.directive('addTrainingResource', ['$parse', 'fileUpload', function($parse, fileUpload){
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
			        var uploadUrl = "/fileUpload";
			        fileUpload.uploadFileToUrl($scope.resource.file, uploadUrl, function(id){
			        	$scope.resource.url = "/fileUpload?id="+id;
						addTrainingResource($scope.resource);
						$scope.resource = {};
			        });
				}

			},
			controllerAs: 'addResCtrl',
			link: function(scope, element, attrs, controller) {
				addTrainingResource = controller.addTrainingResource;
	            element.bind('change', function(){
	                scope.$apply(function(){
	                	scope.resource.file = element.find('input')[2].files[0];
	                });
	            });
			}
		};
	}]);
	
	app.directive('uploads', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'pharma/uploads.html',
			scope:{},
			controller: function($scope){
				$http.post('/products', {type:"get-products", userId:_user.userId}).success(function (products){
					
					$scope.products = products;
				});
				$scope.selectedProduct = {};
				$scope.training = {};
				
				this.addCallResource = function (resource){
					if (!$scope.selectedProduct.callResources){
						$scope.selectedProduct.callResources = [];
					}
					resource.productId = $scope.selectedProduct.productId;
					$http.post('/resources', {type:"new-resource",message:JSON.stringify(resource), userId:_user.userId}).success(function (){
						$scope.selectedProduct.callResources.push(resource);
						$scope.callResource = {};
					});
				};
				this.addTrainingResource = function (resource){
					if (!$scope.selectedProduct.selectedTraining.resources){
						$scope.selectedProduct.selectedTraining.resources = [];
					}
					resource.trainingId = $scope.selectedProduct.selectedTraining.trainingId;
					$http.post('/resources', {type:"new-resource",message:JSON.stringify(resource), userId:_user.userId}).success(function (){
						$scope.selectedProduct.selectedTraining.resources.push(resource);
						$scope.callResource = {};
					});

				};
				$scope.addTraining = function (training){
					if (!$scope.selectedProduct.training){
						$scope.selectedProduct.training = [];
					}
					training.productId = $scope.selectedProduct.productId;
					training.dueDate = training.dueDate.getTime();
					$http.post('/trainings', {type:"new-training",message:JSON.stringify(training), userId:_user.userId}).success(function (){
						$scope.selectedProduct.training.push(training);
						$scope.selectedProduct.selectedTraining = training;
						$scope.training = {};
					});

				};
				
			},
			link: function(scope, element, attrs, controller) {
				scope.$watch('selectedProduct', function (value){
					if (value && value.productId){
						$http.post('/resources', {type:"get-resources", userId:value.productId}).success(function (resources){
							scope.selectedProduct.callResources = resources;
						});
						$http.post('/trainings', {type:"get-trainings", userId:value.productId}).success(function (trainings){
							scope.selectedProduct.training = trainings;
						});
					}
				});
				scope.$watch('selectedProduct.selectedTraining', function (value){
					if (value && value.trainingId){
						$http.post('/resources', {type:"get-training-resources", userId:value.trainingId}).success(function (resources){
							scope.selectedProduct.selectedTraining.resources = resources;
						});
					}
				});
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
	
	app.directive('profile', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'pharma/profile.html',
			scope:{},
			controller: function($scope){
				$scope.isEdit = false;
				$http.post('/user', {type:"get-profile",userId:_user.userId}).success(function (profile){
						$.extend(_user,profile);
						$scope.profile = _user; 
				});
				$scope.saveChanges = function(){
					$scope.isEdit = false;
					var updateUser = {
							companyName: $scope.profile.companyName,
							contantPerson: $scope.profile.contantPerson,
							email: $scope.profile.email,
							password: $scope.profile.password,
							phone: $scope.profile.phone,
							address: $scope.profile.address
					}
					$http.post('/user', {type:"update-user",message: JSON.stringify(updateUser), userId:_user.userId}).success(function (profile){
						$.extend(_user,profile);
						$scope.profile = _user; 
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

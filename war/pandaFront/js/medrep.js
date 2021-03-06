(function (){
	var app = angular.module('medRep',['call']);
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
		var selectCB = [];
		
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
					} else if (user.status == "approved"){
						_user = user;
						appendTabs($scope.tabs, $scope);
					} else {
						$scope.tabs = [{name:'Not approved', directive:'not-approved'}];
						$scope.currTab = 'not-approved';
						appendTabs($scope.tabs, $scope);
					}
				})
				$scope.tabs = [{name:'News', directive:'news'},
				               {name:'Training', directive:'training'},
				               {name:'Profile', directive:'profile'},				               
				               {name:'Call', directive:'call'}
				];
				$scope.currTab = 'news';
				this.setTab = function (tabIndex){
					$scope.currTab = tabIndex;
					for (var i=0; i< selectCB.length; i++){
						selectCB[i](tabIndex);
					}
				};
				this.onSelect = function (tab, callback){
					selectCB.push(function (t){if (t==tab){callback();}})
				}
				$scope.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				$scope.logout = function(){
					$http.post('/login',{type:"logout"}).success(function (){
						var href = document.location.href;
						document.location.href = (href.replace('medrep','welcome'));
					})
				};
				this.getActiveUser = function(){
					return _user;
				}
				

			},
			controllerAs:'tabCtrl'
		}
	}]);
	
	app.directive('notApproved', ['$http',function($http){
		return {
			restrict: 'E',
			template:'<h2>We are reviewing you application. you will be notified by email when we approve you</h2>'
		};
	}]);
	
	app.directive('news', ['$http',function($http){
		return {
			restrict: 'E',
			templateUrl:'medrep/news.html',
			scope:{},
			controller: function($scope){
				$scope.getProgress = function(training){
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
				
				$scope.accept = function (req){
					$http.post('/schedule', {type:"answer-call-request", userId:_user.userId, id: req.callRequestId}).success(function (resp){
						if (resp == "Already assigned"){
							alert("someone took it :(");
						} else {
							alert("cool, you have a new call :)");
						}
						$scope.callRequests.splice($scope.callRequests.indexOf(req),1);
					});
				}
				$http.post('/calls', {type:"get-calls", userId:_user.userId}).success(function (calls){
					calls.clean(null);
					$scope.calls = calls;
					
				});
				$http.post('/trainings', {type:"get-user-trainings", userId:_user.userId}).success(function (trainings){
					$scope.trainings = trainings.clean(null);
				});
				
				$http.post('/products', {type:"get-products", userId:_user.userId}).success(function (products){
					products.clean(null);
					$scope.products = products;
				});
				
				$http.post('/schedule', {type:"get-call-request", userId:_user.userId}).success(function (requests){
					requests.clean(null);
					$scope.callRequests = requests;
				});
			},
			controllerAs: 'news'
		};
	}]);
	
	app.directive('training', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'medrep/training.html',
			scope :{},
			controller: function($scope){
				$scope.currTraining = {};
				$scope.dueIn30 = function(training) {
					var d = new Date();
					return training.dueDate < d.setDate(d.getDate()+30);
				};
				$scope.dueLater = function(training) {
					var d = new Date();
					return training.dueDate >= d.setDate(d.getDate()+30);
				};
				$scope.setTraning = function(training){
					$http.post('/resources', {type:"get-training-resources", userId:training.trainingId}).success(function (resources){
						training.resources = resources.clean(null);
						for (var lesson in training.resources){
							 training.resources[lesson].completed = (_user.completedResources.indexOf(training.resources[lesson].resourceId) != -1);
						}
						$scope.currTraining = training;
					});
					
				}
				$scope.getProgress = function(training){
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
				$scope.openResource = function (resource){
					window.open(resource.url);
				}
				
				$scope.startTest = function (resource){
					$scope.showTest = true;
					updateResId(resource.testId, resource.resourceId);
				}
				
				this.endTest = function(){
					$scope.showTest = false;
				}
				this.onResUpdate = function (callback){
					updateResId = callback;
				}
				$http.post('/trainings', {type:"get-user-trainings", userId:_user.userId}).success(function (trainings){
					$scope.trainings = trainings.clean(null);
				});
				
			},
			controllerAs: 'trainingCtrl'
		};
	}]);
	
	app.directive('testViewer', ['$http', function($http){
		var endTest;
		var resourceId;
		function onUpdate(scope, testId){
			$http.post('/tests', {type:"get-test",id:testId}).success(function (questions){
				scope.questions = questions;
			});
		};
		return {
			require: '^training',
			restrict: 'E',
			scope:{},
			templateUrl:'medrep/test-viewer.html',
			controller: function($scope){
				$scope.questions = [];
				$scope.checkTest = function(q){
					var score = 0;
					for (var i=0; i< $scope.questions.length; i++){
						if ($scope.questions[i].userAns == $scope.questions[i].correctAns){
							score++;
						}
					}
					if (score/$scope.questions.length > 0.8){
						$http.post('/user', {type:"resource-completed",userId:_user.userId, id: resourceId}).success(function (){
 
						});
					}
					alert("your score is " + score/$scope.questions.length);
					endTest();
				}
			},
			link: function(scope, element, attrs, controller) {
				endTest = controller.endTest;
				controller.onResUpdate(function (testId, resId){
					resourceId = resId;
					onUpdate(scope,testId)
				});
			}
		};
	}]);
	
	
	app.directive('profile', ['$http','$parse', 'fileUpload', function($http, $parse, fileUpload){
		return {
			restrict: 'E',
			templateUrl:'medrep/profile.html',
			scope:{},
			controller: function($scope){
				$scope.isEdit = false;
				$scope.profile = {imageUrl: "//placehold.it/100"};
				$http.post('/user', {type:"get-profile",userId:_user.userId}).success(function (profile){
						$.extend(_user,profile);
						$scope.profile = _user; 
				});
				$scope.saveChanges = function(){
					$scope.isEdit = false;
					function update(id){
						var updateUser = {
								firstName: $scope.profile.firstName,
								lastName: $scope.profile.lastName,
								email: $scope.profile.email,
								password: $scope.profile.password,
								phone: $scope.profile.phone,
								address: $scope.profile.address
						}
						if (id){
							updateUser.imageUrl = "/fileUpload?id="+id;
						}
						$http.post('/user', {type:"update-user",message: JSON.stringify(updateUser), userId:_user.userId}).success(function (profile){
							$.extend(_user,profile);
							$scope.profile = _user; 
						});
					}
					if (!$scope.profile.imageUrl || !~$scope.profile.imageUrl.indexOf('blob')){ 
						update();
					} else { //image changed
				        var uploadUrl = "/fileUpload";
				        fileUpload.uploadFileToUrl($scope.profile.image, uploadUrl, function(id){
				        	update(id);
				        });
					}

				}
				$scope.enableEdit = function(){
					$scope.currentProfile = {
							firstName: $scope.profile.firstName,
							lastName: $scope.profile.lastName,
							email: $scope.profile.email,
							password: $scope.profile.password,
							phone: $scope.profile.phone,
							address: $scope.profile.address,
							imageUrl: $scope.profile.imageUrl
					};
					$scope.isEdit = true;
				}
				
				$scope.cancel = function(){
					$scope.profile = $scope.currentProfile;
					$scope.isEdit = false;
				}
				
			},
			controllerAs: 'profileCtrl',
			link: function(scope, element, attrs, ctrl) {
	            element.bind('change', function(){
	                scope.$apply(function(){
	                	scope.profile.image = element.find('input')[0].files[0];
	                	scope.profile.imageUrl = URL.createObjectURL(scope.profile.image);
	                });
	            })
			}
		};
	}]);

})();

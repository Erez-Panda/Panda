(function (){
	var app = angular.module('pharma',['call']);
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
				this.getActiveUser = function(){
					return _user;
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
	
	app.directive('profile', ['$http','$parse', 'fileUpload', function($http, $parse, fileUpload){
		return {
			restrict: 'E',
			templateUrl:'pharma/profile.html',
			scope:{},
			controller: function($scope){
				$scope.isEdit = false;
				$scope.profile = {imageUrl: "//placehold.it/100"};
				function update(id){
					var updateUser = {
							companyName: $scope.profile.companyName,
							contantPerson: $scope.profile.contantPerson,
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
				$http.post('/user', {type:"get-profile",userId:_user.userId}).success(function (profile){
						$.extend(_user,profile);
						$scope.profile = _user; 
				});
				$scope.saveChanges = function(){
					$scope.isEdit = false;
					
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
							companyName: $scope.profile.companyName,
							contantPerson: $scope.profile.contantPerson,
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

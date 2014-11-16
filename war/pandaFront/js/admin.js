(function (){
	var app = angular.module('admin',[]);
	var _user; 
	var onUserUpdateCb =[];
	var onProductUpdateCb =[];
	function userUpdate(userList){
		for (var callback in onUserUpdateCb){
			onUserUpdateCb[callback](userList);
		}
	}
	
	function onUserUpdate(callback){
		onUserUpdateCb.push(callback);
	}
	
	function productUpdate(productList){
		for (var callback in onProductUpdateCb){
			onProductUpdateCb[callback](productList);
		}
	}
	
	function onProductUpdate(callback){
		onProductUpdateCb.push(callback);
	}
	
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
					/*
					if (!user.firstName){
						var href = document.location.href;
						document.location.href = (href.replace('admin','welcome'));
					} else {
						_user = user;
						appendTabs($scope.tabs, $scope);
					}
					*/
					appendTabs($scope.tabs, $scope);
				})
				$scope.tabs = [{name:'Users', directive:'users'},
				               {name:'Calls', directive:'calls'},
				               {name:'Products', directive:'products'},
				               {name:'Resources', directive:'resources'},
				               {name:'Trainings', directive:'trainings'},
				               {name:'Static data', directive:'static-data'},
				               {name:'Applications', directive:'applications'}
				];
				$scope.currTab = 'users';
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
	
	app.directive('users',['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'admin/users.html',
			scope: {},
			controller: function($scope){
				$scope.alertInfo = "";
				$http.post('/listUsers', {type:"get-all"}).success(function (users){
					$scope.users = users;
					userUpdate(users);
				});
				$scope.deleteAll = function(){
					$http.post('/listUsers', {type:"delete-all"}).success(function (){
						$scope.users = [];
					});	
				}
				$scope.deleteEntry = function(entry){
					$http.post('/user', {type:"delete-user", id:entry.userId}).success(function (){
						$scope.users.splice($scope.users.indexOf(entry),1);
						$scope.alertInfo = "User was deleted";
					});	
				}
				
				
			},
			controllerAs: 'usersCtrl'
		};
	}]);
	
	app.directive('calls',['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'admin/calls.html',
			scope: {},
			controller: function($scope){
				$scope.postCallData = {};
				$scope.alertInfo = "";
				var now = new Date();
				now.setMilliseconds(0);
				now.setSeconds(0);
				$scope.call = {start: now, end: now};
				onUserUpdate(function(users){
					$scope.users = users;
				});
				$http.post('/calls', {type:"get-all"}).success(function (calls){
					$scope.calls = calls;
				});
				onProductUpdate(function(products){
					$scope.products = products;
				})
				$scope.resources = [{name:"koko"}]; // get from server
				$scope.deleteAll = function(){
					$http.post('/calls', {type:"delete-all"}).success(function (){
						$scope.calls = [];
					});	
				}
				$scope.newCall = function (){
					var callData = {
							title: $scope.call.title,
							callerId:$scope.call.caller.userId,
							calleeId:$scope.call.callee.userId,
							start: $scope.call.start.getTime(),
							end: $scope.call.end.getTime(),
							productId: $scope.call.product.productId,
							resources: $scope.call.resources
						};
					$http.post('/calls', {type:"new-call", message: JSON.stringify(callData)}).success(function (users){
						$scope.calls.push($scope.call);
						$scope.call = {start: now, end: now};
						$scope.alertInfo = "New call was added";
					});
				}
				$scope.openPostData = function(call){
					$http.post('/post-call', {type:"get-call-data", id:call.callId}).success(function (postData){
						$scope.postCallData = postData;
					});
				}
				
			},
			controllerAs: 'callsCtrl'
		};
	}]);
	
	app.directive('products',['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'admin/products.html',
			scope: {},
			controller: function($scope){
				$scope.product ={};
				$scope.alertInfo = "";
				$http.post('/static-data', {type:"get-call-quantities"}).success(function (options){
					$scope.callQuantities = options;
					$scope.product.callQuantity = $scope.callQuantities[0];
				});

				$http.post('/static-data', {type:"get-hcp-segments"}).success(function (options){
					$scope.hcpSegments = options;
					$scope.product.hcp = $scope.hcpSegments[0];
				});
				onUserUpdate(function(users){
					$scope.users = users;
				});
				$http.post('/products', {type:"get-all"}).success(function (products){
					$scope.products = products;
					productUpdate(products);
				});
				$scope.deleteAll = function(){
					$http.post('/products', {type:"delete-all"}).success(function (){
						$scope.products = [];
					});	
				}
				$scope.newProduct = function (){
					var productData = {
							name: $scope.product.name,
							creatorId:$scope.product.creator.userId,
							deliveryDate: $scope.product.deliveryDate.getTime(),
							endDate: $scope.product.endDate.getTime(),
							callQuantity: $scope.product.callQuantity.name,
							hcp: $scope.product.hcp.name,
							maturityPhase: $scope.product.hcp.maturityPhase
						};
					$http.post('/products', {type:"new-product", message: JSON.stringify(productData)}).success(function (){
						$scope.products.push($scope.product);
						$scope.product ={};
						$scope.alertInfo = "New product was added";
					});
				}
				
			},
			controllerAs: 'productsCtrl'
		};
	}]);
	
	app.directive('resources',['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'admin/resources.html',
			scope: {},
			controller: function($scope){
				$scope.alertInfo="";
				$http.post('/resources', {type:"get-all"}).success(function (resources){
					$scope.resources = resources;
				});
				$scope.deleteAll = function(){
					$http.post('/resources', {type:"delete-all"}).success(function (){
						$scope.resources = [];
					});	
				}
				$scope.deleteEntry = function(entry){
					$http.post('/resources', {type:"delete-resource", id:entry.resourceId}).success(function (){
						$scope.resources.splice($scope.resources.indexOf(entry),1);
						$scope.alertInfo = "Resource was deleted";
					});	
				}
				
			},
			controllerAs: 'resourcesCtrl'
		};
	}]);
	
	app.directive('trainings',['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'admin/trainings.html',
			scope: {},
			controller: function($scope){
				$scope.assignUser = {};
				onUserUpdate(function(users){
					$scope.users = users;
				});
				$http.post('/trainings', {type:"get-all"}).success(function (trainings){
					$scope.trainings = trainings;
				});
				$scope.deleteAll = function(){
					$http.post('/trainings', {type:"delete-all"}).success(function (){
						$scope.trainings = [];
					});	
				}
				$scope.assignTraining = function (training){
					if ($scope.assignUser && $scope.assignUser.userId && training && training.trainingId){
						$http.post('/trainings', {type:"assign-training", userId:$scope.assignUser.userId, trainingId: training.trainingId} ).success(function (){
						});
					}
				}
				
				
			},
			controllerAs: 'resourcesCtrl'
		};
	}]);
	
	app.directive('staticData',['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'admin/static-data.html',
			scope: {},
			controller: function($scope){
				$scope.options = [];
				$scope.newEntry = "";
				$scope.setTab = function (tabIndex){
					$http.post('/static-data', {type:"get-"+tabIndex}).success(function (options){
						$scope.options = options;
					});
					$scope.currTab = tabIndex;
				};
				$scope.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				
				$scope.addEntry = function(){
					$http.post('/static-data', {type:"add-"+$scope.currTab, message: JSON.stringify({name: $scope.newEntry})}).success(function (id){
						$scope.options.push({name: $scope.newEntry, id: id});
						$scope.newEntry = "";
					});	
				}
				$scope.deleteEntry = function(entry){
					$http.post('/static-data', {type:"delete-"+$scope.currTab, id:entry.id}).success(function (){
						$scope.options.splice($scope.options.indexOf(entry),1);
					});	
				}
				$scope.setTab('degrees');
				
			},
			controllerAs: 'resourcesCtrl'
		};
	}]);
	
	app.directive('applications',['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'admin/applications.html',
			scope: {},
			controller: function($scope){
				$scope.alertInfo = "";
				$scope.selectedUser = {};
				$http.post('/listUsers', {type:"get-pending"}).success(function (users){
					$scope.users = users;
				});
				$scope.select = function(user){
					$scope.selectedUser = user;
				}
				$scope.approve = function(){
					$http.post('/user', {type:"approve-user", userId: $scope.selectedUser.userId}).success(function (users){
					});
				}
				
				
			},
			controllerAs: 'usersCtrl'
		};
	}]);
	

})();

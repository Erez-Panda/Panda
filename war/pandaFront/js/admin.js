(function (){
	var app = angular.module('admin',[]);
	var _user; 
	var onUpdateCb =[];
	function userUpdate(userList){
		for (var callback in onUpdateCb){
			onUpdateCb[callback](userList);
		}
		
	}
	
	function onUserUpdate(callback){
		onUpdateCb.push(callback);
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
				               {name:'Calls', directive:'calls'}
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
				$http.post('/listUsers', {type:"get-all"}).success(function (users){
					$scope.users = users;
					userUpdate(users);
				});
				$scope.deleteAll = function(){
					$http.post('/listUsers', {type:"delete-all"}).success(function (){
						$scope.users = [];
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
				$scope.products = [{name:"lolo"}] ;// get from server
				$scope.resources = [{name:"koko"}]; // get from server
				$scope.deleteAll = function(){
					$http.post('/calls', {type:"delete-all"}).success(function (){
						$scope.calls = [];
					});	
				}
				$scope.newCall = function (){
					var callData = {
							title: $scope.call.title,
							callerId:$scope.call.caller.email,
							calleeId:$scope.call.callee.email,
							start: $scope.call.start.getTime(),
							end: $scope.call.end.getTime(),
							productId: $scope.call.product.productId,
							resources: $scope.call.resources
						};
					$http.post('/calls', {type:"new-call", message: JSON.stringify(callData)}).success(function (users){
						$scope.calls.push($scope.call);
						$scope.call = {start: now, end: now};
					});
				}
				
			},
			controllerAs: 'callsCtrl'
		};
	}]);
	

})();

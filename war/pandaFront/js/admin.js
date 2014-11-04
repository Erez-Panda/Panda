(function (){
	var app = angular.module('admin',[]);
	var _user; 
	
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
						document.location.href = (href.replace('admin','welcome'));
					} else {
						_user = user;
						appendTabs($scope.tabs, $scope);
					}
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
				$http.post('/listUsers', {type:"get-all",userId:_user.email}).success(function (users){
					$scope.users = users;
				});
				
			},
			controllerAs: 'usersCtrl'
		};
	}]);
	

})();

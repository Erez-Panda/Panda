(function (){
	var app = angular.module('welcome',['call']);
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
	Array.prototype.indexOfName = function(name){
		for (var i = 0; i < this.length; i++) {
			if (this[i]["name"] === name) return i;
		}
		return -1;
	};
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
						document.location.href = (href.replace('doctor','welcome'));
					} else {
						_user = user;
						appendTabs($scope.tabs, $scope);
					}
				})
				$scope.tabs = [{name:'News', directive:'news'},
				               {name:'Profile', directive:'profile'},
				               {name:'Feature Request', directive:'features'},
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
						document.location.href = (href.replace('doctor','welcome'));
					})
				}
				this.getActiveUser = function(){
					return _user;
				}
				

			},
			controllerAs:'tabCtrl'
		}
	}]);
	
	app.directive('features', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'doctor/features.html',
			scope: {},
			controller: function($scope){
				$scope.features = ['Schedule a Call','Sampels', 'Medical Letter', 'Acticals and Promotion matirials'] //server?
				$http.post('/products', {type:"get-all"}).success(function (products){
					$scope.products = products.clean(null);
				});
				$scope.sample = {};
				$scope.samples = [];
				$scope.address;
				$scope.phone;
				$scope.letter= {};
				$scope.promo = {};
				$scope.call = {};
				$scope.currTab = 'Schedule a Call';
				this.setTab = function (tabIndex){
					$scope.currTab = tabIndex;
				};
				$scope.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				$scope.sendCall = function(){
					var reqData = {
							start: $scope.call.start.getTime()
						}
					$http.post('/schedule', {type:"new-call-request", message: JSON.stringify(reqData), userId:_user.userId, id:$scope.call.product.productId }).success(function (products){
						
					});
					//send to server
					$scope.call = {};
					bootbox.alert("Your request was sent", function() {}); 
				}
				
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
	}])
	app.directive('news', ['$http',function($http){
		return {
			restrict: 'E',
			templateUrl:'doctor/news.html',
			scope:{},
			controller: function($scope){			
				$http.post('/calls', {type:"get-calls", userId:_user.userId}).success(function (calls){
					calls.clean(null);
					$scope.calls = calls;
					
				});
			},
			controllerAs: 'news'
		};
	}]);
	
	app.directive('profile', ['$http','$parse', 'fileUpload', function($http, $parse, fileUpload){
		return {
			restrict: 'E',
			templateUrl:'doctor/profile.html',
			scope: {},
			controller: function($scope){
				$scope.profile = {imageUrl: "//placehold.it/100"};
				$http.post('/user', {type:"get-profile",userId:_user.userId}).success(function (profile){
					$.extend(_user,profile);
					$scope.profile = _user;
					
					
					$http.post('/static-data', {type:"get-doctor-specialties"}).success(function (options){
						$scope.specialties = options;
						$scope.profile.specialty = options[options.indexOfName($scope.profile.specialty)];
					});
					$http.post('/static-data', {type:"get-call-frequencies"}).success(function (options){
						$scope.frequency = options;
						$scope.profile.callFreq = options[options.indexOfName($scope.profile.callFreq)];
					});
	
					$http.post('/static-data', {type:"get-languages"}).success(function (options){
						$scope.languages = options;
						$scope.profile.lang = options[options.indexOfName($scope.profile.lang)];
					});
	
					$http.post('/static-data', {type:"get-call-hours"}).success(function (options){
						$scope.callHours = options;
						$scope.profile.callHour = options[options.indexOfName($scope.profile.callHour)];
					});
					
					$http.post('/static-data', {type:"get-FOI"}).success(function (options){
						$scope.fois = options;
					});
				});
				$scope.isEdit = false;
				$scope.currTab = 1;
				$scope.setTab = function (tabIndex){
					$scope.currTab = tabIndex;
				};
				$scope.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				
				function update(id){
					var updateUser = {
							firstName: $scope.profile.firstName,
							lastName: $scope.profile.lastName,
							email: $scope.profile.email,
							password: $scope.profile.password,
							phone: $scope.profile.phone,
							address: $scope.profile.address,
							specialty: $scope.profile.specialty.name
					}
					if (id){
						updateUser.imageUrl = "/fileUpload?id="+id;
					}
					$http.post('/user', {type:"update-user",message: JSON.stringify(updateUser), userId:_user.userId}).success(function (profile){
					});
				}
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
				$scope.saveProfile = function(){
					$scope.isEdit = false;
					var updateProfile = {
							lang: $scope.profile.lang.name,
							callHour: $scope.profile.callHour.name,
							callFreq: $scope.profile.callFreq.name,
							foi: $scope.profile.foi,
							scheduleBy: $scope.profile.scheduleBy
					}
					$http.post('/user', {type:"update-doc-profile",message: JSON.stringify(updateProfile), userId:$scope.profile.id}).success(function (profile){

					});
				}
				$scope.enableEdit = function(){
					$scope.currentProfile = {
							firstName: $scope.profile.firstName,
							lastName: $scope.profile.lastName,
							email: $scope.profile.email,
							password: $scope.profile.password,
							phone: $scope.profile.phone,
							address: $scope.profile.address,
							specialty: $scope.profile.specialty,
							imageUrl: $scope.profile.imageUrl,
							lang: $scope.profile.lang,
							callHour: $scope.profile.callHour,
							callFreq: $scope.profile.callFreq,
							foi: $scope.profile.foi,
							scheduleBy: $scope.profile.scheduleBy
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

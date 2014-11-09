(function (){
	var app = angular.module('welcome',[]);
	var currentUser;
	app.directive('tabs', function($compile){
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
				$scope.tabs = [{name:'Home', directive:'home'},
				               {name:'Doctors', directive:'doctors'},
				               {name:'Medical Representatives', directive:'med-rep'},
				               {name:'Pharmaceutical Company', directive:'pharma'}
				];
				$scope.noLogin = true;
				$scope.currTab = 'home';
				this.setTab = function (tabIndex){
					$scope.currTab = tabIndex;
				};
				$scope.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				appendTabs($scope.tabs, $scope);

			},
			controllerAs:'tabCtrl'
		}
	});
	
	app.directive('home', ['$http', function($http){
		var setTab;
		return{
			restrict: 'E',
			templateUrl: 'welcome/home.html',
			require: '^tabs',
			scope:{},
			controller: function ($scope){
				$scope.user = {};
				this.setTab = function (tab){
					setTab(tab);
				}
				this.login = function(){
					$http.post('/login',{type:'login', message:JSON.stringify($scope.user)}).success(function(user){
						if (user.type){
							var href = document.location.href;
							var target;
							switch(user.type){
								case "MEDREP":
									target = "medrep";
									break;
								case "PHARMA":
									target = "pharma";
									break;
								case "DOCTOR":
									target = "doctor";
									break;
							}
							document.location.href = (href.replace('welcome',target));
						}
					}).error(function(b){
						var a =b;
					});
				}
			},
			link: function(scope, element, attrs, controller) {
				setTab = controller.setTab;
			},
			controllerAs: 'homeCtrl'
		}
	}]);
	
	app.directive('doctors', function($sce){
		return{
			restrict: 'E',
			templateUrl: 'welcome/info-page.html',
			scope:{},
			controller: function ($scope){
				$scope.types = ["","",'Doctor'];
				$scope.type = 2;
				$scope.welcomeText = "welcome text explaining about Panda for doctors\n Text should be longer\n will look better";
				$scope.infoText = "welcome text explaining about Panda for doctors\n Text should be longer\n will look better";
				$scope.videoSrc= $sce.trustAsResourceUrl("http://www.youtube.com/embed/PgVb2DTCr_E");
				this.register = function(){
					$scope.onRegister = true;
				}
			},
			controllerAs: "infoPage"
		}
	});
	
	app.directive('medRep', function($sce){
		return{
			restrict: 'E',
			templateUrl: 'welcome/info-page.html',
			scope:{},
			controller: function ($scope){
				$scope.types = ["Medical Representative","",""];
				$scope.type = 0;
				$scope.welcomeText = "welcome text explaining about Panda for Medical Representatives\n Text should be longer\n will look better";
				$scope.infoText = "welcome text explaining about Panda for Medical Representatives\n Text should be longer\n will look better";
				$scope.videoSrc= $sce.trustAsResourceUrl("http://www.youtube.com/embed/g78utcLQrJ4");
				this.register = function(){
					$scope.onRegister = true;
				}
			},
			controllerAs: "infoPage"
		}
	});
	
	app.directive('pharma', function($sce){
		return{
			restrict: 'E',
			templateUrl: 'welcome/info-page.html',
			scope:{},
			controller: function ($scope){
				$scope.types = ["","Pharmaceutical Company",""];
				$scope.type = 1;
				$scope.welcomeText = "welcome text explaining about Panda for Pharmaceutical Company\n Text should be longer\n will look better";
				$scope.infoText = "welcome text explaining about Panda for Pharmaceutical Company\n Text should be longer\n will look better";
				$scope.videoSrc= $sce.trustAsResourceUrl("http://www.youtube.com/embed/GWNS9UikfMk");
				this.register = function(){
					$scope.onRegister = true;
				}
			},
			controllerAs: "infoPage"
		}
	});
	
	
	app.directive('registerForm',['$http', function($http){
		function watchForm(scope){
			scope.$watch('registerForm.firstName.$invalid', function(invalid){
				if (scope.registerForm.firstName.$dirty){
					scope.dirtyInput = true;
				}
				scope.error = invalid ? "Missing input, First name is missing" : "";
			});
			scope.$watch('registerForm.lastName.$invalid', function(invalid){
				if (scope.registerForm.lastName.$dirty){
					scope.dirtyInput = true;
				}
				scope.error = invalid ? "Missing input, Last name is missing" : "";
			});
			scope.$watch('registerForm.email.$viewValue', function(val){
				var email = scope.registerForm.email;
				if (email.$dirty){
					scope.dirtyInput = true;
				}
				scope.error = email.$invalid ? (email.$error.email ? "You have entered an invalid Email address" : "Missing input, First name is missing") : "";
			});
			scope.$watch('registerForm.password.$invalid', function(invalid){
				if (scope.registerForm.password.$dirty){
					scope.dirtyInput = true;
				}
				scope.error = invalid ? "Missing input, password is missing" : "";
			});	
			scope.$watch('registerForm.repassword.$viewValue', function(val){
				var repassword = scope.registerForm.repassword;
				if (repassword.$dirty){
					scope.dirtyInput = true;
				}
				scope.error = repassword.$invalid ? (repassword.$error.matchPassword ? "Passwords don't match" : "Missing input, retyped password is missing") : "";
			});	
		}
		
		return {
			restrict: 'E',
			templateUrl:'welcome/register-form.html',
			scope:{},
			controller: function($scope){
				var ctrl = this;
				$scope.profile = {};
				$scope.degreesList = Data.degreesList; //should get from server
				$scope.specialties = Data.specialties; //should get from server

				$scope.currTab = 1;
				$scope.currRadio = 'graduate';
				this.setTab = function (tabIndex){
					$scope.currTab = tabIndex;
				};
				this.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				this.setRadio = function (radio){
					$scope.currRadio = radio;
				};
				this.isRadio = function (radio){
					return $scope.currRadio === radio;
				};
				this.save = function(profile){
					$scope.profile = profile;
					var types=["MEDREP", "PHARMA", "DOCTOR"];
					$scope.profile.type = types[ctrl.formType];
					$http.post('/user', {type:"new-user",message:JSON.stringify($scope.profile)}).success(function (resp){
						if (resp.error){
							$scope.error = resp.message;
							$scope.dirtyInput = true;
						}else{
							currentUser = resp;
							ctrl.setTab(2);
						}
					});
					
				}
				this.isType = function(type){
					return this.formType === type;
				}
				
				this.isError = function (){
					return $scope.error && $scope.dirtyInput;
				}
				this.showError = function (){
					$scope.error = "Form is not complete"
					$scope.dirtyInput = true;
				}
				
			},
			controllerAs: 'registerCtrl',
			link: function(scope, element, attrs, ctrl) {
				ctrl.formType = parseInt(element.parent()[0].className);
				scope.registerForm.repassword.$validators.matchPassword = function(modelValue, viewValue) {
			          if (viewValue == scope.profile.password) {
			            // it is valid
			            return true;
			          }
			          // it is invalid
			          return false;
			        };
				watchForm(scope);
			}
		};
	}]);
	
	app.directive('medRepForm', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'welcome/med-rep-form.html',
			scope:{},
			controller: function($scope){
				$scope.profile = {};
				$scope.degreesList = Data.degreesList; //should get from server
				//also handle pills
				$scope.currRadio = 'graduate';
				this.setRadio = function (radio){
					$scope.currRadio = radio;
				};
				this.isRadio = function (radio){
					return $scope.currRadio === radio;
				};
				this.save = function(profile){
					$scope.profile = profile;
					$http.post('/user', {type:"new-med-profile",message:JSON.stringify($scope.profile), userId:currentUser.userId}).success(function (resp){
						if (resp.error){

						}else{
							$http.post('/login',{type:'login', message:JSON.stringify(currentUser)}).success(function(user){
								var href = document.location.href;
								document.location.href = (href.replace('welcome','medrep'));
							});
						}
					});
				}
				
			},
			controllerAs: 'medRegisterCtrl'
		};
	}]);
	
	app.directive('doctorForm', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'welcome/doctor-form.html',
			scope:{},
			controller: function($scope){
				$scope.profile = {foi:[], scheduleBy:[true]};
				$scope.languages = ['English','Franch'];
				$scope.profile.lang = $scope.languages[0];
				$scope.callHours = ['Morning (9:00-12:00)','Noon (12:00-16:00)', 'Evening (16:00-20:00)'];
				$scope.profile.callHour = $scope.callHours[0];
				$scope.frequency = ['Once in two weeks', 'Once a month', 'Once a qurter', 'Once in six months'];
				$scope.profile.callFreq = $scope.frequency[0];
				this.save = function(profile){
					$scope.profile = profile;
					$http.post('/user', {type:"new-doc-profile",message:JSON.stringify($scope.profile), userId:currentUser.userId}).success(function (resp){
						if (resp.error){

						}else{
							$http.post('/login',{type:'login', message:JSON.stringify(currentUser)}).success(function(user){
								var href = document.location.href;
								document.location.href = (href.replace('welcome','doctor'));
							});
						}
					});
				}

				
			},
			controllerAs: 'doctorRegisterCtrl'
		};
	}]);
	
	app.directive('pharmaForm', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'welcome/pharma-form.html',
			scope:{},
			controller: function($scope){
				$scope.product ={};
				this.save = function(profile){
					$scope.profile = profile;
					$http.post('/user', {type:"new-pharma-profile",message:JSON.stringify($scope.profile), userId:currentUser.userId}).success(function (resp){
						if (resp.error){

						}else{
							$http.post('/login',{type:'login', message:JSON.stringify(currentUser)}).success(function(user){
								var href = document.location.href;
								document.location.href = (href.replace('welcome','pharma'));
							});
						}
					});
				}
				this.purchase = function (){
					
				}

				
			},
			controllerAs: 'pharmaRegisterCtrl'
		};
	}]);
	

})();

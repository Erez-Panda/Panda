(function (){
	var app = angular.module('welcome',[]);
	var currentUser;
	
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
				$scope.welcomeTexts = ["Panda enables you to get valuable medical information from a certified company sales rep for any given drug exactly when you need it. Panda gives you the information you need on your terms.",
				                       "You'll be able to just click and order samples, articles, promotional materials & medical letters on any drug available in the market. The items will be delivered to you according to your needs.",
				                       "Panda helps you live smarter, decide on how much time you want to spend on work, giving you time to focus on what’s most important.",
				                       "We vet all our sales reps who undergo exhaustive trainings by pharma companies as well as thorough interviews.",
				                       "Our skilled professionals go above and beyond on every job. Sales reps are rated and reviewed after each task.",
				                       "Select the product you need medical information about, then choose the Sales rep you’d like to work with.",
				                       "Online communication makes it easy for you to stay in touch with your Sales rep."];
				$scope.infoTexts = ["1. Register online: log in and complete a short application form",
				                    "2. Choose a product from the list",
				                    "3. Choose a time that fits your schedule – use our online scheduling system to choose a time that fits your needs",
				                    "4. Optional: choose a sales rep you'd like to work with.",
				                    "5.  You're done. Your assigned Panda sales rep will call you at the time you specified.",
				                    "6. Once you entered our community, you'll be able to visit our app/website and order samples, articles, promotional materials and medical letters for any given drug available in the market. "];
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
				$scope.welcomeTexts = ["Panda helps you get valuable job experience in the pharma industry. You'll interact with health care professionals and work with the largest pharmaceutical companies around.",
				                       "Panda helps you earn more for less time invested. You choose how many hours you work a day and in most cases you'll earn more than the average fiels sales reps earns.",
				                       "Panda helps you live smarter, decide on how much time you want to spend on work, giving you time to focus on what’s most important.",
				                       "You work from home with all the convenience that comes with it. Flexible hours and convenience are key elements of what we do.",
				                       "We find clients for you. We present you new and interesting job opportunities as they arise",
				                       "We handle payments. You're paid quickly after each task via our online payment system.",
				                       "We provide support. You're not alone. Our member services team supports you 24/7 if you have any issues or questions.",
				                       "You'll become part of the Panda community. Our skilled professionals will be working with you and interacting with you throughout your work."];
				$scope.infoTexts = ["1. Apply online: Complete your application",
				                    "2. Get verified. We're big on Trust and compliance, so we require identity verification and in-person/online interviews",
				                    "3. Pass the Training. Complete an online training on a specific product and pass the exams associated with it.",
				                    " 4. Start making calls - wait for assignments offered by the system and connect with Physicians to perform the calls"];
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
				$scope.welcomeTexts = ["Panda allows you to expand your capacity utilization, create new profit opportunities while reducing transaction costs. You'll reach larger audiences with increased satisfaction of your customers.",
				                       "Panda helps you save valuable time on reps' training without scarifying quality of interaction with your customers, giving you time to focus on other areas.",
				                       "We vet all our sales reps, who undergo exhaustive trainings and exams as well as strict interviews.",
				                       "Our skilled professionals go above and beyond on every job. Sales reps are rated and reviewed after each task.",
				                       "Online communication makes it easy for you to stay in touch with your Sales reps.",
				                       "Pay securely online only when the task is complete."];
				$scope.infoTexts = ["1. Register online: log in and complete a short application form",
				                    "2. Get verified. We're big on Trust and compliance, so we require identity verification and one of our representatives will get back to you shortly",
				                    "3. Secure the payment. Fill in the payment details. You can rest assure that we only charge for calls once they've been completed.",
				                    "4. Upload Materials – upload all the relevant materials for training and teleweb calls through our system. We guarantee to start making call to physicians no later than 14 days upon the upload of materials.",
				                    "5. You're done -  Your assigned Panda sales reps will start making calls to physicians according to your requirements and you'll receive detailed reports to inform on progress and performance."];
				$scope.videoSrc= $sce.trustAsResourceUrl("http://www.youtube.com/embed/GWNS9UikfMk");
				this.register = function(){
					$scope.onRegister = true;
				}
			},
			controllerAs: "infoPage"
		}
	});
	
	
	app.directive('registerForm',['$http','$parse', 'fileUpload', function($http, $parse, fileUpload){
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
				$scope.profile = {imageUrl: "//placehold.it/100"};
				$http.post('/static-data', {type:"get-doctor-specialties"}).success(function (options){
					$scope.specialties = options;
				});
				
				$scope.currTab = 1;
				this.setTab = function (tabIndex){
					$scope.currTab = tabIndex;
				};
				this.isSet = function (tabIndex){
					return $scope.currTab === tabIndex;
				};
				this.save = function(profile){
					function newUser(imgId){
						if (imgId){
							$scope.profile.imageUrl = "/fileUpload?id="+imgId;
						}
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
					$scope.profile = profile;
					var types=["MEDREP", "PHARMA", "DOCTOR"];
					$scope.profile.type = types[ctrl.formType];
					if ($scope.profile.specialty){
						$scope.profile.specialty = $scope.profile.specialty.name;
					}
					if ($scope.profile.imageUrl){
				        var uploadUrl = "/fileUpload";
				        fileUpload.uploadFileToUrl($scope.profile.image, uploadUrl, function(id){
				        	newUser(id);
				        });	
					}else {
						newUser();
					}	
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
	            element.bind('change', function(){
	                scope.$apply(function(){
	                	scope.profile.image = element.find('input')[0].files[0];
	                	scope.profile.imageUrl = URL.createObjectURL(scope.profile.image);
	                });
	            })
			}
		};
	}]);
	
	app.directive('medRepForm', ['$http','$parse', 'fileUpload', function($http, $parse, fileUpload){
		return {
			restrict: 'E',
			templateUrl:'welcome/med-rep-form.html',
			scope:{},
			controller: function($scope){
				$scope.profile = {};
				$http.post('/static-data', {type:"get-degrees"}).success(function (options){
					$scope.degreesList = options;
				});

				$scope.currRadio = 'graduate';
				this.setRadio = function (radio){
					$scope.currRadio = radio;
				};
				this.isRadio = function (radio){
					return $scope.currRadio === radio;
				};
				this.save = function(profile){
					$scope.profile = profile;
					$scope.profile.degree = $scope.profile.degree.name;
					function uploadFile(file){
						var dfd = new jQuery.Deferred();
						if (file){
					        var uploadUrl = "/fileUpload";
					        fileUpload.uploadFileToUrl(file, uploadUrl, function(id){
					        	dfd.resolve("/fileUpload?id="+id);
					        });	
						} else {
							dfd.resolve();
						}
						return dfd.promise();
					}
					$.when(uploadFile($scope.profile.degreeScan),uploadFile($scope.profile.idScan))
						.then(function(degreeScanUrl,idScanUrl){
							if (degreeScanUrl){$scope.profile.degreeScanUrl = degreeScanUrl }
							if (idScanUrl){$scope.profile.idScanUrl = idScanUrl }
							$http.post('/user', {type:"new-med-profile",message:JSON.stringify($scope.profile), userId:currentUser.userId}).success(function (resp){
								if (resp.error){

								}else{
									$http.post('/login',{type:'login', message:JSON.stringify(currentUser)}).success(function(user){
										var href = document.location.href;
										document.location.href = (href.replace('welcome','medrep'));
									});
								}
							});
						})
				}
				
			},
			controllerAs: 'medRegisterCtrl',
			link: function(scope, element, attrs, ctrl) {
	            element.bind('change', function(){
	                scope.$apply(function(){
	                	var $elm = $(element);
	                	scope.profile.degreeScan = $elm .find('[name="degreeScan"]')[0].files[0];
	                	scope.profile.idScan = $elm .find('[name="idScan"]')[0].files[0];
	                });
	            })
			}
		};
	}]);
	
	app.directive('doctorForm', ['$http', function($http){
		return {
			restrict: 'E',
			templateUrl:'welcome/doctor-form.html',
			scope:{},
			controller: function($scope){
				$scope.profile = {foi:[], scheduleBy:[true]};
				$http.post('/static-data', {type:"get-call-frequencies"}).success(function (options){
					$scope.frequency = options;
					$scope.profile.callFreq = $scope.frequency[0];
				});

				$http.post('/static-data', {type:"get-languages"}).success(function (options){
					$scope.languages = options;
					$scope.profile.lang = options[options.indexOfName("English")];
				});

				$http.post('/static-data', {type:"get-call-hours"}).success(function (options){
					$scope.callHours = options;
					$scope.profile.callHour = $scope.callHours[0];
				});
				
				$http.post('/static-data', {type:"get-FOI"}).success(function (options){
					$scope.fois = options;
				});

				this.save = function(profile){
					$scope.profile = profile;
					$scope.profile.lang = $scope.profile.lang.name;
					$scope.profile.callHour = $scope.profile.callHour.name;
					$scope.profile.callFreq = $scope.profile.callFreq.name;
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
				$http.post('/static-data', {type:"get-call-quantities"}).success(function (options){
					$scope.callQuantities = options;
					$scope.product.callQuantity = $scope.callQuantities[0];
				});

				$http.post('/static-data', {type:"get-hcp-segments"}).success(function (options){
					$scope.hcpSegments = options;
					$scope.product.hcp = $scope.hcpSegments[0];
				});
				this.save = function(){

					$http.post('/user', {type:"new-pharma-profile",message:JSON.stringify({}), userId:currentUser.userId}).success(function (resp){

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
					var productData = {
							name: $scope.product.name,
							creatorId:currentUser.userId,
							deliveryDate: $scope.product.deliveryDate.getTime(),
							endDate: $scope.product.endDate.getTime(),
							callQuantity: $scope.product.callQuantity.name,
							hcp: $scope.product.hcp.name,
							maturityPhase: $scope.product.hcp.maturityPhase
						};
					$http.post('/products', {type:"new-product", message: JSON.stringify(productData)}).success(function (){

					});	
				}

				
			},
			controllerAs: 'pharmaRegisterCtrl'
		};
	}]);
	

})();

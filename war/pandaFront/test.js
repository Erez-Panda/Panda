
(function (){
	var app = angular.module('test',[]);
	
	app.directive('test', ['$http', function($http){

		return{
			restrict: 'E',
			template:'<div>hello</div>',
			scope:{},
			controller: function ($scope){
				/*
				var req = {
					    "apikey": "n_gv1zWhZ9NdHf65cHUAktR4LNDvXaqlknKt4QUu9rBMKIk5TQuW-FpeYqfNVZLYL5ZPJThvc9BZGI-t1oOLDg",
					    "inputformat":"pdf",
					    "outputformat":"gpj"
					}
				$http.post("https://api.cloudconvert.org/process",req).success(function(resp){
					req = {
						    input: "download",
						    file: "http://pandavideochat.appspot.com/fileUpload?id=6205504040730624",
						    outputformat: "jpg"
						}
					$http.post(resp.url,req).success(function(resp){
						$http.get("https://srv01.cloudconvert.org/process/v4cw72hf3").success(function(resp){
							console.log(resp);
						});
					});
				}).error(function(resp){
					
				});
				*/
				var req = {
					    "apikey": "n_gv1zWhZ9NdHf65cHUAktR4LNDvXaqlknKt4QUu9rBMKIk5TQuW-FpeYqfNVZLYL5ZPJThvc9BZGI-t1oOLDg",
					    "inputformat":"pdf",
					    "outputformat":"gpj"
					}
				xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange=function()
				  {
				  if (xmlhttp.readyState==4 && xmlhttp.status==200)
				    {
				    condole.log(xmlhttp.responseText);
				    }
				  }
				xmlhttp.open("POST","https://api.cloudconvert.org/process",true);
				xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				xmlhttp.send(req);
				

			},
			controllerAs:'tabCtrl'
		}
	}]);
	
	
})();
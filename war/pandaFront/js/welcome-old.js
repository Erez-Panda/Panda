var Panda = (function (){
	function init(){
		$(".register-button").click(openRegisterForm);
		$(".next-button").click(nextRegisterForm);
		$(".submit-button").click(submitRegisterForm);
		$(".button").click(toggle);
	}
	function submitRegisterForm(e){
		//send data to server
		// server will redirect, for change url
		document.location.href = "file:///C:/Users/Erez/Desktop/pandaFront/medrep.html"
	}
	
	function nextRegisterForm(e){
		e.stopPropagation();
		// send data to server
		$("#academic-form").css({display:"block"});
		$("#register-form").css({display:"none"});
		$("#student-radio").click(selectStudent);
		$("#grad-radio").click(selectGrad);
	}
	
	function selectGrad(e){
		$("#student-radio").attr("checked", false);
		$("#student-info").css({display:"none"});
		$("#grad-info").css({display:"block"});
	}
	
	function selectStudent(e){
		$("#grad-radio").attr("checked", false);
		$("#student-info").css({display:"block"});
		$("#grad-info").css({display:"none"});
	}
	

	function openRegisterForm(e){
		e.stopPropagation();
		$("#register-form").css({display:"block"});
		$(".welcome").css({display:"none"});
	}
	
	function toggle(e){
		var mw = $(".main-wrapper");
		var target = $(e.delegateTarget);
		if (target.hasClass("open")){
			target.animate({height:198, width:298},100, function (){
				$(".content-wrapper").css({display:"block"});
				target.removeClass("open");
				target.children(":first-child").css({marginTop:"25%"});
				target.children(".welcome-info-wrapper").css({display:"none"});
			});
		} else {
			$(".content-wrapper").css({display:"none"});
			target.css({display:"block"});
			target.addClass("open");
			target.animate({height:mw.height(), width:mw.width()},100);
			target.children(":first-child").css({marginTop:0});
			target.children(".welcome-info-wrapper").css({display:"block"});
		}
	}
	
	$(init);

})()
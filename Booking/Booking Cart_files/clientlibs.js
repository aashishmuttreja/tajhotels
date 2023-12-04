$(document).ready(function(){
		$(".Terms-cond-head-wrapper").click(function(e){
			if($(".Terms-cond-desc").hasClass("open")){
				$(".image-view").removeClass("up");
				$(".Terms-cond-desc").slideUp(200); ;
				$(".Terms-cond-desc").removeClass('open');

			}
			else{
				$(".Terms-cond-desc").slideDown(200);;
				$(".image-view").addClass("up");
				$(".Terms-cond-desc").addClass('open');
			}
			e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            return false;
		});
});
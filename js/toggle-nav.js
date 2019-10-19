(function(){
	var $toggleBtns=document.querySelectorAll('.js--toggle');
	var toggleCssClass='visible';
	var onClick=function(){
		

		/*this.classList.toggle("active");*/


		var targetSelector=this.getAttribute('data-target');
		var $target=document.querySelectorAll(targetSelector);
		var i, l;
		l=$target.length;
		for(i=0;i<l;i++){
			$target[i].classList.toggle(toggleCssClass);
		}

	};
	var i,l;
	l=$toggleBtns.length;
	for(i=0;i<l;i++){
		$toggleBtns[i].onclick=onClick;
	}

})();
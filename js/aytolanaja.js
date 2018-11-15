(function($) {

//* ********* FUNCION MENU DESKTOP OPEN ITEMS SECOND LEVEL *** */
  Drupal.behaviors.menuDesktop = {
    attach: function(context, settings) {
    	$('header .menu--main > ul li.menu-item--expanded').each(function(index, el) {
    		$(this).once().click(function(event) {
    			if($(this).hasClass('open')){
    				$(this).removeClass('open').children('.menu').slideUp();
    			}else{
    				$('header .menu--main > ul li.menu-item--expanded.open').removeClass('open').children('.menu').slideUp();
					$(this).addClass('open').children('.menu').slideDown();
    			}
    		});
    	});
    }
  };

  //* *********** FUNCION SCROLL TO TOP *** */
  Drupal.behaviors.scrollToTop = {
    attach: function(context, settings) {
      // ===== Scroll to Top ==== 
    $(window).scroll(function() {
        if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
            $('.scroll-to-top').fadeIn(200);    // Fade in the arrow
        } else {
            $('.scroll-to-top').fadeOut(200);   // Else fade out the arrow
        }
    });
    $('.scroll-to-top').click(function() {      // When arrow is clicked
        $('body,html').animate({
            scrollTop : 0                       // Scroll to top of body
        }, 500);
    });
    }
  };

})(jQuery);

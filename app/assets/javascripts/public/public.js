
/* ----- gcc (singleton) ----- */

var gcc = {
  lightboxTarget: 'a.lightbox',
  
  lightboxOpts: {
    'type':'iframe',
		'overlayColor': '#000',
		imageLoading: '/assets/images/plugins/lightbox/lightbox-ico-loading-dark.gif',
		imageBtnClose: '/assets/images/plugins/lightbox/lightbox-btn-close-dark.gif',
		imageBtnPrev: '/assets/images/plugins/lightbox/lightbox-btn-prev-dark.gif',
		imageBtnNext: '/assets/images/plugins/lightbox/lightbox-btn-next-dark.gif',
		imageBlank: '/assets/images/plugins/lightbox/lightbox-blank.gif'
  },
  
  glossaryTooltipTarget: '.glossary',
  
  glossaryTooltipOpts: {
    predelay: 0,
		offset: [-5, 0]
  },
  
  init:
    function () {
      this.initLightbox();
      this.initPrettyPhotoLightbox();
      this.fixInlineImagePadding();
      this.initReveal();
      this.initGlossaryTooltips();
    },
  
  initLightbox: 
		function () {
			$(this.lightboxTarget).lightBox(this.lightboxOpts); 
			
			console.log('this.initLightbox(): GCC - LIGHTBOX INITIALIZED'); 
		},
		
	initPrettyPhotoLightbox:
	  // JUSTIN we need to reduce to a single lightbox,
    // but we're forced to use prettyPhoto to handle Raytheon content
	  function () {
	    $("a[rel^='prettyPhoto']").prettyPhoto();
	    console.log('this.initPrettyPhotoLightbox(): GCC - PRETTY PHOTO LIGHTBOX INITIALIZED');
	  },
	  
  initGlossaryTooltips: 
    function () {
      // This is first used for Raytheon's PBS modules
      $(this.glossaryTooltipTarget).tooltip(this.glossaryTooltipOpts);
      console.log('admin.initGlossaryTooltips(): ADMIN - GLOSSARY TOOLTIPS INITIALIZED');
    },
	  
	initReveal: 
	  // This is first used for Raytheon's PBS modules using the 'show-answer' and 'answer' classes
	  // (i.e. /education/PBSmodules/lesson2Engage/)
	  function () {
	    $('.show-answer').click(function(){
	      console.log("reveal");
	      var $targetElement = $(this).siblings('.answer')
	      if ($targetElement.css('display') == 'none') {
	        $targetElement.slideDown('fast');
	      } else {
	        $targetElement.slideUp('fast');
	      }
	    })
	    console.log('this.initReveal(): GCC - REVEAL INITIALIZED');
	  },
  
  /* These functions are called from the GCC header flash on the home page */
  bannerMouseOver: 
    function () { 
      console.log("gcc.bannerMouseOver()");
      document.getElementById('wrapper_header_2_home').style.overflow='visible';
    },
  
  bannerMouseOut:
  function  () {
    document.getElementById('wrapper_header_2_home').style.overflow='hidden';
  },
  
  fixInlineImagePadding: 
    function () {
      $('.inline_image').each(function(index) {
        if ($(this).css('float') == 'left') {
          $(this).css('padding-left', '0');
        } else if ($(this).css('float') == 'right') {
          $(this).css('padding-right', '0');
        }
      });
    }
} 

/* ----- end gcc (singleton) ----- */




/* ----- mb_mobile_slideshow ----- */

var mb_mobile_slideshow = {
	playing: true,
	current: 0,
	delay: 5000, //in ms
	num_slides: 4,

	init: function(){
	  // Checking for mobile story content so we only run on the home page
	  if ($('#ms_content').length) {
	    console.log('mb_mobile_slideshow.init()');
	    setInterval(mb_mobile_slideshow.autoplay,mb_mobile_slideshow.delay);
		  mb_mobile_slideshow.play();
		}
	},

	pause: function(){
		this.playing = false;
		$('.pause_btn').hide();
		$('.play_btn').show();
	},

	play: function(){
		this.playing = true;
		mb_mobile_slideshow.goto_next();
		$('.play_btn').hide();
		$('.pause_btn').show();
	},

	show: function(slide, pause){
	  var current = mb_mobile_slideshow.current;
	  var btn_id = "#num_btn_" + current.toString();
	  $(btn_id).removeClass('active');
	  mb_mobile_slideshow.current = slide;
	  current = mb_mobile_slideshow.current;
	  btn_id = "#num_btn_" + current.toString();
	  $(btn_id).addClass('active'); 
	  for (var i = 1; i <= this.num_slides; i++){
		  if(i == slide){
				$('#ms_entry_'+i).show()
			} else {
				$('#ms_entry_'+i).hide()
			}
	  }
		if (pause){
			mb_mobile_slideshow.pause();
		}
	},

	goto_next: function(){
	  var current = mb_mobile_slideshow.current;
	  var btn_id = "#num_btn_" + current.toString();
	  $(btn_id).removeClass('active');	  
		if (current < mb_mobile_slideshow.num_slides){
			current = current + 1;
		} else {
			current = 1;
		}
		btn_id = "#num_btn_" + current.toString();
		$(btn_id).addClass('active');
		mb_mobile_slideshow.current = current
		mb_mobile_slideshow.show(current);
	},

	autoplay: function(){
		if (mb_mobile_slideshow.playing){
			mb_mobile_slideshow.goto_next();
		}
	}
};

/* ----- end mb_mobile_slideshow ----- */



/* ----- mb_mobile_utils (singleton) ----- */

var mb_mobile_utils = {
  
  initNav: function () {
    console.log('mb_mobile_utils.initNav()');
    $("#menu_button_top").click(function() {
      $('html, body').animate({
        scrollTop: $("#nav_tier_3").offset().top
      }, 400);
    });
    
    $("#menu_button_bottom").click(function() {
      $('html, body').animate({
        scrollTop: $("#wrapper_header_mobile").offset().top
      }, 400);
    });
  },
  
  shiftElements: function () {
    console.log('mb_mobileUtils.shiftElements()');
    mb_mobile_utils.shiftNav();
    mb_mobile_utils.shiftCaption();
  },
  
  shiftNav: function () {
    // Shift the nav to the bottom of the middle area
    $('#wrapper_middle_2').append($('#middle_2_border'));
  },
  
  shiftCaption: function () {
    $('#right_column .image_caption').insertAfter('#main_image');
  }
  
};

/* ----- end mb_mobile_utils (singleton) ----- */





/* ----- Check for Mobile ----- */

var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	iPad: function() {
		return navigator.userAgent.match(/iPad/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		//console.log("w:" +screen.width + "ua:" + navigator.userAgent + ", isIpad:" + isMobile.iPad());
		return (screen.width <= 500) || ( isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

/* ----- end Check for Mobile ----- */




/* ----- DOM ready ----- */

$(function() {
	
	gcc.init();
  
  // If this is for mobile, shift the nav to the bottom of the main area
  // else match the nav column height to the main area column height
  if ( isMobile.any() && !isMobile.iPad()) {
    mb_mobile_utils.initNav();
    mb_mobile_utils.shiftElements();
		mb_mobile_slideshow.init();
  } else if (isMobile.iPad()) {
    $('.hide_on_ipad').css('display','none');
    $('.show_on_ipad').css('display','block');
    $('#home_right_column_area').css('height', '745px');
		mb_mobile_slideshow.init();
  } 
  
});

/* ----- end DOM ready ----- */

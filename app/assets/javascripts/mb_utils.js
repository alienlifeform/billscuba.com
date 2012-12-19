

/* ----- mb_utils (singleton) ----- */

var mb_utils = {
    
  launch_sized_popup_window:
    function (desktopURL, w, h, layout, scrollbars ) {
      var layout_param = "";
      var scrollbars_param = "0";
      if (layout != undefined) {
        layout_param = "?layout=" + layout;
      } 
      if (scrollbars != undefined) {
        scrollbars_param = scrollbars;
      }
      //console.log('utils.launch_sized_popup_window.scrollbars_param: ' + scrollbars_param );
      var desktop = window.open(desktopURL + layout_param, "_blank","toolbar=0, titlebar=0, menubar=0, scrollbars=" + scrollbars_param + ", resizable=yes, width=" + w + ", height=" + h);
      self.name = "main";
    },
    
  printThis:
    function () {
      var agt = navigator.userAgent.toLowerCase();
      if (window.print) {
        window.print();
      }
      else if (agt.indexOf("mac") != -1) {
        alert("Press 'Cmd+p' on your keyboard to print article. ");
      }
      else {
        alert("Press 'Ctrl+p' on your keyboard to print article. ");
      }
    },
    
  matchColumnHeights:
    // This is necessary to match column heights between the nav and content areas
    function () {
			var middleTargetHeight = $('#wrapper_middle_2').height();
			var navHeightWithoutBottom = $('#middle_2_border').height() - $('#left_nav_bottom_area').height();;
			navBottomTargetHeight =  middleTargetHeight - navHeightWithoutBottom - 4; // Subtract borders
			$('#left_nav_bottom_area').height(navBottomTargetHeight);
    }
    
};

/* ----- end mb_utils (singleton) ----- */



/* ----- Handle Raytheon functions ----- */

function startPopUp(desktopURL, w, h) {
  mb_utils.launch_sized_popup_window(desktopURL, w, h, "none");
};

function startPopUp2(desktopURL, w, h) {
  mb_utils.launch_sized_popup_window(desktopURL, w, h, "none", "1");
};

/* ----- end Handle Raytheon functions ----- */




/* ----- DOM ready and/or loaded----- */

$(window).load(function () {
  mb_utils.matchColumnHeights();
});

/* ----- end DOM ready and/or loaded----- */




/* ----- THIS IS NOT IN USE BECAUSE EARTH SCIENCE WEEK IS NOW AN OUTSIDE LINK ----- */

var esw = {
  
  matchColumnHeights:

    // This is necessary to match column heights between the nav and content areas
    function () {
      var middleTargetHeight = $('#wrapper_middle_2').height();
      var navHeightWithoutBottom = $('#middle_2_border').height() - $('#left_nav_bottom_area').height();;
      navBottomTargetHeight =  middleTargetHeight - navHeightWithoutBottom - 4; // Subtract borders 
      $('#left_nav_bottom_area').height(navBottomTargetHeight);
    }
}

/* ----- DOM ready and/or loaded----- */

$(window).load(function () {
	esw.matchColumnHeights();
});

/* ----- end DOM ready and/or loaded----- */
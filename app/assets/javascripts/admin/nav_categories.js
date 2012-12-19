

/* ----- nav_categories (Singleton) ----- */

/* Note: This is not for the left nav, it is for the reorder items */

var nav_categories = {
  
  transitionSpeed: 200,
  
  init: function ()
  {
    console.log ('init nav_categories');
    $('a.admin_drag_btn').mousedown(function() {
      //$('.sortable_list_admin_nav.subnav').css('display', 'none');
    });
    
    $('.admin_nav_arrow').click(function() {
      $subnav = $(this).siblings('.sortable_list_admin_nav.subnav');
      $navControls = $('.sortable_list_admin_nav.nav > li > .admin_icon_btns_list');
      $arrowButtons = $('.admin_nav_arrow'); 
      if ($subnav.css('display') == 'block') {
        $subnav.slideUp(nav_categories.transitionSpeed); 
        $navControls.removeClass('disabled').fadeTo(nav_categories.transitionSpeed, 1);
        $arrowButtons.fadeTo(nav_categories.transitionSpeed, 1).removeClass('disabled'); 
        $(this).addClass('arrow_rotate');
      } else {
        $subnav.slideDown(nav_categories.transitionSpeed);
        $navControls.fadeTo(nav_categories.transitionSpeed, .3).addClass('disabled');
        $arrowButtons.fadeTo(nav_categories.transitionSpeed, .3).addClass('disabled');
        $(this).stop().fadeTo(0,1).removeClass('disabled'); 
        $(this).removeClass('arrow_rotate');
      }
    });

		//RUSS: Genericize this and reuse.
    $('#nav_id_1').bind('sortupdate', function() {
      /* Grab item_ids from DOM and put into array
       *  convention: db newsletter_news_item_41 #41 would be <li id='newsletter_news_item_41'>
       */
      var tmp_cms_id = "1" // BERGEN are we using nav_categories/1/edit, if so, use the proper cms_id
      var item_type = "content_page" // BERGEN can we pass in item_type and still deal? probably if they're on separate tabs
      var itemIdPrefix = item_type + "_";
      var item_ids = new Array();
      $('#nav_id_1 > li').each(function(idx, item) {
        item_ids.push(item.id.replace(itemIdPrefix,''));
      });

      // Save array to db
      var item_ids_as_string = item_ids.join(',');
      var requestData = { id: tmp_cms_id, item_type: item_type, item_ids: item_ids_as_string };
      adminUtils.remote('reorder_items.js', 'POST', 'script', requestData);
    });

		$('.subnav').bind('sortupdate', function(){
			 var full_id = $(this).attr('id');
			 var parent_id = full_id.replace('subnav_for_', "");
			 var item_ids = [];
			 $(this).children('li').each(function(idx,item){
				  item_ids.push(item.id.replace('subnav_drag_item_', ''));
			 });
			//save array to db
			var item_ids_as_string = item_ids.join(',');
			var requestData = { parent_id: parent_id, item_type: "content_page", item_ids: item_ids_as_string };
			adminUtils.remote('reorder_items.js', 'POST', 'script', requestData);
		});

		$('#missions').bind('sortupdate', function(){
			var full_id = $(this).attr('id');
			var item_ids = [];
			$(this).children('li').each(function(idx,item){
				item_ids.push(item.id.replace('mission_', ''));
			});
			//save array to db
			var item_ids_as_string = item_ids.join(',');
			var requestData = { item_type: "mission", item_ids: item_ids_as_string };
			adminUtils.remote('reorder_items.js', 'POST', 'script', requestData);
		});
  }
  
}
  
/* ----- end nav_categories (Singleton) ----- */


/* ----- DOM ready----- */

$(function() {
	nav_categories.init();
});

/* ----- end DOM ready----- */
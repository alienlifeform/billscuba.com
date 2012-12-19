// JavaScript Document
 

/* ------ adminNlCreate (singleton) ------- */ 

var  
  adminNlUtils = { 

    initItemControls: 
      function (item_type, editControls_items, axis, pixelOffset) 
      { 
        /* Make Sortable */
          //console.log('adminNlUtils.initSection: setting sort params for ' + item_type);
        nl_list(item_type).sortable({ 
          axis: axis,
          handle: 'a.drag_btn',
          tolerance: 'pointer'
          //containment: '#' + nl_container(item_type).attr('id')
        });
        
        /* Write the html to display the edit controls */
          //console.log('adminNlUtils.initSection: displaying edit controls to items');
        nl_items(item_type).prepend(editControls_items);
        
        /* Adjust left margin to fit the controls (optional) */
          //console.log('adminNlUtils.initSection: trying offset: ' + pixelOffset + 'px');
        if (pixelOffset != undefined) {
          nl_list(item_type).css('margin-left', pixelOffset); 
        }

        adminNlUtils.setItemListeners(item_type);
      },

    initSectionControls:
      function (item_type, editControls_header) 
      {
        console.log('initSectionControls()'); 
        /* Don't allow click to select/highlight this element */
        nl_list(item_type).disableSelection();        
        /* Add section-level controls */
        nl_header(item_type).append(editControls_header);
        /* set listeners for all section-level actions */
        adminNlUtils.setSectionListeners(item_type);
      },
    
    setItemListeners:
      function (item_type)
      {
        // Mouseover/mouseout
        nl_items(item_type).mouseover(function() {
          $('ul.admin_icon_btns', this).removeClass('hidden');
        }).mouseout(function() {
          $('ul.admin_icon_btns', this).addClass('hidden');
        });

        // Edit
        $('#nl_' + item_type + 's_list li a.admin_edit_btn').click(function() {
          var item_id = $(this).closest('li[id^=' + item_type + ']').attr('id').replace(item_type + "_",''); // BERGEN should probably be a helper function
          adminDialog.open(adminDialogType.form, 'edit_item', item_type, item_id);
        });
        // Remove
        $('#nl_' + item_type + 's_list > li a.admin_delete_btn').click(function() {
          // Get the item's id from the DOM to pass in
          var item_id = $(this).closest('li[id^=' + item_type + ']').attr('id').replace(item_type + "_",'');
          adminDialog.open(adminDialogType.form, 'remove_item_confirm', item_type, item_id);
        });
      },

    setSectionListeners:
      function (item_type)
      {
        // Find
        $('#nl_' + item_type + 's .nl_header .admin_find_btn').click(function() {
          adminDialog.open(adminDialogType.list, 'find_items', item_type);
        });
        // Add
        $('#nl_' + item_type + 's .nl_header .admin_add_btn').click(function() {
          adminDialog.open(adminDialogType.form, 'new_item', item_type);
        });
        // Reset
        $('#nl_' + item_type + 's .nl_header .admin_reset_btn').click(function() {
          adminDialog.open(adminDialogType.info, 'reset_items_confirm', item_type);
        });
        // Drop
        $('#nl_' + item_type + 's_list').bind('sortupdate', function() {
          /* Grab item_ids from DOM and put into array
           *  convention: db newsletter_news_item_41 #41 would be <li id='newsletter_news_item_41'>
           */
          var itemIdPrefix = item_type + "_";
          var item_ids = new Array();
          nl_items(item_type).each(function(idx, item) {
            item_ids.push(item.id.replace(itemIdPrefix,'')); 
          });

          // Save array to db
          var item_ids_as_string = item_ids.join(',');
          var requestData = { id: cms_id, item_type: item_type, item_ids: item_ids_as_string };
          adminUtils.remote('reorder_items.js', 'POST', 'script', requestData);
        });
      },
  }

var  
  adminNlCreate = 
  { 
    
    // The news items need to offset to adjust for the icon controls
    newsControlsOffsetLeft: -53,  
    
    // These values contain html for the icon buttons that are appended to the newsletter  
    editControlsLeftHeaders: '<ul class="admin_icon_btns admin_btns_header"><li><a title="Find existing items to add to this area" class="admin_icon_btn admin_find_btn" href="javascript:void(0);">find</a></li><li><a title="Add a new item to this area" class="admin_icon_btn admin_add_btn" href="javascript:void(0);">add</a></li><li><a title="Reset this section<br />(more info on click)" class="admin_icon_btn admin_reset_btn" href="javascript:void(0);">reset</a></li></ul>',
    editControlsRightHeaders: '<ul class="admin_icon_btns admin_btns_img_right"><li><a class="admin_icon_btn admin_find_btn" href="javascript:void(0);">find</a></li><li><a class="admin_icon_btn admin_add_btn" href="javascript:void(0);">add</a></li><li><a class="admin_icon_btn admin_reset_btn" href="javascript:void(0);">reset</a></li></ul><div class="clear"></div>',
    editControlsNewsletterNewsItems:'<ul class="admin_icon_btns admin_btns_txt_entry curved_corners_4px hidden"><li><a title="Drag to reposition this item" class="admin_icon_btn admin_drag_btn drag_btn" href="javascript:void(0);">drag</a></li><li><a title="Edit this item" class="admin_icon_btn admin_edit_btn" href="javascript:void(0);">edit</a></li><li><a title="Remove this item" class="admin_icon_btn admin_delete_btn" href="javascript:void(0);">delete</a></li></ul>',
    editControlsNewsletterImageItems: '<ul class="admin_icon_btns admin_btns_vert_tab curved_corners_4px hidden"><li><a title="Drag to reposition this item" class="admin_icon_btn admin_drag_grid_btn drag_btn" href="javascript:void(0);">drag</a></li><li><a title="Edit this item" class="admin_icon_btn admin_edit_btn" href="javascript:void(0);">edit</a></li><li><a title="Remove this item" class="admin_icon_btn admin_delete_btn" href="javascript:void(0);">delete</a></li></ul>',
    editControlsNewsletterTextItems: '<ul class="admin_icon_btns admin_btns_vert_tab admin_btns_vert_tab_top curved_corners_4px hidden"><li><a title="Drag to reposition this item" class="admin_icon_btn admin_drag_grid_btn drag_btn" href="javascript:void(0);">drag</a></li><li><a title="Edit this item" class="admin_icon_btn admin_edit_btn" href="javascript:void(0);">edit</a></li><li><a title="Remove this item" class="admin_icon_btn admin_delete_btn" href="javascript:void(0);">delete</a></li></ul>',
    editControlsNewsletterAdItems: '<ul class="admin_icon_btns admin_btns_vert_tab curved_corners_4px hidden"><li><a title="Drag to reposition this item" class="admin_icon_btn admin_drag_grid_btn drag_btn" href="javascript:void(0);">drag</a></li><li><a title="Edit this item" class="admin_icon_btn admin_edit_btn" href="javascript:void(0);">edit</a></li><li><a title="Remove this item" class="admin_icon_btn admin_delete_btn" href="javascript:void(0);">delete</a></li></ul>',
            
    init:
      function () 
      {
        console.log('adminNlCreate.init');
        this.initNewsletterNewsItemControls();
        this.initNewsletterNewsItemSectionControls();
        this.initNewsletterImageItemControls();
        this.initNewsletterImageItemSectionControls();
        this.initNewsletterAdItemControls();
        this.initNewsletterAdItemSectionControls();
        this.initNewsletterTextItemControls();
        this.initNewsletterTextItemSectionControls();

        admin.initFancybox();
        admin.initTooltips(); // called from here (after already called in admin) to parse title attribute stored in js   
      }, 
       
    initNewsletterNewsItemControls:
      function () { adminNlUtils.initItemControls('newsletter_news_item', this.editControlsNewsletterNewsItems, 'y', -53); },
    initNewsletterImageItemControls:
      function () { adminNlUtils.initItemControls('newsletter_image_item', this.editControlsNewsletterImageItems); },
    initNewsletterAdItemControls:
      function () { adminNlUtils.initItemControls('newsletter_ad_item', this.editControlsNewsletterAdItems, 'y'); },
    initNewsletterTextItemControls:
      function () { adminNlUtils.initItemControls('newsletter_text_item', this.editControlsNewsletterTextItems, 'y'); },

    initNewsletterNewsItemSectionControls:
      function () { adminNlUtils.initSectionControls('newsletter_news_item', this.editControlsLeftHeaders); },
    initNewsletterImageItemSectionControls:
      function () { adminNlUtils.initSectionControls('newsletter_image_item', this.editControlsLeftHeaders); },
    initNewsletterAdItemSectionControls:
      function () { adminNlUtils.initSectionControls('newsletter_ad_item', this.editControlsRightHeaders); },
    initNewsletterTextItemSectionControls:
      function () { adminNlUtils.initSectionControls('newsletter_text_item', this.editControlsRightHeaders); },

    /* ADD from FIND */
    addItem:
      function (item_id, item_type) 
      {
        // save array to db
        // BERGEN we're doing this but what about error handling? pass it in?
        requestData = { id: cms_id, item_type: item_type, item_id: item_id };
        adminUtils.remote(adminUtils.createFullUrl('add_item.js'), 'POST', 'script', requestData);
        /*
        $.ajax({
          url: "/" + cms_controller + "/" + cms_id + "/add_item.js",
          data: { id: cms_id, item_type: item_type, item_id: item_id }, 
          error: broadcastFailure
        });
        */

        function broadcastFailure ()
        {
          var currentTime = new Date();
          console.log("failed to add item at " + formatTime(currentTime));
          $('#dynamic_update').html("failed to add item at " + formatTime(currentTime));
          $('#timestamp').html(String(currentTime)); // set hidden div to the timestamp for later polling (ie 5 minutes ago)  
        }
      },
}; 
/* ------ end adminNlCreate ------- */ 

/* DOM Helper Functions: Find DOM elements based on item_type */

function nl_section (item_type) { return $('#nl_' + item_type + 's'); }
function nl_container (item_type) { return nl_section(item_type).parent(); }
function nl_header (item_type) { return nl_section(item_type).children('.nl_header'); }
function nl_list (item_type) { return nl_section(item_type).children('ul.nl_list'); }
function nl_items (item_type) { return nl_list(item_type).children('li'); }



/* ------ ON READY ------- */

$(function() {
  adminNlCreate.init();
});

/* ------ end ON READY ------- */


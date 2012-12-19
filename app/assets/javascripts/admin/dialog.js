// JavaScript Document
/* ----- adminDialog (Singleton)----- */

var adminDialog = { 
  
  // JUSTIN: setting up visual assets here, should this be in more of a View?
  fixedHeight: 500,
	smallWidth: 400,
	mediumWidth: 500,
	largeWidth: 640,
	
  // JUSTIN: setting width in here? can we override? is this a default?
	container: '<div class="dialog"></div>',
	opts: {
	  autoOpen: false,
		dialogClass: 'custom_dialog', 
		width: this.smallWidth,
		minHeight: 50,
		modal: true,
		hide: 'fade',
		show: 'fade',
		close: function (event, ui) {
			adminDialog.removeButtons();
		}
	},

  init: function () 
  {
    // Initializes the dialog
    $dialog = $(this.container); // setting up this.container as a JQuery "dialog"
		$dialog.dialog(this.opts); 
		console.log('adminDialog.init(): ADMIN DIALOG INITIALIZED');
  },
    
  open: function (dialog_type, path, item_type, item_id) 
  { 
	  // Handles the opening of a new dialog
    var url = adminUtils.createFullUrl(path, item_type, item_id);

	  // Reset the dialog to base settings
	  adminDialog.restoreSettings();
    
    // Set some persistent vars
    adminDialog.dialog_type = dialog_type;
    adminDialog.item_type = item_type;
    adminDialog.item_id = item_id
    
    console.log ('dialog.js__.open.path: ' + path)
    console.log('dialog.url: ' + url)
    

		// Set the title (for the red header)
		$dialog.dialog({   
			// On open, load the dialog html
			open: function (event, ui) {
				$('.dialog').load(url, function() { 
					console.log('DIALOG HAS LOADED')
				  // Ensure centering of the dialog and set the buttons
					$dialog.dialog({
    				position: 'center',
            title: $('#admin_dialog_title').html()
    			});  
          dialog_type(); // calls it as a function to init
				});
			}

		});   
       
		// Open the dialog
		$dialog.dialog('open');	
    
    console.log('adminDialog.open(): NEW DIALOG OPENED - ' + url);  
	}, 

  show: function (messageType, additionalMessage) 
  { 
    // Shows an existing message in the dialog box according to what's passed in
    // The html id's are msg_success, msg_default etc, and must be present in the html 
    // ex: show('success') or show('default')
    console.log('dialog.show.type: ' + messageType);
    console.log('dialog.show.addlMsg: ' + additionalMessage);
	  var elementID = 'msg_' + messageType;
	  var selector = '#' + elementID;
	  		   
	  // Hide all the content
		this.hideAllMessages(); 
		
		// Display the new content 
		$(selector).addClass('admin_dialog_msg_active');

    // Display any additional message content
    $(selector + ' > #additional_msg').html(additionalMessage);

    // Re-init jquery dialog	
    adminDialog.dialog_type();
     		 
	},
	
  close: function () 
  {
  // clears out the buttons and closes the dialog
		this.removeButtons(); // This also happens with the built-in close event
		$dialog.dialog('close');
	}, 

  submitTo: function (form_id, form_target) 
  {
    // Submit a form to a particular route/location
    // Set the url
			if (form_target == undefined) form_target = form_id;
	  var url = adminUtils.createFullUrl(form_target);
    console.log('adminDialog.submitTo(): calling ajaxSubmit to ' + url);
    console.log('adminDialog.submitTo() form.serialize(): ' + $('#' + form_id).serialize())
    
    // Set the form action and submit    
    $('#' + form_id).attr('action', url);
    this.submitForm(form_id);
  },

  submitForm: function (form_id) 
  {      
    // Currently removes buttons and shows the loading message
    console.log('adminDialog.submitForm');
    
    // Show the loading screen
    adminDialog.show('loading');

    // Set the form action and submit
    options = { dataType: 'script' }    
    $('#' + form_id).ajaxSubmit(options);
  },

  removeButtons: function () 
  {
    // clears out the buttons
		$dialog.dialog("option", "buttons", null);
	},


  hideAllMessages: function () 
  {
    // clears out the dialog in preparation for showing a new element
    $('#admin_dialog div').removeClass('admin_dialog_msg_active');
	}, 
		
  restoreSettings: function () 
  {
    // restores the dialog so it can initialize properly for the next call
    $dialog.html('');
    $dialog.dialog({
		  width: adminDialog.smallWidth,
			minWidth: false,
			minHeight: false,
			height: 'auto',
			resizable: false
 		}); 
  },  
  		  
};

/* ----- end adminDialog ----- */


 


/* ----- adminDialogType (Singleton) ----- */

var adminDialogType = {
	
	// Store types of dialogs to be called when the dialog is called
	
	list: function () 
  {
		$dialog.dialog({
			width: adminDialog.largeWidth,
			minWidth: adminDialog.largeWidth,
			maxWidth: adminDialog.largeWidth,
			height: adminDialog.fixedHeight, 
			resizable: true
		});
		adminDialog.list = new AdminList();
	},
		
	listWithImages: function () 
  {
		this.list();
		admin.initLightbox();
	},	

	form: function () 
  {
		$dialog.dialog({
			width: adminDialog.mediumWidth,
			minWidth: adminDialog.mediumWidth,
			maxWidth: adminDialog.mediumWidth,
			height: 'auto', 
			resizable: false
		});
  },
	
	info: function () 
  {
		$dialog.dialog({
			width: adminDialog.smallWidth,
			minWidth: adminDialog.smallWidth,
			maxWidth: adminDialog.smallWidth,
			height: 'auto', 
			resizable: false
		});
	}
	
};

/* ----- end adminDialogType ----- */


/* ------ ON READY ------- */

$(function() {
	adminDialog.init();
});

/* ------ end ON READY ------- */





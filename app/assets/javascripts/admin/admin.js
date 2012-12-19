/*
* admin.js
*
* The objects in this document will be accessed globally by the admin application. 
* This document should be loaded for every admin page. 
*
* Created by Justin Moore
*/  
/* ----- admin (Singleton) ----- */

var admin = {
  
  // JUSTIN: can we separate out the stuff that expects a certain div class from generic stuff?
  // Convention over configuration is good here, should it be in this file?

  controlBoxOpenerTarget: 'a.control_box_opener',
  /*controlBoxClosed: 'a.control_box_closed',
  controlBoxOpenerArrow: '<a class="admin_icon_list_arrow control_box_opener"></a>',
  //controlBoxOpenerHeight: 0,*/ 
  tooltipTarget: '[title]',
  fancyboxTarget: '.fancybox',
  lightboxTarget: 'a.lightbox',
  sortableTarget: 'ul.sortable_list', 
  
  spinnerOpts: {
    width: 6, // The line thickness
		length: 1,
  	color: '#d63b25', // #rgb or #rrggbb
  	className: 'spinner', // The CSS class to assign to the spinner
  },       
   
  tooltipOpts: {
    predelay: 1200,
		offset: [-5, 0]
  }, 
  
  fancyboxOpts: {
    'type':'iframe',
		'overlayColor': '#000'
  },
   
  lightboxOpts: {
    'type':'iframe',
		'overlayColor': '#000',
		imageLoading: '/assets/images/plugins/lightbox/lightbox-ico-loading.gif',
		imageBtnClose: '/assets/images/plugins/lightbox/lightbox-btn-close.gif',
		imageBtnPrev: '/assets/images/plugins/lightbox/lightbox-btn-prev.gif',
		imageBtnNext: '/assets/images/plugins/lightbox/lightbox-btn-next.gif',
		imageBlank: '/assets/images/plugins/lightbox/lightbox-blank.gif'
  },
     
  /*
  ** INITIALIZERS 
  */

  init: function () 
  {
    // Inits features that will exist on every admin page (actually, these don't all exist on every page)
    this.initSpinner();
    this.initTooltips();
		$('.dropkick_menu').dropkick();
    $('.dropkick_filter').dropkick({
			change: function(value, label){
				$('#admin_search_form').submit();
		  }
		});
    this.initControlBoxOpener();
		this.enableAjaxForms();
		this.initLightbox();
		//this.initFancybox(); // NOTE: MUST TEST BEFORE PUSHING THIS LIVE - EVERY .fancybox LINK IS NOW ACTIVE FOR THE FIRST TIME SINCE SEPTEMBER
    this.initSortableList();
		try{
			this.initFullRedactor();
		} catch(err){
			console.log("admin.initRedactor Error loading REDACTOR WYSIWYG. e:" + err.message);
			this.killRedactor(".redactor_full");
		}
		try{
			this.initSidebarRedactor();
		} catch (err) {
			console.log("admin.initRedactor Error loading REDACTOR WYSIWYG. e:" + err.message);
			this.killRedactor(".redactor_sidebar");
		}
		try{
			this.initAirRedactor();
		} catch (err){
			console.log("admin.initRedactor Error loading REDACTOR WYSIWYG. e:" + err.message);
			this.killRedactor(".redactor_air");
		}

  },
    
  enableAjaxForms: function () 
  {
    console.log('admin.enableAjaxForms, total forms on page: ' + $('form').length);
		$('form').submit( function() {
			if ($(this).attr('data-remote') == 'true') {
				adminUtils.remoteSubmit($(this).attr('id'));
					return false;
			}
		});
    console.log('admin.enableAjaxForms complete');
	},


	sortColumn: function (colName,formId)
  {
		var currentSortOrder =  $('#'+formId + '> #sort_order').attr("value");
		var currentSortCol =  $('#'+formId + '> #sort_by').attr("value")
		if (colName.toLowerCase() == currentSortCol.toLowerCase()){
			if (currentSortOrder.toUpperCase() == 'DESC'){
				order = 'ASC';
			} else {
				order = 'DESC';
			}
		} else {
			  order = 'ASC';
		}
		$('#'+formId + '> #sort_order').attr("value", order) ;
		$('#'+formId + '> #sort_by').attr("value", colName) ;
		$('#'+formId).submit();
	},

    
  initSpinner: function () 
  {
    this.spinner = new Spinner(this.spinnerOpts);  
    console.log('admin.initSpinner(): ADMIN - SPINNER INITIALIZED, this.spinnerOpts: ' + this.spinnerOpts);  
  },
    
  initTooltips: function () 
  {
    $(this.tooltipTarget).tooltip(this.tooltipOpts);
    console.log('admin.initTooltips(): ADMIN - TOOLTIPS INITIALIZED');
  },
			
	initFancybox: function () 
  {
		$(this.fancyboxTarget).fancybox(this.fancyboxOpts); 
		console.log('admin.initFancybox(): ADMIN - FANCYBOX INITIALIZED'); 
	},
		
	initLightbox: function () 
  {
		$(this.lightboxTarget).lightBox(this.lightboxOpts); 
		console.log('admin.initLightbox(): ADMIN - LIGHTBOX INITIALIZED'); 
	},

	initFullRedactor: function()
	{
		if ($('.redactor_full').length > 0){
			$('.redactor_full').redactor({
				buttons: ['mb_formatting', 'rtml', '|', 'bold', 'italic', 'link', '|','unorderedlist', 'orderedlist', '|',
					'image','video','table', '|', 'html', '|' ],
				imageUpload: '/admin/images/upload',
				//emptyHtml: '',
				convertDivs: false,
				imageGetJson: '/admin/images/get_recent_images',
				uploadFields: { "authenticity_token": $("meta[name='csrf-token']").attr("content") },
				plugins: ['redactor_modals'],
				buttonsCustom: {
					mb_formatting:{
						title: "Formatting",
						dropdown: {
							h3: {
								title: 'Large Chapter Heading',
								callback: RedactorPlugins.advanced.formattingH3Callback
							},
							h4: {
								title: 'Small Chapter Heading',
								callback: RedactorPlugins.advanced.formattingH4Callback
							},
							citation: {
								title: 'Superscript',
								callback: RedactorPlugins.advanced.citationCallback
							},
							subscript: {
								title: 'Subscript',
								callback: RedactorPlugins.advanced.subscriptCallback
							}
						}
					},
					rtml: {
						title: "Advanced List",
						dropdown: {
//							pullquote: {
//								title: 'Pull Quote',
//								callback: RedactorPlugins.advanced.launch_modal
//							},
							quote: {
								title: 'Quote',
								callback: RedactorPlugins.advanced.launch_modal
							}/*,
							 video: {
							 title: 'Video',
							 callback: videoModuleCallback
							 }*/
						}
					}
				}
			});
		}
	},

	initSidebarRedactor: function(){
		if ($('.redactor_sidebar').length > 0){
			$('.redactor_sidebar').redactor({
				buttons: ['rtml', '|' , 'bold', 'italic', '|', 'link', 'unorderedlist', 'orderedlist', '|', 'html', '|'],
				convertDivs: false,
				plugins: ['redactor_modals'],
				//emptyHtml: '',
				buttonsCustom: {
					rtml: {
						title: "Advanced List",
						dropdown: {
							pullquote: {
								title: 'Sidebar',
								callback: RedactorPlugins.advanced.launch_modal
							}
						}
					}
				}
			});
		}
	},
	initAirRedactor: function(){
		if ($('.redactor_air').length > 0){
			$('.redactor_air').redactor({
				air: true,
				convertDivs: false,
				airButtons: [ 'bold', 'italic', 'link', '|', 'unorderedlist', 'orderedlist', '|' , 'html', '|' ]
			});
		}
	},

	killRedactor: function(redactor_class){
		console.log("Destroying redactor:" + redactor_class);
		$("'"+ redactor_class +"'").destroyEditor();
	},

  initControlBoxOpener: function () 
  {
  // To use this, wrap the h3 (control box header) content in the <a> tag,
  // and add the controlBoxOpenerTarget class ('.control_box_opener') 
	   
	  $(this.controlBoxOpenerTarget).each(function(i){
	     var controlBoxOpener = new ControlBoxOpener(this);
	  });   
    
    console.log('admin.initControlBoxOpener(): ADMIN - CONTROL BOX OPENER INITIALIZED'); 
	},
	
	initSortableList: function () 
  {
    $(this.sortableTarget).sortable({ 
      axis: 'y',
      handle: 'a.admin_drag_btn'
      //connectWith: 'div.admin_control_box'
      //containment: 'div.admin_control_box'
    });
    console.log('admin.initSortableList(): ADMIN - SORTABLE LIST INITIALIZED');
  },
	
	   
  /*
  ** ACTIONS
  */

   
  toggleHelpMsg: function (selector) 
  { 
    // Toggles the display of the selector by sliding
	  var s = selector;
		if ($(s).css('display') == 'none'){
			$(s).slideDown(200);
		} else {
			$(s).slideUp(200);
		}	
	},
		 
	showSpinner: function (elementID)
	{ 
  // Displays the spinner in the selector
		var s = document.getElementById(elementID);
	  this.spinner.spin(s);
	}

};
   
/* -----  end admin ----- */



/* ----- adminUtils (Singleton)- ----- */

var adminUtils = {
  createFullUrl: function (path, item_type, item_id)
  {
    console.log('adminUtils.createFullUrl params: ', path, item_type, item_id)
    var url;
    if (path.indexOf('/') == 0) {
      url = path + "?";
    } else {
      url = "/" + cms_controller + "/";
      if (cms_id != '') url += cms_id + "/";
      url += path + "?";
    }
    if (item_id != null) url += "item_id=" + item_id + "&";
    if (item_type != null) url += "item_type=" + item_type;
    return url;
  },

  remote: function (url, request_type, response_type, data) 
  {
    // hits a url using ajax
    if (request_type == null) request_type = 'GET';
    if (response_type == null) response_type = 'script';
    console.log('adminUtils.remote ajax: ' + request_type + ' ' + url);
    $.ajax({
      type: request_type,
      dataType: response_type,
      url: url,
      data: data,
      error: function (xhr, ajaxOptions, thrownError) {
        console.log('ajax error for ' + url);
        console.log('ajax error status: ' + xhr.status);
        console.log('ajax error: ' + thrownError);
      },
      success: function() { console.log('ajax success for ' + url) },
      complete: function () { console.log('ajax complete for ' + url)  }
     });
  },

  remoteSubmit: function (form_id, fancybox_url) 
  {
    // submits a form using ajax
    var this_form = $('#' + form_id);
    var form_target = this_form.attr('action');

    // submit to form action unless overriden for fancybox preview
    if (fancybox_url) {
      this_form.attr('action', fancybox_url); // As of Oct. 2012, this is the only consistent way to set 'action': http://stackoverflow.com/questions/979024/changing-the-action-of-a-form-with-javascript-jquery
    }

    // expect javascript response unless overriden, html for fancybox preview
    var response_data_type = fancybox_url != null ? 'html' : 'script';
    
    // submit using post method unless hidden fields or form attributes are set (in that order)
    var request_method = 'post';
    if ($('#' + form_id + ' > input[name=_method]').length > 0) request_method = $('#' + form_id + '> input[name=_method]');
    else if (this_form.attr('method').length > 0) request_method = this_form.attr('method');

    console.log('admin.submitRemote: ' + $('#' + form_id).attr('id') + '.submit()')
    console.log('admin.submitRemote: submitting remotely to ' + this_form.attr('action') + ' via ' + this_form.attr('method'))
    console.log('admin.submitRemote: request method : ' + request_method);
    //console.log('admin.submitRemote: parameters would be something like: ' + this_form.serialize())

    options = {
      dataType: response_data_type,
      cache: false,
      type: request_method
    }

    // put results into a fancybox for preview, etc.
    if (fancybox_url) options.success = function (data) {
			$.fancybox(
				data,
			{
				'afterClose': function(){ adminUtils.stop_saving_animation(); }
			});
		}
  
    console.log('this_form is ' + this_form.attr('id'));
    console.log('this_form.ajaxSubmit is ' + this_form.ajaxSubmit.length);

    // submit the form
    this_form.ajaxSubmit(options);
    
    // reset form action and return
    if (fancybox_url) this_form.attr('action', form_target);
    return false;
  },

	showDefaultFormElements: function (itemsToCheck)
  {
		for (var i in itemsToCheck){
			this.showAndHide(itemsToCheck[i]);
		}
	},

	toggleFormFields: function (itemsToCheck, itemId)
  {
		for(var i in itemsToCheck){
			if (itemsToCheck[i].id == itemId){
				this.showAndHide(itemsToCheck[i])
			}
		}
	},

	showAndHide: function (item)
  {
		if (item == null){
			console.log("ERROR: Undefined or null form element: " + item);
		} else {
			if( $('#'+ item.id).is(':checked')){
				for(var h in item.hide){
					$('.'+ item.hide[h]).hide();
				}
				for(var j in item.show){
					$('.'+ item.show[j]).show();
				}
			} else { //if the box is unchecked, hide the items in show, and show the items in hide
				for(var h in item.show){
					$('.'+ item.show[h]).hide();
				}
				for(var j in item.hide){
					$('.'+ item.hide[j]).show();
				}
			}
		}
	},

	show_saving_animation: function(){
		if ($('#saving').length > 0){
			$('#saving').show();
			window.scrollTo(0,200);
		}

 	},

	stop_saving_animation: function(){
		if ($('#saving').length > 0){
			$('#saving').hide();
		}
	},

	loadImage: function (id) 
  {
		var input, file, fr, img;
       
    console.log("file:" + file);
    
    var $inputField = $('#'+id);
		var $browse_thumb = $inputField.siblings('.browse_thumb');
		var $fileInfo = $browse_thumb.find('.file_info');
    
    var apiNotSupported = typeof window.FileReader !== 'function';
    
		if (apiNotSupported) {
			console.log("The file API isn't supported on this browser yet.");
			$browse_thumb.css('display', 'none'); // This occurs in Safari
			return;
		}

		input = document.getElementById(id);
		if (!input) {
			console.log("Um, couldn't find the imgfile element.");
		}
		else if (!input.files) {
			console.log("This browser doesn't seem to support the `files` property of file inputs.");
		}
		else if (!input.files[0]) {
			console.log("Please select a file before clicking 'Load'");
		}
		else {
			file = input.files[0];
			fr = new FileReader();
			fr.onload = createImage;
			fr.readAsDataURL(file);
		}

		function createImage() {
			img = document.createElement('img');
			img.onload = imageLoaded;
			img.style.display = 'none'; // If you don't want it showing
			img.src = fr.result;
			document.body.appendChild(img);
		}

		function imageLoaded() {
      //console.log('admin.imageLoaded()');
 			$browse_thumb.find('img').css('display', 'none');
 			$fileInfo.css('display','block').html('dimensions of new file: ' + img.width + 'w x ' + img.height + 'h').addClass('file_info_details');
 			$browse_thumb.append($fileInfo); 
 			
			// This next bit removes the image, which is obviously optional -- perhaps you want
			// to do something with it!
			img.parentNode.removeChild(img);
			img = undefined;
		}
		
	},


	
  alertUser: function (msg, preview_url) 
  {
    var currentTime = new Date();
    msg += " at " + formatTime(currentTime) + "."
    console.log('adminUtils.alertUser.preview_url: ' + preview_url)
    if (preview_url != undefined) msg += "  <a href='" + preview_url + "'>view changes</a>";
    console.log('adminUtils.alertUser.msg: ' + msg);
    $('#dynamic_update').html(msg);
    $('#timestamp').html(String(currentTime)); // set hidden div to the timestamp for later polling (ie 5 minutes ago)  
  },

	submitOnKeypressReturn: function (targetField, targetForm) 
  {
	  // Submits a form on keypress return if an input field is in focus (i.e. on login page, search) 
	  // Called from login page, but otherwise called from admin.js
	  $(function() {
	    console.log('submitOnKeypressReturn') 
      $(targetField).keypress(function (e) {
        var keyCode = e.keyCode || e.which;
        console.log("keypress.keycode: "+ keyCode);
          if (keyCode == 13) {
            e.preventDefault();
            $(targetForm).submit();  
          }
      });   
    });
	}
};

 



/* ----- ControlBoxOpener (constructor and utils) ------ */

var ControlBoxOpener = function (target) {
  // JUSTIN: we are creating visual assets here, is this appropriate?
  
  //this.controlBoxOpenerTarget = target;
  this.closedClass = 'a.control_box_closed';
  this.arrowHtml = '<a class="admin_icon_list_arrow control_box_opener"></a>';
  
  // prepend the arrow to the header 
  $(target).parent().prepend(this.arrowHtml);
  
  // Set the target var here, after prepending (it needs to parse the arrow after it's prepended) 
  var $target = $(target);
  var $targetClosed = $(this.closedClass);
  this.container = $(target).closest('.admin_control_box');
  this.area = $('.admin_control_box_full_width_area', this.container);
  this.divHeight = $(this.area).height();
  console.log('this.divHeight: ' + this.divHeight);
    
  // Add the voided href
  $target.attr('href', 'javascript:void(0);');
  
  // Set the listener to toggle the visibility on click 
  
  $(target).click(function(){
    console.log("clicked, $(target) " + target);          
    ControlBoxOpenerUtils.toggleVisibility(this, this.divHeight);
  }); 
  
  // If the 'closed' class has been added, then force close right away  
  if ($targetClosed) {
    ControlBoxOpenerUtils.toggleVisibility($targetClosed, this.divHeight, true);
  }; 
  
  console.log('ControlBoxOpener(): NEW CONTROL BOX OPENER CREATED'); 
} 


ControlBoxOpenerUtils = {
  toggleVisibility: function (selector, divHeight, forceClose) 
  {
    
    console.log('toggleVisibility().divHeight: ' + divHeight);
    
    var $selector = $(selector);  
    var container = $selector.closest('.admin_control_box');
    var arrow = $('a.admin_icon_list_arrow', container);       
    var area = $('.admin_control_box_full_width_area', container);
    var areaIsOpening = $(area).css('display') == 'none';    
    /*if ($(area).height() > 0) {
       this.divHeight = $(area).height();
    } 
    var areaH = this.divHeight;
    console.log('areaH = ' + areaH); */        

    if (forceClose) { 
      $(area).css('display', 'none');
      $(arrow).addClass('arrow_rotate'); 
    } else {              
      if (areaIsOpening){
        //$(area).show().animate({ height : areaH }, { duration: 400 });
        $(arrow).removeClass('arrow_rotate');
        $(area).slideDown(400);
      } else {
        console.log('div height: ' + $(area).height()); // Store this for each instance and use with animate method  
        $(arrow).addClass('arrow_rotate');
        $(area).slideUp(400); 
        /*$(area).animate({ height: 0 }, { duration: 400, complete: function () {
          $(area).hide();
          } 
        });*/
      }
    } 
  }
}

/* ----- end ControlBoxOpener (constructor and utils) ------ */

/* ----- DOM ready----- */

$(function() {
	admin.init();
});

/* ----- end DOM ready----- */


/* Not being used (yet?) 
	exists:
		function (selector) {
			// Pass in an id or class name... returns true or false
			return $(selector).length;
		},
	
	extractFilename:
		function (filepath) {
			var f;
			if (filepath) {
				f = filepath.split('/').pop();
			} else {
				f = 'Filename not found';
			}
			return f;
		}
		*/


/* ----- end adminUtils ----- */


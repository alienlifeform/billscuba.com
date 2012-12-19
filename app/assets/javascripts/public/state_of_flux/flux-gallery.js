// JavaScript Document
	
var	
	currentEntryId = 'entry0',
	totalEntries = 0,
	thumbSlots = 6,
	currentThumbRow = 0,
	currentCategory = 'all',
	currentThumbDiv,
	currentThumbIndex,
	startIndex,
	endIndex,
	currentState = 'image',
	pathToMainImages = '/system/gallery_images/main/',
	pathToThumbImages = '/system/gallery_images/thumb/',
	controls = {},
	ie =  ($.browser.msie),
	ie_lt_9 = (ie && $.browser.version < 9),
	
	//cached dom selections for optimal performance
	selections = {
		flux_control_rail: $('.flux_control_rail'),
		sorters_and_regions: $('.sorters_and_regions'),
		body: $(document.body),
		thumbnail_menu: $('#thumbnail_menu'),
		thumbnail_strip: $('#thumbnail_strip'),
		thumbnail_screen_count: $('.thumbnail_screen_count'),		
		tiled_thumbnail_controls: $('.tiled_thumbnail_controls'),
		left_thumb_arrow: $('#left_thumb_arrow'),
		right_thumb_arrow: $('#right_thumb_arrow'),
		main: $('#main'),
		description_area: $('#description_area'),
		image_area : $('#image_area'),
		featured_image: $('#featured_image'),
		description_left: $('#description_left'),
		description_right: $('#description_right'),
		nav_count: $('.nav_count'),
		gallery_preload_area: $('#gallery_preload_area'),
		displayed_featured_image: $('#displayed_featured_image'),
		description_area: $('#description_area'), 
		description_h1: $('#description_h1'),
		description_paragraph: $('#description_paragraph'),
		description_credits: $('#credits'),
		credits_link: $('#credits_link'),
		description_date1: $('#date1'),
		description_date2: $('#date2'),
		description_date3: $('#date3'),
		description_date4: $('#date4'),
		map_canvas: $('#map_canvas')	
	}
;



$(document).ready(function(){
	
	controls.leftArrowBtn = 
		$('.nav_arrow_controls .nav_arrow_left').add('cite',selections.featured_image).click(
			function(e){ if (!$(this).is('.inactive')) {onNavArrowClick('left'); $(this).trigger('hover')};});
	
	controls.rightArrowBtn = 
		$('.nav_arrow_controls .nav_arrow_right').add('code',selections.featured_image).click(
			function(e){ if (!$(this).is('.inactive')) {onNavArrowClick('right'); $(this).trigger('hover');}});
	
	selections.bigButtons = controls.rightArrowBtn.add(controls.leftArrowBtn).not('div,span');
	
	$('.view_btn_image').click(function(e){ 
		if (selections.flux_control_rail.hasClass('map_mode') || selections.flux_control_rail.hasClass('thumbnail_mode'))
			onViewButtonClick('image'); 
	});
	
	$('.view_btn_map').click(function(e){ if (!selections.flux_control_rail.hasClass('map_mode')) onViewButtonClick('map'); });
	
	$('#header_right a').eq(1).click(function(e){ displayAboutMessage(); return false; });
	
	$('#share_links a').hover(
		function(e){ $('#share_links .footer_title').css('color', '#fff');},
		function(e){ $('#share_links .footer_title').css('color', '#c8c5c5');}
	);
	
	selections.credits_link.click(function(e){ displayCredits(); });
	
	$('tt',selections.description_right).click(function(e){ onViewButtonClick('map'); }).fadeTo(0,0);
	
	$('a',selections.sorters_and_regions).click(function(e){ 
		if (!$(this).hasClass('selected')) 
			Thumbnails.applyFilter(this); 
		return false; 
	});
	
	selections.left_thumb_arrow.click(function(e){ Thumbnails.shiftThumbRow('left'); });
	
	selections.right_thumb_arrow.click(function(e){ Thumbnails.shiftThumbRow('right'); });
	
	$('.view_btn_all').click(Thumbnails.showAll);
	
	//clone control rail:
	selections.flux_control_rail_clone = selections.flux_control_rail.clone(true,true).addClass('thumbnail_mode')
		.find('.nav_arrow_controls,.regionBox').remove().end();
		
	initializeInterface();
	
	if ($.browser.msie) $(document.body).addClass('ie');
	
	selections.thumbnail_menu.bind("shrink", Thumbnails.resetMenu);
	
	//social bindings:
	$('#email_link').click(Social.sendEmail);
	$('#facebook_link').click(Social.shareOnFacebook);
	$('#twitter_link').click(Social.tweetThis);
	$('#download_link').click(Social.downloadThis);
	
	//layout adjustments:
	if (navigator.userAgent.toLowerCase().indexOf('firefox') != -1) $('body').addClass('firefox');
 
});


function initializeInterface() 
{
	// Set the total number of entries
	totalEntries = imageContent.length;
	
	buildUIfromImageContent();
	
	// Set the inital context values
	fluxManager.activeThumbnails = fluxManager.allThumbnails.toArray();
	currentThumbIndex = fluxManager.activeThumbnails.indexOf(currentThumbDiv);
	startIndex = 0;
	endIndex = thumbSlots;
	
	fluxManager.setCurrentEntry(fluxManager.initialEntryId);
	transitionFromMapState();	
	
	if (!isMapLocator) bindAddressBar();	
	else {
		$('.flux_control_rail').hide();
		selections.featured_image.hide();
		$('#menu_area').hide();
		$('#header_right').hide();
		$('#description_area').hide();
		$('#footer').hide();	
		map.enableScrollWheelZoom();
		map.addControl(mapTypeControl);
		map.enableDragging();	
		currentZoomLevel = 8;
	}	
	buildRegionBox();
}


function updateAddressBar()
{
	if (window.location.hash.substring(1) == fluxManager.getCurrentEntry().mainImageName) 
		return false;
	window.location.hash = fluxManager.getCurrentEntry().mainImageName;
}


function bindAddressBar(){
	$(window).bind("hashchange",function(){
		var entryId = (window.location.hash != "") ? 
		fluxManager.getCurrentEntryByMainImageName(window.location.hash.substring(1)).id : imageContent[0].id;
		fluxManager.setCurrentEntry(entryId);
		updateImageCount();
		displayNewContent();
	});
	if (updateAddressBar() == false) $(window).trigger("hashchange");
}


function buildRegionBox()
{	
	var
		promptOption = $('<div />',{text: "select a region"}),
		regionBox = 
			$('.regionBox')
				.bind("reset", function(){$(this).prepend(promptOption).removeClass('regionBoxOpen');}),			
		selectItem = 
			function(e){	
				map.setCenter($(this).prependTo(regionBox.removeClass('regionBoxOpen')).data('region').latLng, $(this).data('region').zoom); 
				promptOption.detach();
			};	
	$.each(regions,function(regionName,regionValues){
		regionBox.append($('<div />',{text: regionName, data: {region: regionValues}, click: selectItem}))
	});
	regionBox.prepend(promptOption);
	$('.hitBox',regionBox).click(function(){regionBox.toggleClass('regionBoxOpen')});
}


function onNavArrowClick ( direction ) 
{	
	// Update the new index
	if (direction == 'right' && currentThumbIndex < fluxManager.activeThumbnails.length - 1) currentThumbIndex++;
	if (direction == 'left' && currentThumbIndex > 0)  currentThumbIndex--;
	updateNavArrowStates();	 	
	fluxManager.setCurrentEntry(fluxManager.activeThumbnails[currentThumbIndex].id);	
	updateAddressBar();
}


function onViewButtonClick(destination)
{
	$('.regionBox').trigger("reset");		
	if (destination == 'image'){
		displayNewContent();
	} 
	else if ( destination == 'map' ) {
		selections.thumbnail_menu.trigger("shrink");
		$('#download_link').hide();
		selections.flux_control_rail.removeClass('thumbnail_mode').addClass('map_mode');			
		selections.map_canvas.css('display', 'none');
		
		// Reveal the description area before showing the map
		selections.description_area.stop(true,true).slideUp(300, function() {
			selections.featured_image.stop(true,true).fadeTo(400, 0, function() {
				selections.featured_image.css('display', 'none');				
				selections.image_area.append(selections.map_canvas);			
				selections.map_canvas.css('width', '930px').css('height', '600px');
				selections.map_canvas.stop(true,true).fadeTo(400, 1);
				displayLargeMap();				
			});
		});
	}	
	currentState = destination;
}



function loadEntryById(id)
{
	selections.thumbnail_menu.trigger("shrink");
	fluxManager.setCurrentEntry(id);
	updateAddressBar();
}


function onMapMarkerClick(id) 
{	
	// Display new content
	updateAddressBar();
}


function hideContent() 
{
	selections.description_left.css('opacity', '0');
	selections.description_right.css('opacity', '0');
	$('.date').css('opacity', '0');
	selections.featured_image.css('opacity', '0');
}


function displayNewContent() 
{
	hideContent();	
	if (currentState == 'map' || currentState == 'allImages') transitionFromMapState();
	selections.thumbnail_menu.trigger("shrink");
	Thumbnails.selectCurrent();
	Thumbnails.updateViewable();
	displayImageAndDescription();
}


function displayImageAndDescription () 
{
	disableBigNextAndPreviousButtons();
	var entry = fluxManager.getCurrentEntry();
	var mainImagePath = pathToMainImages + entry['mainImageName'];
	var newSlideImage = $('<img />',{src: mainImagePath});
	selections.gallery_preload_area.html(newSlideImage);
	if (!entry.imagePreloaded) selections.image_area.addClass('spin');
	
	newSlideImage.imgpreload(function() {
		if (!entry.imagePreloaded) entry.imagePreloaded = true;
		if (fluxManager.getCurrentEntry() != entry) return;
		selections.image_area.removeClass('spin');
		
		// Add the loaded image to the main area
		var newImgHeight = newSlideImage.height();
		selections.displayed_featured_image.replaceWith(newSlideImage);
		selections.displayed_featured_image = newSlideImage;		
		selections.featured_image.animate({height: newImgHeight, opacity: 1 }, 400, function(){updateNavArrowStates();});		
		selections.description_h1.html(entry['title']);	
		selections.description_paragraph.html(entry['description']);
		selections.description_credits.html(entry['credits']);
		selections.description_date1.html(entry['date1']);
		selections.description_date2.html(entry['date2']);
		
		//populate/depopulate date3 and toggle triptych class and quadruple
		selections.description_date3.html(entry['date3'] || "");
		selections.description_date4.html(entry['date4'] || "");
		if (entry['date3'] && !entry['date4'])	selections.description_area.addClass('triptych');
		else selections.description_area.removeClass('triptych');
		if (entry['date4'])	selections.description_area.addClass('quadruple');
		else selections.description_area.removeClass('quadruple');		
		selections.description_left.fadeTo(400, 1);
		selections.description_right.fadeTo(400, 1);
		$('.date').fadeTo(400, 1);
				
		showLocation();
		if (map) map.checkResize();	
		displaySmallMap();
	});
}



function transitionFromMapState () 
{
	currentState = 'image';
	fluxManager.closeDataWindows(fluxManager.dataWindows);	
	// Switch the view button
	selections.flux_control_rail.removeClass('map_mode thumbnail_mode');
	
	// Show the download button if it's hidden
	if (!$('#download_link').is(':visible')) $('#download_link').show();
	
	// Show the feature image area
	// Do this right away to avoid it collapsing during transition
	selections.featured_image.css('display', 'block');
	
	// Add the map to the description area
	selections.description_right.prepend(selections.map_canvas);
	selections.map_canvas.css('width', '240px').css('height', '148px');
	
	// Reveal the description area
	selections.description_area.slideDown(300);
}



function updateNavArrowStates() 
{			
	if (currentThumbIndex == fluxManager.activeThumbnails.length - 1) 
		controls.rightArrowBtn.addClass('inactive');
	else 
		controls.rightArrowBtn.removeClass('inactive');	
	
	if (currentThumbIndex == 0 ) controls.leftArrowBtn.addClass('inactive');
	else 	controls.leftArrowBtn.removeClass('inactive');
}

function disableBigNextAndPreviousButtons(){
	selections.bigButtons.addClass('inactive');
}



var Thumbnails = {

 resetMenu:
 	function(){
		if (selections.thumbnail_menu.data('open')){
			selections.thumbnail_menu.stop(true,true).removeClass('open').animate({height: "160px"},500,"swing").data('open',false);
			selections.description_area.add(selections.image_area).stop(true,true).slideDown(500);
			selections.right_thumb_arrow.add(selections.left_thumb_arrow).show();
			selections.flux_control_rail_clone.add(selections.sorters_and_regionsClone).stop(true,true).hide()
				.add(selections.flux_control_rail).removeClass('thumbnail_mode');
		}	
	},
	

 showAll:
 	function(){
		currentState = 'allImages';
		$('#download_link').hide();
 		if (!Thumbnails.gridIsInitialized) Thumbnails.initializeGrid();
		selections.flux_control_rail.removeClass('map_mode').addClass('thumbnail_mode');	
		selections.description_area.add(selections.image_area).stop(true,true).slideUp(500);		
		selections.thumbnail_menu.stop(true,true).addClass('open').animate({height: "1002px"},500,"swing").data('open',true);		
		selections.thumbnail_strip.css("margin-top",0);
		Thumbnails.Paginator.reset();
		selections.right_thumb_arrow.add(selections.left_thumb_arrow).hide()
		// Show duplicate control rails at bottom of screen		
		selections.sorters_and_regionsClone.stop(true,true).hide().appendTo(selections.main).fadeIn(400).slideDown(400);				
		selections.flux_control_rail_clone.stop(true,true).hide().appendTo(selections.main).fadeIn(400);	
		if ($(this).is('a')) return false;		
	},
	
	
	initializeGrid:
		function(){
			selections.sorters_and_regionsClone = selections.sorters_and_regions.clone(true,true);
			selections.sorters_and_regions = selections.sorters_and_regions.add(selections.sorters_and_regionsClone);
			selections.thumbnail_screen_count = selections.thumbnail_screen_count.add('.thumbnail_screen_count',selections.flux_control_rail_clone);
			selections.tiled_thumbnail_controls = selections.tiled_thumbnail_controls.add('.thumbnail_screen_count',selections.flux_control_rail_clone);
			selections.left_thumbnail_page_arrow = $('.tiled_thumbnail_controls',selections.body.add(selections.flux_control_rail_clone)).find('.nav_arrow_left');
			selections.right_thumbnail_page_arrow = $('.tiled_thumbnail_controls',selections.body.add(selections.flux_control_rail_clone)).find('.nav_arrow_right');
			selections.left_thumbnail_page_arrow.click(Thumbnails.Paginator.pageDown)
			selections.right_thumbnail_page_arrow.click(Thumbnails.Paginator.pageUp);
			Thumbnails.gridIsInitialized = true;
		},
	
	
	applyFilter:
		function(target){	
			Thumbnails.conceal();
			fluxManager.allThumbnails.show();
			setSelectedSortButton(target);			
			currentCategory = $(target).data('sortby');
			
			//set activeThumbnails
			fluxManager.activeThumbnails = (currentCategory == 'all') 
				? $('div',selections.thumbnail_strip).toArray() 
				: fluxManager.getThumbnailDivsByCategory(currentCategory).toArray();
			
			selections.thumbnail_strip.hide().stop(true, true).css("margin-top", 0).fadeIn(400);	
			updateImageCount();
			Thumbnails.reveal(); 
			currentThumbRow = 0;
			currentThumbIndex = 0;
			
			
			// Empty the active thumbnails array
			if (currentState != 'allImages') currentThumbDiv = fluxManager.activeThumbnails[0];
			// Sets the currentEntryID back to 0
			if (currentState != 'allImages') currentEntryId = $(currentThumbDiv).attr('id');
			
			updateNavArrowStates();
			Thumbnails.Paginator.reset();			
			if (currentState == 'map') displayMarkersByCategory();
			
			// Updates the url
			if (currentState =='image') updateAddressBar();
		},
	

 	updateArrows:
 	 	function(){
			if (currentThumbRow == 0) selections.left_thumb_arrow.addClass('inactive');
			else selections.left_thumb_arrow.removeClass('inactive');				
			if (fluxManager.activeThumbnails.length < ((currentThumbRow + 1) * thumbSlots) || fluxManager.activeThumbnails.length <=6) 
				selections.right_thumb_arrow.addClass('inactive');
			else selections.right_thumb_arrow.removeClass('inactive');
		},
		
		
 	selectCurrent:
		function(){
			//if requested thumbnail is not present in current filtered thumbnail set, reveal all thumbs and select 
			if (fluxManager.activeThumbnails.indexOf(currentThumbDiv) == -1){
				Thumbnails.conceal();
				fluxManager.allThumbnails.show();
				setSelectedSortButton($('#removeFilter')[0]);			
				currentCategory = "all";
				fluxManager.activeThumbnails = $('div',selections.thumbnail_strip).toArray();
				Thumbnails.reveal();
				Thumbnails.updateViewable();
				updateImageCount();
			}
			$('.selected',selections.thumbnail_strip).removeClass('selected');			
			$(currentThumbDiv).addClass('selected');
		},
		
		
	shiftThumbRow:
	 	function(direction){
			startIndex = (direction == 'left') ? (currentThumbRow-1) * thumbSlots : (currentThumbRow+1) * thumbSlots;
			endIndex = (direction == 'left') ? (currentThumbRow) * thumbSlots : (currentThumbRow+2) * thumbSlots;		
			var marginShift, 
				currentTopMargin = parseInt(selections.thumbnail_strip.css("margin-top")),
				minimumTopMargin = Math.ceil(fluxManager.activeThumbnails.length/6 - 1)*(-167);
			if (direction == 'left') marginShift = (currentTopMargin != 0) ? "+=167" : 0;
			else marginShift = (currentTopMargin > minimumTopMargin) ? "-=167" : 0;			
			if (marginShift) selections.thumbnail_strip.hide().stop(true, true).css("margin-top", marginShift).fadeIn(400);
			//update thumbnail Strip Arrows
			currentTopMargin = parseInt(selections.thumbnail_strip.css("margin-top"));
			if (direction=="left" && currentTopMargin == 0) selections.left_thumb_arrow.fadeTo(0,.5);
			else selections.left_thumb_arrow.fadeTo(0,1);
			if (direction=="right" && currentTopMargin == minimumTopMargin) selections.right_thumb_arrow.fadeTo(0,.5);
			else selections.right_thumb_arrow.addClass('inactive').fadeTo(0,1);
		},


	reveal:
		function(){
			fluxManager.allThumbnails.not(fluxManager.activeThumbnails).hide();
			Thumbnails.Paginator.updateDisplay();
			selections.thumbnail_strip.stop(true,true).fadeTo(400,1);
		},
		

	conceal:
		function(){
			selections.thumbnail_strip.stop(true,true).fadeTo(0,0);	
		},
		
	updateViewable:
		function(){
			if (currentThumbIndex = -1) currentThumbIndex = fluxManager.activeThumbnails.indexOf(currentThumbDiv);
			if (Math.floor(currentThumbIndex/6)*-167 != parseInt(selections.thumbnail_strip.css('margin-top'))){
				Thumbnails.conceal();
				selections.thumbnail_strip.css("margin-top",(Math.floor(currentThumbIndex/6))*-167);
				Thumbnails.reveal();
			}
		},
		
	Paginator: {
	
				reset:
					function(){
						if (!Thumbnails.gridIsInitialized) Thumbnails.initializeGrid();
						Thumbnails.Paginator.TotalEntries = fluxManager.activeThumbnails.length;
						Thumbnails.Paginator.Pages = Math.ceil(Thumbnails.Paginator.TotalEntries / 36);
						Thumbnails.Paginator.CurrentPage = 1;
						selections.left_thumbnail_page_arrow.addClass('inactive');						
						Thumbnails.Paginator.updateDisplay();
						Thumbnails.Paginator.updateArrows();
						selections.thumbnail_strip.css("margin-top",0);
					},
					
				updateDisplay: 
					function(){
						selections.thumbnail_screen_count.html(Thumbnails.Paginator.CurrentPage + " of " + Thumbnails.Paginator.Pages);						
					},
				
				updateArrows:
					function(){ 
						if (Thumbnails.Paginator.CurrentPage < Thumbnails.Paginator.Pages) selections.right_thumbnail_page_arrow.removeClass('inactive');
						else selections.right_thumbnail_page_arrow.addClass('inactive');						
						if (Thumbnails.Paginator.CurrentPage == 1) selections.left_thumbnail_page_arrow.addClass('inactive');
						else if (Thumbnails.Paginator.Pages != 1) selections.left_thumbnail_page_arrow.removeClass('inactive');						
					},
					
				pageUp:
					function(){
						if (Thumbnails.Paginator.CurrentPage < Thumbnails.Paginator.Pages) {
							Thumbnails.Paginator.CurrentPage++;
							Thumbnails.conceal();							
							selections.thumbnail_strip.css("margin-top",(Thumbnails.Paginator.CurrentPage-1)*-1002);
							Thumbnails.reveal()
						} 
						Thumbnails.Paginator.updateArrows();
					},
					
				pageDown:
					function(){
						if (Thumbnails.Paginator.CurrentPage > 1) {
							Thumbnails.Paginator.CurrentPage--;							
							if (Thumbnails.Paginator.Pages != 1) selections.left_thumbnail_page_arrow.removeClass('inactive');
							Thumbnails.conceal();
							selections.thumbnail_strip.css("margin-top",(Thumbnails.Paginator.CurrentPage-1)*-1002);
							Thumbnails.reveal()
						}
						Thumbnails.Paginator.updateArrows();						
					}
			}//end paginator

}//end Thumbnails




function setSelectedSortButton ( target )
{
	$('a.selected',selections.sorters_and_regions).removeClass('selected');
	$('[data-sortby="'+$(target).data('sortby')+'"]', selections.sorters_and_regions).addClass('selected');
	return false;
}


function updateImageCount() 
{	
	selections.nav_count.html(fluxManager.activeThumbnails.indexOf(fluxManager.getCurrentEntry().thumbnailDiv[0])+1 + ' of ' + fluxManager.activeThumbnails.length);
}


/* DISPLAY/HIDE HIDDEN CONTENT */
function displayAboutMessage ()
{
	if ($('#about_text').css('display') == 'none'){
		$('#about_text').slideDown(300);
		$(this).html('hide text');
	} else {
		$('#about_text').slideUp(300);
		$(this).html('about this gallery');
	}	
}

function displayCredits () 
{
	// This only happens when a user selects 'show credits'
	if (selections.description_credits.css('display') == 'none') {
		selections.description_credits.slideDown(200);
		selections.credits_link.html('hide credits');
	} else {
		selections.description_credits.slideUp(200);
		selections.credits_link.html('show credits');
	}	
	return false;
}




var Social = {

	sendEmail:
		function() {
			var desktop = 
			  window.open('../emailshare/index.cfm?ReferPage='+window.location.href.replace('http://','').replace('#','?img='), "_blank","scrollbars=no,resizable=yes,width=1200,height=800");
				self.name = "main";
			return false;
		},

	shareOnFacebook:
		function() {
			var thisUrl = window.location.href.toString();
			
			console.log('shareOnFacebook.thisUrl: ' + thisUrl)
			
			// For JPL server (old)
			// parentUrl[0] targets the parent directory. The images on the live site are stored outside of 'sof' directory
			// var tempUrl = thisUrl.split("sof/");
			// var parentUrl = tempUrl[0]; 
			
			// For local testing
			// var tempUrl = thisUrl.split("application");
			var tempUrl = thisUrl.split("#"); 
			var parentUrl = tempUrl[0];  
			// var shareImgPath = "&p[images][0]=" + "http://www.mooreboeck.com/images/shared/jpl/ImageThumb_3.jpg"; 

			var imgDesc = "Check out NASA’s State of Flux gallery showing images of change around our planet.";
			var fbUrl = "http://www.facebook.com/sharer/sharer.php?s=100";
			var shareTitle = "&p[title]=" + fluxManager.getCurrentEntry().title;
			var shareUrl = "&p[url]=" + thisUrl.replace('#','?img=');
			var shareImgPath = "&p[images][0]=" + parentUrl + fluxManager.getCurrentEntry().thumbImageName.replace("..", "");
			
			

			var shareSummary = "&p[summary]=" + imgDesc;

			var facebookWindow = window.open(fbUrl + shareTitle + shareUrl + shareImgPath + shareSummary);

			// MARK I'm using the new code above, because the approach below doesn't seem to do everything we need.
			// I'm keeping it for now in case we find any last minute bugs
			// t=document.title;
			//var facebookWindow = window.open('http://facebook.com/sharer.php?u='+window.location.href.replace('http://','').replace('#','?img=')+'&t='+fluxManager.getCurrentEntry().title);

			return false;
		},

	tweetThis:
		function(){
			var twitterWindow = window.open('http://twitter.com/home?status=Check out NASA’s State Of Flux gallery image: '+fluxManager.getCurrentEntry().title+' '+window.location.href.replace('#','?img=').replace("  "," "));
			return false;
		},

	downloadThis:
		function(){
			//console.log(fluxManager.getCurrentEntry().largeImageUrl);
			var downloadWindow = window.open(fluxManager.getCurrentEntry().largeImageUrl);
			return false;
		}

}




/*
madsci api reference: ABQIAAAAjn37yeW9bSS16du42A2cqxTwVMGDhsvCjM5jbt5a03l5WHMvgxQQUi1MkFTm9X7XjxEbWavm8gNuxw
*/
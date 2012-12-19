//one level up /images/gallerythumbs

// console.log() fix and support for .indexOf() in IE
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };
if(!Array.indexOf){ Array.prototype.indexOf = function(obj){for(var i=0; i<this.length; i++){ if(this[i]==obj){return i;}} return -1;}}

//refresh page with hash if inbound request includes search string:
var searchString = window.location.href;
if (searchString.indexOf('?img') != -1) window.location = window.location.href.replace('?img=','#');

// global variables	
var
	requestedImageSrc = (!document.location.hash.length) ? 'none' : document.location.hash.substring(1),
	map,
	currentAddress,
	currentZoomLevel,
	currentMarker,
	currentPoint,
	baseIcon,
	selectedIcon,
	isMapLocator,
	thumbW = 133,
	thumbH = 105,
	regions = {
		'Africa': { zoom:3, x: 10.8, y: 19 },
		'Asia': { zoom:3, x: 35.9, y: 104.2 },
		'Australia': { zoom:4,  x: -20, y: 133.4 },
		'Europe': { zoom:4, x: 52.4, y: 17.9 },
		'North America': { zoom:3, x: 46.2, y: -98.34 },
		'South America': { zoom:3, x: -16.13,	 y: -59.76 },
		'Middle East': { zoom:3, x: 32.5, y: 53.6},	
		'Show all Continents': { zoom:2, x: 31.6, y: 6.3}
	},
	
	fluxManager = {
		
		entryLib: {},		
		entryCatalogue: {},
		allThumbnails: $(),	
		dataWindows: $(),
		categories: {},		
		entriesByCategory: {},		
		allMarkers: [],
		initialEntryId: 'entry0',
		activeThumbnails: [],
		
		getEntriesByCategory: 
			function(cat){ return this.entriesByCategory[cat];},
		
		setCurrentEntry: 
			function(id){ 
				currentEntryId = id;				
				currentThumbDiv = this.getEntryById(id).thumbnailDiv[0];
				currentThumbIndex = this.activeThumbnails.indexOf(currentThumbDiv)		
			},
		
		getCurrentEntry: 
			function(){return this.getEntryById(currentEntryId);},
			
		getCurrentEntryByMainImageName: 
			function(name){ return this.entryCatalogue[name];},
		
		registerEntry:
			function(entry,entryIndex){
				this.setEntryId(entry,entryIndex);
				this.registerCategoriesForEntry(entry);
				if (entry.mainImageName == requestedImageSrc) fluxManager.initialEntryId = entry.id;
			},
		
		registerCategoriesForEntry:
			function(entry){
				$.each(entry.categories,function(i,cat){
					if (!fluxManager.categories[cat]) fluxManager.categories[cat] = [];
					if (!fluxManager.entriesByCategory[cat]) fluxManager.entriesByCategory[cat] = [];
					fluxManager.entriesByCategory[cat].push(entry);
				});
				if (!fluxManager.entriesByCategory.all) fluxManager.entriesByCategory.all = [];
				fluxManager.entriesByCategory.all.push(entry);				
			},
	
		setEntryId:
			function(entry,id){ 
				entry.id = 'entry'+id;
				this.entryLib[entry.id] = entry; 
			},
		
		getEntryById:
			function(id){
				return this.entryLib[id];
			},
		
		getThumbnailDivsByCategory:
			function(cat){
				var thumbnails = $();
				$.each(fluxManager.entriesByCategory[cat],function(ind,entry){thumbnails = thumbnails.add(entry.thumbnailDiv);	});
				return thumbnails;
			},
			
		closeDataWindows:
			function(dataWindows){
				dataWindows.stop().fadeOut(350, function(){$(this).detach()});
			},
			
		getCurrentUrl:
			function(){
				return window.location+'#'+fluxManager.getCurrentEntry().mainImageName;
			}
			
	},
minMapScale = 5,//set this to limit maximum zoomed-out level
mapTypeControl = new GLargeMapControl3D();//GSmallZoomControl3D();//GSmallZoomControl()




function buildUIfromImageContent(){

	createMap();	
	
	// Create markers with listeners for each location
	$.each(imageContent, function(entryIndex,entry){		
		fluxManager.registerEntry(entry,entryIndex);			
		createMarkerAndDataWindow(entry,new GLatLng(entry.y, entry.x));		
		buildThumbnailDiv(entryIndex,entry);
		fluxManager.entryCatalogue[entry.mainImageName] = entry;
	});
	
	selections.thumbnail_menu.removeClass('loading');
	
	//establish coordinates for regions
	$.each(regions, function(name,regionData){
		regionData.latLng = new GLatLng(regionData.x,regionData.y);
	});
	
}


function buildThumbnailDiv(k,imgData)
{	
		var selectedClass = (k == 0) ? ' class="selected thumbnailDiv"' : ' class="thumbnailDiv"';					
		// Add the entry
		imgData.thumbnailDiv = 
			$('<div id="'+imgData.id+'"'+selectedClass+'><img src="'+imgData.thumbImageName+'" width="133" height="105" alt="thumbnail image"/>'+
				'<h5>'+imgData.thumbTitle+'</h5><p>'+imgData.thumbSubtitle+'</p></div>')
				.click(function(e){ loadEntryById(this.id);  })
				.appendTo(selections.thumbnail_strip);
		fluxManager.allThumbnails = fluxManager.allThumbnails.add(imgData.thumbnailDiv);
}



function createMap ()
{
	if (GBrowserIsCompatible()) {		
		
		map = new GMap2(selections.map_canvas[0], {backgroundColor: '#99b3cc',  minZoom: 8});
		map.setCenter(new GLatLng(imageContent[0].y,imageContent[0].x));	
		G_PHYSICAL_MAP.getMinimumResolution = function () { return 2 };	
		map.setMapType(G_PHYSICAL_MAP);		
		
		map.surfacePane = $('div:first div:first',map.getContainer());
		map.surfacePaneHeight = map.surfacePane.height();
		
		// Init the icon we will use for all markers
		baseIcon = new GIcon(G_DEFAULT_ICON); 
 		baseIcon.iconSize = new GSize(15,15); 
		baseIcon.iconAnchor = new GPoint(8,8); 
		baseIcon.shadow = null;
		baseIcon = new GIcon(baseIcon,"/assets/images/public/state_of_flux/icon_map.png");
		selectedIcon = new GIcon(baseIcon, "/assets/images/public/state_of_flux/pulse.gif");
		markerOptions = { icon: baseIcon, clickable: false };
		
		// Set map prefs 
		map.disableDragging();		
  }
}


function animateMarkers(){
	fluxManager.getCurrentEntry().marker.getIcon().image = "/assets/images/public/state_of_flux/icon_pulse.png";
}

function unAnimateMarkers(){
	fluxManager.getCurrentEntry().marker.getIcon().image = "/assets/images/public/state_of_flux/icon_map.png";
}


function displayLargeMap ()
{
	//  Center the map and place a marker on the current location
	showLocation();
	unAnimateMarkers();
	displayMarkersByCategory();	
	
	// Update the map to make sure the location is centered after resizing the map
	map.checkResize();
	map.setCenter(fluxManager.getCurrentEntry().marker.getLatLng());
		
	// Set the prefs for the large map	 		
	map.enableScrollWheelZoom();
	map.addControl(mapTypeControl);
	map.enableDragging();	
	
	// Reset the region dropdown menu
	$('.regionBox').trigger("reset");
}


function displaySmallMap ()
{
	map.removeControl(mapTypeControl);
	map.disableScrollWheelZoom();
	map.disableDragging();	
	map.clearOverlays();
	unAnimateMarkers();
	map.addOverlay(fluxManager.getCurrentEntry().marker);	
	markerOptions = { icon: selectedIcon, clickable: false };	
	map.setCenter(fluxManager.getCurrentEntry().marker.getLatLng())	
	map.checkResize();
}


function displayMarkersByCategory () 
{
	// Remove all markers and then display only those in the current category
	map.clearOverlays(); 
	unAnimateMarkers();
	$.each((currentCategory == 'all') ? fluxManager.entryLib : fluxManager.getEntriesByCategory(currentCategory), function(i,entry){
			map.addOverlay(entry.marker);	
	});
	map.removeOverlay(fluxManager.getCurrentEntry().marker);
	//switch marker type to "pulse"
	fluxManager.getCurrentEntry().marker.getIcon().image = "/assets/images/public/state_of_flux/pulse.gif";
	map.addOverlay(fluxManager.getCurrentEntry().marker);
}


function createMarkerAndDataWindow(entry, latLng) 
{
		entry.marker = new GMarker(latLng, { icon: baseIcon, clickable: true });
		entry.marker.entry = entry;				
		entry.marker.dataWindow = $('<div />',{'class':'dataWindow', html: entry.thumbTitle+'<br />'+entry.thumbSubtitle}).prepend($('<img />',{src: entry.thumbImageName}).after('<br />'));
		
		bindMarker(entry.marker);
		
}


function bindMarker(marker){

		fluxManager.allMarkers.push(marker);
		fluxManager.dataWindows = fluxManager.dataWindows.add(marker.dataWindow);

		GEvent.addListener(marker , "click", function() {
			if (currentState == 'image') 
				return $('#map_canvas').trigger('click');
			fluxManager.setCurrentEntry(this.entry.id);
			onMapMarkerClick();
		});
		
		GEvent.addListener(marker, "mouseover", function() {
			if (currentState == 'image') return;
			var spot = map.fromLatLngToDivPixel(marker.getLatLng());
			this.dataWindow.css({top: spot.y-170, left: spot.x-60}).appendTo(map.surfacePane).stop().fadeTo(350,1);
		});
		
		GEvent.addListener(marker, "mouseout", function() {
			if (currentState == 'image') return;
			fluxManager.closeDataWindows(this.dataWindow);
		});
				
}



function showLocation() 
{
	
	// Show the current marker (if in image state) and center the map
	var entry = fluxManager.getCurrentEntry();
	currentAddress = entry.mapLocation;
	currentZoomLevel = entry.zoomLevel;
	
	if (currentState == 'image' && entry.marker != undefined) 
		currentMarker = entry.marker;
	
	// Set the center
	if (currentMarker != undefined && map) {
		map.setCenter(entry.marker.getLatLng(), currentZoomLevel);		
		map.savePosition();
	}			
}





function administerFlux()
{
	var fluxAdmin = {
	
		 geocoder: new GClientGeocoder(),
		 
		 interface: $('<div />',{id: 'administrationPane', text: 'Enter a location to get latitude and longitude'}),
		 
		 locationForm: $('<form id="locationForm" />').append('<label />',{'for':'locationField',text: 'Location: '}),
		 
		 locationField: $('<input type="text" id="locationField"/>'),
		 
		 submitButton: $('<input type="submit" id="locationSubmitButton" value="Get Coordinates"/>'),
		 
		 resultsPane: $('<div />', {id: 'locationResultsPane'}),
		 
		 getCoordinates:
		 	function(){
		 		fluxAdmin.geocoder.getLatLng(fluxAdmin.locationField.val(), function(point) {
					fluxAdmin.lastLocationResult = point;
					fluxAdmin.resultsPane.html('<h1 style="color: #fff;">Location Results for '+fluxAdmin.locationField.val()+'</h1><h2>latitude: <span class="result">'+point.y+'</span><br />longitude: <span class="result">'+point.x+'</span><br /></h2>');
					fluxAdmin.showLocationOnMap(point);	
				});
				return false;
		 	},
		 	
	 	showLocationOnMap:
		 	function(point){
		 		map.clearOverlays();					
				map.addOverlay(new GMarker(point, { icon: baseIcon, clickable: false }));			
				$(map.getContainer()).css({width: '930px',height:'600px', display: 'none'});									
				$(map.getContainer()).fadeIn(1000).insertAfter(fluxAdmin.resultsPane);		
				map.checkResize();		
				map.setCenter(point, currentZoomLevel);
		 	},
		 	
 		assembleDom:
 			function(){
 				this.interface
 					.append(fluxAdmin.locationForm.submit(fluxAdmin.getCoordinates).append(fluxAdmin.locationField).append(fluxAdmin.submitButton))
					.append(fluxAdmin.resultsPane); 			
			},
		 	
	 	initialize:
	 		function(){
	 			this.assembleDom();
	 			this.interface.insertAfter('p.clear:first');
	 			return fluxAdmin;
	 		}
		 
	}
	
	return fluxAdmin.initialize();
	
}

if (requestedImageSrc.toLowerCase() == "admin") {
	isMapLocator = true;
	var fluxAdmin = administerFlux();
}






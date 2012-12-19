var keyIndicators = {
  swfFileName: '/assets/flash/key_indicators/KeyIndicators.swf',
  swfWidth: '739',
  swfHeight: '780',
  flashPlayerVersion: '10.0.0',
  indicatorArray: ['co2', 'globalTemp', 'seaIce', 'landIce', 'seaLevel'],
  params: {},
  allIndicatorsLoaded: false,
  loadCounter: 0,
  
  loadIndicator: 
    function (indicatorNum) {
      console.log('keyIndicators.loadIndicator.indicatorNum: ' + indicatorNum);
      var flashvars = { folder: '../../assets/flash/key_indicators/indicators/' + this.indicatorArray[indicatorNum] };
    	var attributes = { id: this.indicatorArray[indicatorNum] };	
    	swfobject.embedSWF(this.swfFileName, this.indicatorArray[indicatorNum], this.swfWidth, this.swfHeight, this.flashPlayerVersion, false, flashvars, this.params, attributes);
      
      console.log('keyIndicators.loadIndicator.attributes.id: ' + attributes.id); 
    },
    
  thisMovie:
    function (movieName) {
      console.log('keyIndicators.thisMovie.movieName: ' + movieName);
      console.log('keyIndicators.thisMovie.document[movieName]: ' + document[movieName]);
      var isIE = navigator.appName.indexOf('Microsoft') != -1;
      console.log('keyIndicators.thisMovie.isIE: ' + isIE); 
    	return (isIE) ? window[movieName] : document[movieName];  
    }, 
    
  loadIndicatorsForMobile: 
    function () {
      var i = 0;
      while (this.indicatorArray[i]) {
        console.log('loadIndicatorsForMobile.this.indicatorArray[i]: ' + this.indicatorArray[i]);
        var ind = this.indicatorArray[i];
        $('#' + ind).children().css('display', 'none');
        $('#' + ind).append('<img class="static_indicator" src="/assets/images/mobile/key_indicators/' + ind + '.jpg" />');
        i++;
      }
    },
    
  shiftSubnav: 
    function () {
      $('#main_area').prepend($('ul#page_subnav'));
    }
}
   
function itemLoaded (param) {
  
  // This gets called from the swf after the graphs have loaded for each indicator
  // Has to be outside the keyIndicators object until we set a new path in the fla and recompile
  
  // increment the loadCounter
  keyIndicators.loadCounter ++;

  // Handle loading of indicators
  if (keyIndicators.allIndicatorsLoaded == false) {
    if (keyIndicators.loadCounter == keyIndicators.indicatorArray.length) {
      keyIndicators.loadCounter = 0;
      keyIndicators.allIndicatorsLoaded = true;
    } else {
      keyIndicators.loadIndicator(keyIndicators.loadCounter);
    }
  }

  // Handle loading of time series (called from flash)
  if (keyIndicators.allIndicatorsLoaded && keyIndicators.loadCounter < keyIndicators.indicatorArray.length) {
    console.log('keyIndicators.itemLoaded.param,  ' + param); 
    var indicatorName = keyIndicators.indicatorArray[keyIndicators.loadCounter];
    keyIndicators.thisMovie(indicatorName).loadTimeSeriesSWF('test');
  }
}

/* ----- DOM ready----- */

$(function() {
	// Load the first indicator
	console.log('keyIndicators.js.isMobile.any(): ' + isMobile.any() );
	keyIndicators.shiftSubnav();
	if ( !isMobile.any() ) {
	  keyIndicators.loadIndicator(0);
  } else {
    keyIndicators.loadIndicatorsForMobile();
  }
});

/* ----- end DOM ready----- */

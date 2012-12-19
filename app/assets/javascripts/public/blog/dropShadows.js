/*------------------------------------
	Title: Cross-Browser Text Drop Shadows
	Author: Scott Jehl, www.scottjehl.com, scott@scottjehl.com
	Date: 7/19/06
http://creativecommons.org/licenses/by-nc-sa/2.5/
--------------------------------------*/

/*
addDomLoadEvent function from http://www.thefutureoftheweb.com/blog/2006/6/adddomloadevent
*/
function addDOMLoadEvent(func) { if (!window.__load_events) { var init = function () { if (arguments.callee.done) return; arguments.callee.done = true; if (window.__load_timer) { clearInterval(window.__load_timer); window.__load_timer = null;}
for (var i=0;i < window.__load_events.length;i++) { window.__load_events[i]();}
window.__load_events = null;}; if (document.addEventListener) { document.addEventListener("DOMContentLoaded", init, false);}
if (/WebKit/i.test(navigator.userAgent)) { window.__load_timer = setInterval(function() { if (/loaded|complete/.test(document.readyState)) { init();}
}, 10);}
window.onload = init; window.__load_events = [];}
window.__load_events.push(func);}



/*
getElementsByClass function (credit Dustin Diaz, www.dustindiaz.com)
*/
function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp('(^|\\s)'+searchClass+'(\\s|$)');
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}




/*
createDropShadows function 
*/

createDropShadows = function(){
//get the elements with the classname highContrast
var highContrast = getElementsByClass('highContrast');

	for(i = 0; i < highContrast.length; i++){
		//current element
		var currentElement = highContrast[i];
		//current element's text
		var hcContent = currentElement.firstChild.data;
		//create a new span to replace the content text
		var contentSpan = document.createElement('span');
		var contentSpanText = document.createTextNode(hcContent);
		contentSpan.appendChild(contentSpanText);
		//create another span for the shadow text and give it the class "shadow"
		var shadowSpan = document.createElement('span');
		var shadowSpanText = document.createTextNode(hcContent);
		shadowSpan.appendChild(shadowSpanText);
		shadowSpan.className = "shadow";
		
		
		//kill the original text and toss the spans in there with the content on top
		currentElement.firstChild.data = '';
		currentElement.appendChild(shadowSpan);
		currentElement.appendChild(contentSpan);
	}
}

addDOMLoadEvent(createDropShadows);
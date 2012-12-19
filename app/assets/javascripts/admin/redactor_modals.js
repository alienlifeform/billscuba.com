if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

RedactorPlugins.advanced = {
	quote_form:  String() +
		'<div id="redactor_modal_content">' +
		'<form id="redactorInsertQuote">' +
			'<label>Quote</label>' +
			'<textarea id="modal_quote" class="redactor_input" rows="8" cols="50"/>' +
			'<label>Credit</label>' +
			'<input id="modal_quote_credit" class="redactor_input" />' +
			'<label>Position</label>' +
			'<select id="modal_quote_align">' +
			'<option value="none">' + RLANG.none + '</option>' +
			'<option value="left">' + RLANG.left + '</option>' +
			'<option value="right">' + RLANG.right + '</option>' +
			'</select>' +
		'</form>' +
		'</div>'+
		'<div id="redactor_modal_footer">' +
		'<a href="javascript:void(null);" class="redactor_modal_btn redactor_btn_modal_close">' + RLANG.cancel + '</a>' +
		'<input type="button" class="redactor_modal_btn" id="redactorDoneBtn" value="' + RLANG.insert + '" />' +
		'</div>',

	pullquote_form:  String() +
			'<div id="redactor_modal_content">' +
			'<form id="redactorInsertPullQuote">' +
			'<label>Quote</label>' +
			'<textarea id="modal_pullquote_quote" class="redactor_input" rows="8" cols="50" />' +
			'<label>Credit</label>' +
			'<input id="modal_pullquote_credit" class="redactor_input" />' +
			'</form>' +
			'</div>'+
			'<div id="redactor_modal_footer">' +
			'<a href="javascript:void(null);" class="redactor_modal_btn redactor_btn_modal_close">' + RLANG.cancel + '</a>' +
			'<input type="button" class="redactor_modal_btn" id="redactorDoneBtn" value="' + RLANG.insert + '" />' +
			'</div>',

	sidebar_form:  String() +
			'<div id="redactor_modal_content">' +
			'<form id="redactorInsertSidebar">' +
			'<label>Header</label>' +
			'<input id="modal_sidebar_header" class="redactor_input" />' +
			'<label>Body</label>' +
			'<textarea id="modal_sidebar_body" class="redactor_input" rows="8" cols="50"/>' +
			'</form>' +
			'</div>'+
			'<div id="redactor_modal_footer">' +
			'<a href="javascript:void(null);" class="redactor_modal_btn redactor_btn_modal_close">' + RLANG.cancel + '</a>' +
			'<input type="button" class="redactor_modal_btn" id="redactorDoneBtn" value="' + RLANG.insert + '" />' +
			'</div>',



	launch_modal: function(obj, e, key)
	{
		if (this.title == "Sidebar"){
			RedactorPlugins.advanced.sidebar_modal(obj,e)
		} else if (this.title == "Quote"){
			RedactorPlugins.advanced.quote_modal(obj,e)
		} else if (this.title == "Pull Quote"){
			RedactorPlugins.advanced.pullquote_modal(obj,e)
		} else {
			console.log("REDACTOR ERROR: Undefined modal");
		}
	},

	quote_modal: function(obj,e){
		var $el = $(e.target);
		var callback = $.proxy(function()
		{
			$('#redactorDoneBtn').click($.proxy(function() { RedactorPlugins.advanced.quote_modal_done(obj,$el); }, this));

		}, this);

		obj.modalInit("Quote", RedactorPlugins.advanced.quote_form , 380, callback);

	},

	quote_modal_done: function(obj,el){
		obj.insertHtml("[[QUOTE||"+$('#modal_quote').val()+"||"+$('#modal_quote_credit').val()+"||"+$('#modal_quote_align').val()+"]] ");
		obj.modalClose();
	},

	pullquote_modal: function(obj,e){
		var $el = $(e.target);
		var callback = $.proxy(function()
		{
			$('#redactorDoneBtn').click($.proxy(function() { RedactorPlugins.advanced.pullquote_modal_done(obj,$el); }, this));

		}, this);

		obj.modalInit("Pull Quote", RedactorPlugins.advanced.pullquote_form , 380, callback);

	},

	pullquote_modal_done:	function (obj, e) {
		obj.insertHtml("[[PULLQUOTE||"+$('#modal_pullquote_quote').val()+"||"+$('#modal_pullquote_credit').val()+"]]");
		obj.modalClose();
	},

	moduleEmailFeedbackCallback: function(obj, e, key){
		obj.insertHtml("[[MODULE||Feedback.feedbackform||ParseModule=No]]");
	},

	videoModuleCallback: function(obj, e, key){
		obj.insertHtml("[[MODULE||video.play||..file..||..autostart..||..width..||..height..||..image..]]")
	},

	sidebar_modal: function(obj,e){
		var $el = $(e.target);
		var callback = $.proxy(function()
		{
			$('#redactorDoneBtn').click($.proxy(function() { RedactorPlugins.advanced.sidebar_modal_done(obj,$el); }, this));

		}, this);

		obj.modalInit("Sidebar", RedactorPlugins.advanced.sidebar_form , 380, callback);

	},

	sidebar_modal_done: function (obj,e,key){
		obj.insertHtml("[[SIDEBAR||"+$('#modal_sidebar_header').val()+"||"+$('#modal_sidebar_body').val()+"]]");
		obj.modalClose();
	},

	formattingH3Callback : function (obj,e,key){
		var selected_html = obj.getSelectedHtml();
		obj.insertHtml('<h3>'+selected_html+'</h3>');
	},
	formattingH4Callback: function (obj,e,key){
		var selected_html = obj.getSelectedHtml();
		obj.insertHtml('<h4>'+selected_html+'</h4>');
	},
	citationCallback: function (obj,e,key){
		var selected_html = obj.getSelectedHtml();
		obj.insertHtml('<sup>'+selected_html+'</sup>');
	},
	subscriptCallback: function (obj,e,key){
		var selected_html = obj.getSelectedHtml();
		obj.insertHtml('<sub>'+selected_html+'</sub>');
	}

}
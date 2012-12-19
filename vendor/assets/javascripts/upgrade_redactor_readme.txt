Upgrading Redactor

Due to some changes desired in the image upload/edit functionality we have added elements directly to redactor.js which will require some massaging to upgrade.

in modal_image_edit
add
	'<label>Caption</label>' +
	'<input id="redactor_file_caption" class="redactor_input" />' +
  '<label>Width</label>' +
  '<input id="redactor_file_width" class="redactor_input" />' +
delete
  float none input

modify imageSave and imageEdit to point to a parent_a which is the potential anchor tag in front of an image
and tests for parent_a.length ==0 or > 0 to tell if anchor exists

imageEdit
add
	$('#redactor_file_caption').val($el.next('.inline_caption').html());
  $('#redactor_file_width').val($el.width() );

imageDelete
change
$(el).remove() -> $(el).parent('.inline_image').remove();

imageSetThumb
change this._imageSet('<img src="' + $(e.target).attr('rel') + '" alt="' + $(e.target).attr('title') + '" />', true);
to
this._imageSet('<div class="inline_image"><img src="' + $(e.target).attr('rel') + '" alt="' + $(e.target).attr('title') + '" /><span class="inline_caption"></span></div>', true);

imageSave
add
$(el).next('.inline_caption').html($('#redactor_file_caption').val())
$(el).css({'width': $('#redactor_file_width').val() + "px" });
parent.css({'width': $('#redactor_file_width').val() + "px" });

change if(left) etc to
			if (floating === 'left')
			{
				parent.css({ 'float': 'left', 'padding-left': '0px' });
			}
			else if (floating === 'right')
			{
				parent.css({ 'float': 'right', 'padding-right': '0px' });
			}

_imageSet
change if (link !== true) { html = '<p><img src="' + json.filelink + '" /></p>'; }
to  if (link !== true) { html = '<div class="inline_image"><img src="' + json.filelink + '" /><span class="inline_caption"></span></div>'; }

imageUploadCallbackLink
change var data = '<div class="inline_image"><img src="' + $('#redactor_file_link').val() + '" />';
to
var data = '<div class="inline_image"><img src="' + $('#redactor_file_link').val() + '" /><span class="inline_caption"></span></div>';

Added a try catch to the init ~596
		// Init
		try{
			this.init();
		} catch (err){
			this.destroy();
			this.$el.val(this.$el.context.defaultValue);
			$(this.$el).addClass("redactor_broken");
			alert("Something broke when trying to create wysiwyg editor.\n\nTypically this is caused by an inaccessible javascript element in the html. Please fix this link, save the item and try again.\n\nError: " +err + " in " + this.$el.context.id);
		}


In the redactor.css
update
.redactor_editor, .redactor_editor:focus {
	position: relative;
	outline: none;
	/*box-shadow: none !important;*/
	padding: 7px 10px !important;
	margin: 0 !important;
	background: none;
	background: #fff !important;
	overflow: auto;
	white-space: normal;
	border: 1px solid #AEADAD;
	font-size: 10pt;
	-moz-border-radius: 4px;
	-webkit-border-radius: 4px;
	-khtml-border-radius: 4px;
	border-radius: 4px;
	-moz-box-shadow: inset 1px 1px 1px #E0DFDF;
	-webkit-box-shadow: inset 1px 1px 1px #E0DFDF;
	-khtml-box-shadow: inset 1px 1px 1px #E0DFDF;
	box-shadow: inset 1px 1px 1px #E0DFDF;
}

and
.redactor_box, .redactor_box textarea {
	background-color: #fff;
	border-color: #fff;
}

and
.redactor_box textarea {
	border: 1px solid #aeadad;
}
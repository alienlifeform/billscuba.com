     

/* ----- CONSTRUCTORS ----- */ 

var AdminTextInputForm = function (formID) { 
  
  console.log('adminTextInputForm(): TEXT INPUT FORM INITIALIZED FOR ' + formID);

  this.formID = formID;
  this.formAction = $('#' + formID).attr('action');

};
 
/* ----- end CONSTRUCTORS ----- */ 
  




/* ----- PROTOTYPES ----- */ 

AdminTextInputForm.prototype = {

  submit:
    function () {
      console.log('AdminTextInputForm.submit(): TEXT INPUT FORM SUBMITTED: ' + this.formID);
      $('#' + this.formID).submit();
      admin.showSpinner('add_item_control_box');
      $('#admin_control_box_add_item .admin_control_box_right_column').css('display', 'none'); 
    },
  submitAjax:
    function () {
      console.log('AdminTextInputForm.submitAjax(): TEXT INPUT FORM SUBMITTED: ' + this.formID);  
      $.ajax({
        type: 'POST',
        url: this.formAction,
        data:$('#' + this.formID).serialize(),
        error: function (xhr, ajaxOptions, thrownError) {
          console.log('ajax error status: ' + xhr.status);
          console.log('ajax error: ' + thrownError);
        },
        success: function() { console.log('ajax success') },//data){ $("#item_form").hide();  $('#view_item').html(data); },
        complete: function () { console.log('ajax complete')  }
      });
    },
  onFileSelected:
    function () {
      console.log('AdminTextInputForm.onFileSelected(): FILE HAS BEEN SELECTED');
    }
        
};

/* ----- end PROTOTYPES ----- */ 
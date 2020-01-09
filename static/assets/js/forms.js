//forms_key_lang.js must be included.

String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
var patternEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
var patternNumber = /^\d*$/;
var patternDate = /^\d\d\d\d\/\d\d\/\d\d$/;

//New Form Module
//var frm = new Form()
//frm.add("id","3");
//frm.post("members","auth","login");
var Form = function () {
	this.data = [];
};

Form.prototype.add = function (name, value) {
	var o = new Object();
	o.name = name;
	o.value = value;
	this.data.push(o);
};

Form.prototype.post = function (module, service, method) {
	var strData = "";
	for (var i = 0; i < this.data.length; i++)
		strData += "\"" + this.data[i].name + "\":\"" + this.data[i].value + "\",";
	strData = (strData.substr(strData.length - 1) == ",") ? strData.substr(0, strData.length - 1) : strData;
	postForm("/Modules/" + module + "/WebServices/" + service + ".asmx/" + method, "{" + strData + "}");
};


(function () {
	var proxied = window.alert;
	var errorMsg = '';
	window.alert = function () {
		$(".alert-box").remove();
		if (arguments.length > 1)//khodayari
		{
			if(arguments[0]== "Server Error" || arguments[0]=="خطای ناشناخته در سمت سرور" || arguments[0]=="Internal Server Error" || arguments[0]=="Not Found"){
//				if(arguments[0] == 'Internal Server Error' || arguments[0] == 'alert' || arguments[1] == 'alert')    
//				errorMsg = 'خطای  سمت سرور';
//				else
//				errorMsg  = arguments[1];        		
				$("body").prepend('<div data-alert class="row alert-box ' + arguments[1] + '"><a name="msg"></a>خطای ناشناخته در سمت سرور<a href="#" class="close" onclick="$(this).parent().remove();return false;">&times;</a></div>');
			}
			else if(arguments[0] != "در حال ارسال اطلاعات ,لطفا منتظر بمانید..."){
//				if(arguments[1] == 'Internal Server Error' || arguments[0] == 'alert' || arguments[1] == 'alert')    
//				errorMsg = 'خطای  سمت سرور';
//				else
//				errorMsg  = arguments[1];
				$(arguments[2]).prepend('<div data-alert class="row alert-box ' + arguments[1] + '"><a name="msg"></a>' + arguments[0] + '<a href="#" class="close" onclick="$(this).parent().remove();return false;">&times;</a></div>');
			}
		} else
			return proxied.apply(this, arguments);
	};
})();

function clickFancy(href) {
	$.get(href, "", function (data) {
		$.fancybox(data, {
			'autoDimensions': false,
			'width': '990px',
			'height': 'auto',
			'transitionIn': 'none',
			'transitionOut': 'none'
		});
		setFileInput();
		setFormAjax();
	});
}


function replaceAll(string, find, replace) {
	while (string.indexOf(find) > -1)
		string = string.replace(find, replace);
	return string;
}

function fillDropDown(actionUrl, dataForm, ddl, firstOption, callback) {
	$.ajax({
		type: "POST",
		url: actionUrl,
		data: dataForm,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (response) {
			if (response.d.result.status == 1) {
				ddl.find("option").remove();
				if (firstOption && firstOption != "")
					ddl.append("<option value='0'>" + firstOption + "</option>");
				for (var i = 0; i < response.d.resultSet.length; i++) {
					var lstEntity = response.d.resultSet[i];
					ddl.append("<option value='" + lstEntity.id + "'>" + lstEntity.title + "</option>");
				}
				if (ddl.hasClass('chosen-select'))
					ddl.trigger("chosen:updated");

				if (callback)
					callback();
			} else {
				alert(response.d.result.message, "alert", ".main");
			}
		},
		failure: function (msg) {
			alert(msg, "alert", ".main");
		}
	});
}

$(function () {
	try {
		$('.chosen-select').chosen({ no_results_text: LANG_not_found });
		$('.chosen-select').each(function () {
			$(this).after('<input type="hidden" id="' + $(this).attr("id") + '">');
			$(this).attr("id", $(this).attr("id").replace("data-", ""));
		});
		$('.chosen-select').change(function (evt, params) {
			var hiddenInput = $("#data-" + $(this).attr("id"));
			if (!params) {
				params = $(evt.target.selectedOptions);
				var selectedVals = [];
				for (var i = 0; i < evt.target.selectedOptions.length; i++) {
					selectedVals.push($(evt.target.selectedOptions[i]).val());
				}
				hiddenInput.val(selectedVals.join(","));
			} else {
				if (params.selected && hiddenInput.length > 0) {
					var vals = hiddenInput.val().split(',');
					if (vals.indexOf(params.selected) == -1)
						vals.push(params.selected);
					hiddenInput.val(vals.join(","));
				}
				if (params.deselected && hiddenInput.length > 0) {
					var vals = hiddenInput.val().split(',');
					if (vals.indexOf(params.deselected) > -1)
						vals.splice(vals.indexOf(params.deselected), 1)
						hiddenInput.val(vals.join(","));
				}
			}
		});
	} catch (e) {
	}
});

function setFileInput() {
	$(".fileUploader").each(function () {
		if ($(this).attr('data-checked') != "true") {
			$(this).attr('data-checked', 'true');
			var dataId = $(this).attr('id');
			var dataPath = $(this).attr('data-path');
			var dataValue = $(this).attr('data-value');

			if (dataValue && dataValue.length > 0)
				$(this).css('background-image', 'url("/modules/general/thumbnail_box.aspx?width=100&file=' + dataPath + dataValue + '")');

			$(this).removeAttr('id'); // remove id, then apply this id to hidden input

			// Add hidden file to save file name
			$(this).prepend('<input type="hidden" id="' + dataId + '" class="fileName" value="' + ((dataValue) ? dataValue : '') + '">');

			// Add input file
			$(this).prepend('<input type="file" data-multiple="' + $(this).attr("data-multiple") + '" data-all-files="' + $(this).attr("data-all-files") + '" data-useOriginalFileName="' + $(this).attr("data-useOriginalFileName") + '"/>');

			// Add event of uploading
			$(this).find("input[type='file']").change(function () {

				// Is mutiple upload
				var isMultiple = ($(this).attr("data-multiple") == "true");

				// Is all-files support for upload
				var isAllFiles = ($(this).attr("data-all-files") == "true");

				// Use originalFileName instead of GUID
				var useOriginalFileName = ($(this).attr("data-useOriginalFileName") == "true");

				var request = new FormData(); 
				var file_data = $(this).get(0).files[0]; //$(this).val();   // Getting the properties of file from file field
				request.append("file", file_data );
				var btn = $(this);
				btn.after("<img src=/data/images/loading_fb.gif id=loading style='margin-top: 37px; margin-right: 35px; position: absolute;'>");
				$.ajax({
					url: "../uploadBatchFile?filename=" + btn.val() + "&all=" + isAllFiles + "&useOriginalFileName=" + useOriginalFileName,
					dataType: 'json',
					cache: false,
					contentType: false,
					processData: false,
					data: request, // Setting the data attribute of ajax with file_data
					type: 'post',
					success: function (data) {
						var uploadedFileName = data.fileName + data.extension;

						btn.parent().find("img#loading").remove();
						if (isMultiple)
							btn.parent().find("input.fileName").val(btn.parent().find("input.fileName").val() + "," + uploadedFileName);
						else
							btn.parent().find("input.fileName").val(uploadedFileName);

						if (!isMultiple) {
							btn.closest('.preview').find('img.uploaded-img').remove();
							btn.closest('.preview').append("<img class='uploaded-img thumb th radius' src='/modules/general/thumbnail_box.aspx?width=100&file=/Modules/ArtOnline/data/uploader/" + uploadedFileName + "'>");
						} else {
							if (btn.closest('.preview').find('ul').length == 0) {
								btn.closest('.preview').css("width", "100%").css("float", "right").css("background-position", "right");
								btn.closest('.preview').append("<ul class='large-block-grid-10' style='margin-right:100px;'></ul>");
							}
							//                            var extension = btn.val().substr(btn.val().lastIndexOf(".") + 1);
							//                            if (isAllFiles)
							//                                btn.closest('.preview').find("ul").prepend("<li class='radius' style='border:1px solid #ddd;border-radius:5px;background-color:#efefef; overflow: hidden; padding: 8px; word-wrap: break-word; height: 90px; width: 90px; margin: 4px;'><a target='_blank' href='/Modules/ArtOnline/data/uploader/" + uploadedFileName + "' class='" + extension + " file-icon'><span class='file-icon'></span><span class='file-text'>" + btn.val() + "</span></a></li>");
							//                            else
							btn.closest('.preview').find("ul").prepend("<li><a href='/Modules/ArtOnline/data/uploader/" + uploadedFileName + "' target='_blank'><img class='uploaded-img thumb th radius' src='/modules/general/thumbnail_box.aspx?width=100&file=/Modules/ArtOnline/data/uploader/" + uploadedFileName + "'></a></li>");
						}
					},
					error: function (msg) {
						btn.parent().find("img").hide();
						alert("Error: " + msg, "alert", ".main");
					}
				});
				return false;

			});
		}
	});
}

function setFormAjax() {
	$("form.ajaxForm").each(function () {
		if ($(this).attr('data-checked') != "true") {
			$(this).attr('data-checked', 'true');

			// Autosave form
			if ($(this).attr('data-enableAutoSave') == 'true') {
				$(this).attr('data-binder', 'autoSaveForm|_form_id=' + $(this).attr('id'));

				var autoSaveFormData = JSON.parse(localStorage.getItem('autoSaveForm'));
				if (autoSaveFormData) {
					for (var i = 0; i < autoSaveFormData.length; i++) {
						if (autoSaveFormData[i]._form_id == $(this).attr('id')) {
							var storageAutoSave = new Database('autoSaveForm');
							storageAutoSave._form_binder(JSON.parse(localStorage.getItem('autoSaveForm'))[0]);
						}
					}
				}
			}

			$(this).submit(function () {
				$(this).find("input,textarea,select").css('border', '1px solid #aaa');
				$(this).find(".errBlock").hide();
				var form = $(this);
				$(".alert-box").remove();
				$(".alert-box").attr("style", "");

				if ($(this).attr("data-status") == "sending") {
					// alert(LANG_sending_form, "alert", form);
					return false;
				}

				$(this).attr("data-status", "sending");
				form.find("input[type='submit']").attr("data-text", form.find("input[type='submit']").val());
				// form.find("input[type='submit']").val(LANG_sending);
				var dataForm = "";
				var isValid = true;
				$(this).find("input,textarea,select").each(function () {
					// Set data form
					if ($(this).attr("id") != undefined && $(this).attr("id").indexOf("data-") == 0) {
						dataForm += "'" + $(this).attr("id").replace("data-", "") + "':'" + getFormFieldValue($(this)) + "',";
					}

					// Check Require Validation
					if ($(this).attr("data-validation-require") == "true" && ($(this).val() == "" || $(this).val() == null) && !$(this).attr("disabled") && $(this).is(":visible")) {
						$(this).css('border', '1px solid red').focus();
						var fieldText = LANG_selected_field;
						if ($(this).attr("placeholder"))
							fieldText = "'" + $(this).attr("placeholder") + "'";
						alert(LANG_please_complete_selected_field.replace("%field%", fieldText), "alert", form);
						isValid = false;
						form.attr("data-status", "done");
						form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
						return false;
					}

					// Check Length Validation
					if ($(this).attr("data-validation-length") && $(this).val().length < parseInt($(this).attr("data-validation-length")) && !$(this).attr("disabled") && $(this).is(":visible")) {
						$(this).css('border', '1px solid red').focus();
						var fieldText = LANG_selected_field;
						if ($(this).attr("placeholder"))
							fieldText = "'" + $(this).attr("placeholder") + "'";
						alert(LANG_please_enter_required_length_field.replace("%field%", fieldText).replace("%length%", $(this).attr("data-validation-length")), "alert", form);
						isValid = false;
						form.attr("data-status", "done");
						return false;
					}

					// Check Compare Validation
					if ($(this).attr("data-validation-compare") && $(this).attr("data-validation-compare") != "" && $(this).is(":visible")) {
						if (form.find("#" + $(this).attr("data-validation-compare")).val() != $(this).val()) {
							$(this).css('border', '1px solid red').focus();
							alert(LANG_please_enter_repassword_correctly, "alert", form);
							isValid = false;
							form.attr("data-status", "done");
							form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
							return false;
						}
					}
					 // Check Mobile Length Validation
//                    if ($(this).attr("data-validation-mobile-length") && $(this).val().length != parseInt($(this).attr("data-validation-mobile-length")) && !$(this).attr("disabled") && $(this).is(":visible")) {
//                        $(this).css('border', '1px solid red').focus();
//                        var fieldText = "مورد نظر";
//                        if ($(this).attr("placeholder"))
//                            fieldText = "'" + $(this).attr("placeholder") + "'";
//                        alert("طول مقدار فیلد " + fieldText + " باید  " + $(this).attr("data-validation-mobile-length") + " کارکتر باشد", "alert", form);
//                        isValid = false;
//                        form.attr("data-status", "done");
//                        return false;
//                    }

					// Check Pattern Validation
					var pattern = "";
					var tooltipMessage = "";
					switch ($(this).attr("data-validation-pattern")) {
					case "number":
						pattern = patternNumber;
						tooltipMessage = LANG_please_enter_number_format;
						break;
					case "date":
						pattern = patternDate;
						tooltipMessage = LANG_please_enter_date_format;
						break;
					case "email":
						pattern = patternEmail;
						tooltipMessage = LANG_please_enter_email_format;
						break;
					}
					if (pattern != "" && !pattern.test($(this).val()) && $(this).val() != "") {
						$(this).css('border', '1px solid red').focus();
						alert(tooltipMessage, "alert", form);
						isValid = false;
						form.attr("data-status", "done");
						form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
						return false;
					}
				});


				// Post form
				if (dataForm != "" && isValid) {
					dataForm = (dataForm.substr(dataForm.length - 1) == ",") ? dataForm.substr(0, dataForm.length - 1) : dataForm;
					var actionUrl = $(this).attr("action");
					var data
					$.ajax({
						type: "POST",
						url: actionUrl,
						data: '{' + dataForm + '}',
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						success: function (response) {
							form.attr("data-status", "done");
							form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
							if (response.d.result.status == 1) {
								// If success , clear AutoSave data
								if (form.attr('data-enableAutoSave') == 'true') {
									localStorage.setItem('autoSaveForm', null);
								}

								if ((response.d.result.message) && response.d.result.message != null && response.d.result.message != "") {
									// If showMessageInFancy is true and height of form is too much, hide form and show message
									if (form.attr("data-showMessageInFancy") == "true") {
										if (form.find('div:first').height() > 500)
											form.find('div:first').hide();
									}
									// Then show message(message div box now should be drawn inside the form tag)
									alert(response.d.result.message, "success", form);
								}


								if ((response.d.result.returnCallbackMethod) && response.d.result.returnCallbackMethod != null && response.d.result.returnCallbackMethod != "")
									eval(response.d.result.returnCallbackMethod + "(eval('" + JSON.stringify(response.d.resultSet) + "'));");
								else if ((response.d.result.callback) && response.d.result.callback != null && response.d.result.callback != "")
									eval(response.d.result.callback);
								else if ((response.d.result.redirectUrl) && response.d.result.redirectUrl != null && response.d.result.redirectUrl != "") {
									if (response.d.result.redirectUrl.indexOf("fancy:") == 0)
										clickFancy(response.d.result.redirectUrl.substr(6));
									else if (response.d.result.redirectUrl != "none")
										location.href = response.d.result.redirectUrl;
								} else
									location.reload();

							} else {
								// if session timed out, then open login popup
								if (response.d.result.message.indexOf(LANG_please_login_again) > -1) {
									clickFancy("/login");
								}
								alert(response.d.result.message, "alert", form);

								// If showMessageInFancy is true, show result at bottom position of page
								if (form.attr("data-showMessageInFancy") == "true") {
									var righPos = (screen.width - $(".alert-box").width()) / 2;
									$(".alert-box").attr("style", "position: fixed; margin: auto; z-index: 100; bottom: 0px;width:100%;left:" + righPos + "px;");
								}
							}
						},
						failure: function (msg) {
							form.attr("data-status", "done");
							form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
							alert(msg);
						},
						always: function (msg) {
							form.attr("data-status", "done");
							form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
							alert(msg);
						},
						error: function (xhr, error, msg) {
							if (xhr.status > 299) {
								form.attr("data-status", "done");
								form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
								alert(msg, "alert", form);
								console.debug(xhr);
							}
						}

					});
				}
				if ($(this).attr("data-showMessageInFancy") == "true") {
					var righPos = (screen.width - $(".alert-box").width()) / 2;
					$(".alert-box").attr("style", "position: fixed; margin: auto; z-index: 100; bottom: 0px;width:100%;left:" + righPos + "px;");

				}

				// Auto save form if Autosave
				if ($(this).attr('data-enableAutoSave') == 'true') {
					autoSaveForm($(this));
				}

				return false;
			});
		}
	});
}

var autoSaveForm = function (form) {
	var formData = new Object();
	var key = form.attr('id');
	formData['_form_id'] =  key; // Save id as key of store
	form.find("input,select,textarea").each(function () {
		var field = $(this);
		if (field.attr("id") && field.attr("id").indexOf("data-") > -1) {
			formData[field.attr("id").replace("data-", "")] =  getFormFieldValue(field);
		}
	});

	var storage = new Database("autoSaveForm", true);
	var foundIndex = storage.find('_form_id', key);
	if (foundIndex > -1)
		storage.updateRecordByIndex(foundIndex, formData);
	else
		storage.add(formData, false);
}

function getFormFieldValue(element) {
	var value = "";
	if (element.val())
		value = element.val().toString().trim();

	if (element.hasClass("datepicker"))
		value = replaceAll(value, "/", "");

	if (element.hasClass("currency")) {
		value = replaceAll(value, ",", "");
		value = (value == "") ? "0" : value;
	}

	if (value == "" && element.attr("data-default-value")) {
		value = element.attr("data-default-value");
	}

	if (element.attr("type") == "checkbox")
		value = element.is(":checked");

	// Password field & encryption
	if (element.attr("type") == "password" && element.attr("data-encrypt") == "true" && value)
		value = Sha1.hash(value);

	return escape(value);
}

function setCurrency(val) {
	var strValue = val.toString();
	var strChar = ",";
	var iDistance = 3;

	var str = "";
	for (var i = 0; i < strValue.length; i++) {
		if (strValue.charAt(i) != strChar) {
			if ((strValue.charAt(i) >= 0) && (strValue.charAt(i) <= 9)) {
				str = str + strValue.charAt(i);
			}
		}
	}

	strValue = str;
	var iPos = strValue.length;
	iPos -= iDistance;
	while (iPos > 0) {
		strValue = strValue.substr(0, iPos) + strChar + strValue.substr(iPos);
		iPos -= iDistance;
	}

	return strValue;
}



function postForm(actionUrl, dataForm) {
	var form = $(".main");
	$.ajax({
		type: "POST",
		url: actionUrl,
		data: dataForm,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (response) {
			if (response.d.result.status == 1) {
				if ((response.d.result.message) && response.d.result.message != null && response.d.result.message != "") {
					// If showMessageInFancy is true and height of form is too much, hide form and show message
					if (form.attr("data-showMessageInFancy") == "true") {
						if (form.find('div:first').height() > 500)
							form.find('div:first').hide();
					}
					// Then show message(message div box now should be drawn
					alert(response.d.result.message, "success", form);
				}

				if ((response.d.result.callback) && response.d.result.callback != null && response.d.result.callback != "")
					eval(response.d.result.callback);
				else if ((response.d.result.redirectUrl) && response.d.result.redirectUrl != null && response.d.result.redirectUrl != "") {
					if (response.d.result.redirectUrl.indexOf("fancy:") == 0)
						clickFancy(response.d.result.redirectUrl.substr(6));
					else if (response.d.result.redirectUrl != "none")
						location.href = response.d.result.redirectUrl;
				} else
					location.reload();

			} else {
				// if session timed out, then open login popup
				if (response.d.result.message.indexOf(LANG_please_login_again) > -1) {
					clickFancy("/artist/login/");
				}
				alert(response.d.result.message, "alert", form);

				// If showMessageInFancy is true, show result at bottom position of page
				if (form.attr("data-showMessageInFancy") == "true") {
					var righPos = (screen.width - $(".alert-box").width()) / 2;
					$(".alert-box").attr("style", "position: fixed; margin: auto; z-index: 100; bottom: 0px;width:100%;left:" + righPos + "px;");
				}
			}

		},
		failure: function (msg) {
			alert(msg, "alert", ".main");
		}
	});
}

$(function () {

	setFileInput();
	setFormAjax();

	$(".fancy").bind("click", function () {
		if ($(this).attr("href") == "#" || $(this).attr("href") == "" || $(this).attr("disabled") == "disabled")
			return false;

		clickFancy($(this).attr("href"));
		return false;
	});

	$("form").find("input,textarea,select").each(function () {
		if ($(this).parent().find("label").length == 1)
			$(this).parent().find("label").attr("for", $(this).attr("id"));
	});

	$("input[type='text'].currency").keyup(function () {
		$(this).val(setCurrency($(this).val()));
	});

	try {
		$('.datepicker').datepicker({
			dateFormat: 'yy/mm/dd',
			autoSize: true
		});
	} catch (e) {
	}


	// <a href="" class="button-delete" data-id="1" data-action="/modules/members/webservices/members.asmx/deleteMember" >Del</a>
	$(".button-delete").bind("click", function () {
		if (!$(this).attr("data-id")) {
			alert("data-id is not assigned!");
			return;
		}
		if (!$(this).attr("data-action")) {
			alert("data-action is not assigned!");
			return;
		}
		if (confirm(LANG_are_you_sure_that_you_want_to_delete_this_item)) {
			var entity = new Object();
			entity.id = $(this).attr("data-id");
			postForm($(this).attr("data-action"), JSON.stringify(entity));
		}
	});


	// <a href="" class="button-disable" data-disable="bun1" >Dis sth</a>
	// <div class="btn1"></div>
	$(".button-disable").bind("click", function () {
		if ($(this).attr("type") != "checkbox") {
			if ($("#" + $(this).attr("data-disable")).attr('disabled'))
				$("#" + $(this).attr("data-disable")).removeAttr('disabled');
			else
				$("#" + $(this).attr("data-disable")).attr('disabled', 'disabled');
		}
	});
	$(".button-disable[type='checkbox']").bind("change", function () {
		if ($(this).is(':checked'))
			$("#" + $(this).attr("data-disable")).removeAttr('disabled');
		else
			$("#" + $(this).attr("data-disable")).attr('disabled', 'disabled')
	});

	// <a href="" class="button-toggle" data-show="bun1" data-hide="bun2" data-toggle="btn3" >sth</a>
	// <div class="btn1"></div> -> will be shown
	// <div class="btn2"></div> -> will be hidden
	// <div class="btn3"></div> -> will be shown/hidden
	$(".button-toggle").bind("click", function () {
		if ($(this).attr("type") != "checkbox") {
			$("." + $(this).attr("data-toggle")).toggle('slow');
			$("." + $(this).attr("data-hide")).hide();
			$("." + $(this).attr("data-show")).fadeIn('slow');
		}
	});
	$(".button-toggle[type='checkbox']").bind("change", function () {
		$("." + $(this).attr("data-toggle")).toggle('slow');
		$("." + $(this).attr("data-hide")).hide();
		$("." + $(this).attr("data-show")).fadeIn('slow');
	});
	$(".hidden").hide();


	$(".button-uncheck").bind("click", function () {
		if ($(this).is(":checked"))
			$("#" + $(this).attr("data-uncheck")).removeAttr('checked');
	});

	// <input class="button-hidden-setter" data-set-hidden-for="data-id" type="radio" value="2">
	// <input type="hidden" id="data-id"> -> value changes to 2
	// -----
	// <input class="button-hidden-setter" data-set-hidden-for="data-id" type="radio" value="2" hidden-setter-isBool="true">
	// <input type="hidden" id="data-id"> -> value changes to 2
	$(".button-hidden-setter").click(function () {
		if ($(this).attr("type") == "radio")
			$("#" + $(this).attr("data-set-hidden-for")).val($(this).attr("value"));

		if ($(this).attr("type") == "checkbox") {
			var currentValues = $("#" + $(this).attr("data-set-hidden-for")).val();
			// Delete old Value
			currentValues = currentValues.replace(($(this).attr("value") + ","), "");

			// Add if checkbox is checked
			if ($(this).attr("checked"))
				currentValues += $(this).attr("value") + ",";

			if ($(this).attr("hidden-setter-isBool") == "true")
				if ($(this).attr("checked"))
					$("#" + $(this).attr("data-set-hidden-for")).val(1);
				else
					$("#" + $(this).attr("data-set-hidden-for")).val(0);
			else
				$("#" + $(this).attr("data-set-hidden-for")).val(currentValues);
		}
	});
});


$(function () {
	var url = location.href;
	if (url.indexOf("#") > -1) {
		url = url.substr(url.indexOf("#") + 1);
		if (url != "" && url.indexOf("/") > -1)
			clickFancy(url);
		else {
			var buttonToggle = $(".button-toggle[data-show='" + url + "']");
			if (buttonToggle.length > 0) {
				$("." + buttonToggle.attr("data-hide")).hide();
				$("." + buttonToggle.attr("data-show")).show();
			}
		}
	}
});


$(".tool-tip").click(function (event) {
	clickFancy("/portal.aspx?module=pageManagement&page=showPage&skin=empty&url=" + $(this).attr("data-tooltip-page_id"));
	return;
	var id = "tool-tip-container";
	$("#" + id).attr("data-tooltip-state", "mouseover");
	if ($("#" + id).length == 0)
		$("body").append("<div id='" + id + "' style='z-index:1000;box-shadow:#333 3px 3px 5px;background-color: #AAAAAA;border-radius: 5px;direction: rtl;line-height: 20px;padding: 10px;text-align: right;position:absolute;display:none'></div>");

	var tooltip_data = "";
	if ($(this).attr("title")) {
		$(this).attr("data-tooltip", $(this).attr("title"));
		$(this).removeAttr("title");
	}

	if ($(this).attr("data-tooltip-lazy") == "true") {
		$("#" + id).html("<img src='/data/images/loading_fb.gif'>");
		var page_id = $(this).attr("data-tooltip-page_id");
		$.get("/portal.aspx", "module=pageManagement&page=showPage&skin=empty&url=" + page_id, function (data) {
			tooltip_data = data;
			$.fancybox(data);
			return false;
			if ($("#" + id).attr("data-tooltip-state") != "mouseout") {
				$("#" + id).html(tooltip_data);
				var xPos = event.pageX - $("#" + id).width() - 50;
				if (xPos < 10)
					xPos = event.pageX + 50;
				$("#" + id).css("left", xPos + "px");
				$("#" + id).css("top", event.pageY - 40 + "px");
				$("#" + id).show();
			}
		});
	} else {
		tooltip_data = $(this).attr("data-tooltip");

		$("#" + id).html(tooltip_data);
		$("#" + id).css("left", event.pageX - $("#" + id).width() - 30 + "px");
		$("#" + id).css("top", event.pageY - 40 + "px");
		$("#" + id).show();
	}
});
$(".tool-tip").mouseout(function (event) {
	var id = "tool-tip-container";
	$("#" + id).hide();
	$("#" + id).attr("data-tooltip-state", "mouseout");
});

function loadAjaxUserControl(module, page, parameters, callback) {
	$.get("/portal.aspx", "module=" + module + "&page=" + page + "&skin=empty&" + parameters, function (data) {
		callback(data);
	});
}

function ajaxRequestPost(actionUrl, data_params, form, callback) {

	form.find("input,textarea,select").css('border', '1px solid #aaa');
	form.find(".errBlock").hide();
	$(".alert-box").remove();
	$(".alert-box").attr("style", "");

	if (form.attr("data-status") == "sending") {
		//   alert(LANG_sending_form, "alert", form);
		return false;
	}

	form.attr("data-status", "sending");
	form.find("input[type='submit']").attr("data-text", form.find("input[type='submit']").val());
	// form.find("input[type='submit']").val(LANG_sending);
	var dataForm = "";
	var isValid = true;
	form.find("input,textarea,select").each(function () {
		// Set data form
		if ($(this).attr("id") != undefined && $(this).attr("id").indexOf("data-") == 0) {
			dataForm += "'" + $(this).attr("id").replace("data-", "") + "':'" + getFormFieldValue($(this)) + "',";
		}

		// Check Require Validation
		if ($(this).attr("data-validation-require") == "true" && ($(this).val() == "" || $(this).val() == null) && !$(this).attr("disabled") && $(this).is(":visible")) {
			$(this).css('border', '1px solid red').focus();
			var fieldText = LANG_selected_field;
			if ($(this).attr("placeholder"))
				// fieldText = "'" + $(this).attr("placeholder") + "'";edit by Ganjyar
				fieldText = "مورد نظر";
			alert(LANG_please_complete_selected_field.replace("%field%", fieldText), "alert", form);
			isValid = false;
			form.attr("data-status", "done");
			form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
			return false;
		}

		// Check Length Validation
		if ($(this).attr("data-validation-length") && $(this).val().length < parseInt($(this).attr("data-validation-length")) && !$(this).attr("disabled") && $(this).is(":visible")) {
			$(this).css('border', '1px solid red').focus();
			var fieldText = LANG_selected_field;
			if ($(this).attr("placeholder"))
				fieldText = "'" + $(this).attr("placeholder") + "'";
			alert(LANG_please_enter_required_length_field.replace("%field%", fieldText).replace("%length%", $(this).attr("data-validation-length")), "alert", form);
			isValid = false;
			form.attr("data-status", "done");
			return false;
		}

		// Check Compare Validation
		if ($(this).attr("data-validation-compare") && $(this).attr("data-validation-compare") != "" && $(this).is(":visible")) {
			if (form.find("#" + $(this).attr("data-validation-compare")).val() != $(this).val()) {
				$(this).css('border', '1px solid red').focus();
				alert(LANG_please_enter_repassword_correctly, "alert", form);
				isValid = false;
				form.attr("data-status", "done");
				form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
				return false;
			}
		}

		// Check Pattern Validation
		var pattern = "";
		var tooltipMessage = "";
		switch ($(this).attr("data-validation-pattern")) {
		case "number":
			pattern = patternNumber;
			tooltipMessage = LANG_please_enter_number_format;
			break;
		case "date":
			pattern = patternDate;
			tooltipMessage = LANG_please_enter_date_format;
			break;
		case "email":
			pattern = patternEmail;
			tooltipMessage = LANG_please_enter_email_format;
			break;
		}
		if (pattern != "" && !pattern.test($(this).val()) && $(this).val() != "") {
			$(this).css('border', '1px solid red').focus();
			alert(tooltipMessage, "alert", form);
			isValid = false;
			form.attr("data-status", "done");
			form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
			return false;
		}
	});


	// Post form
	if (isValid) {
		$.ajax({
			type: "POST",
			url: actionUrl,
			data: "{" + "\"data\":" + convertObjectToJSON(data_params) + "}",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {

				form.attr("data-status", "done");
				form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
				if (response.result.state == "success") {
					// If success , clear AutoSave data
					if (form.attr('data-enableAutoSave') == 'true') {
						localStorage.setItem('autoSaveForm', null);
					}

					if ((response.result.message) && response.result.message != null && response.result.message != "") {
						// If showMessageInFancy is true and height of form is too much, hide form and show message
						if (form.attr("data-showMessageInFancy") == "true") {
							if (form.find('div:first').height() > 500)
								form.find('div:first').hide();
						}
						// Then show message(message div box now should be drawn inside the form tag)
						alert(response.result.message, "success", form);
					}
					if (response.resultSet != null){
						for(var iSort = 0 ; iSort < response.resultSet.length ; iSort++ ){

							sort(response.resultSet[iSort].id);
						}

//						eval("(eval('" + JSON.stringify(response.resultSet) + "'));");khodayari
						callback(response.resultSet);
					}


//					if ((response.result.returnCallbackMethod) && response.result.returnCallbackMethod != null && response.result.returnCallbackMethod != "")
//					eval(response.result.returnCallbackMethod + "(eval('" + JSON.stringify(response.resultSet) + "'));");
					else if ((response.result.callback) && response.result.callback != null && response.result.callback != "")
						eval(response.result.callback);
					else if ((response.result.redirectUrl) && response.result.redirectUrl != null && response.result.redirectUrl != "") {
						if (response.result.redirectUrl.indexOf("fancy:") == 0)
							clickFancy(response.result.redirectUrl.substr(6));
						else if (response.result.redirectUrl != "none")
							location.href = response.result.redirectUrl;
					} else
						location.reload();

				} else {
					// if session timed out, then open login popup
					if (response.result.message.indexOf(LANG_please_login_again) > -1) {
						clickFancy("/artist/login/");
					}
					alert(response.result.message, "alert", form);

					// If showMessageInFancy is true, show result at bottom position of page
					if (form.attr("data-showMessageInFancy") == "true") {
						var righPos = (screen.width - $(".alert-box").width()) / 2;
						$(".alert-box").attr("style", "position: fixed; margin: auto; z-index: 100; bottom: 0px;width:100%;left:" + righPos + "px;");
					}
				}
			},
			failure: function (msg) {
				form.attr("data-status", "done");
				form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
				alert(msg);
			},
			always: function (msg) {
				form.attr("data-status", "done");
				form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
				alert(msg);
			},
			error: function (xhr, error, msg) {
				if (xhr.status > 299) {
					form.attr("data-status", "done");
					form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
					alert(msg, "alert", form);
					console.debug(xhr);
				}else if(xhr.status == 200){
					if(xhr.responseText.indexOf("ASNAD_LOGINPAGE") > -1)
						location.href = "login.html";
				}
			}
		});
	}

	if (form.attr("data-showMessageInFancy") == "true") {
		var righPos = (screen.width - $(".alert-box").width()) / 2;
		$(".alert-box").attr("style", "position: fixed; margin: auto; z-index: 100; bottom: 0px;width:100%;left:" + righPos + "px;");

	}

	// Auto save form if Autosave
	if (form.attr('data-enableAutoSave') == 'true') {
		autoSaveForm(form);
	}
}


function ajaxRequestPostUpdate(actionUrl, data_params, form, callback) {//khodayari
	form.find("input,textarea,select").css('border', '1px solid #aaa');
	form.find(".errBlock").hide();
	$(".alert-box").remove();
	$(".alert-box").attr("style", "");

	if (form.attr("data-status") == "sending") {
		//   alert(LANG_sending_form, "alert", form);
		return false;
	}

	form.attr("data-status", "sending");
	form.find("input[type='submit']").attr("data-text", form.find("input[type='submit']").val());
	// form.find("input[type='submit']").val(LANG_sending);
	var dataForm = "";
	var isValid = true;
	form.find("input,textarea,select").each(function () {
		// Set data form
		if ($(this).attr("id") != undefined && $(this).attr("id").indexOf("data-") == 0) {
			dataForm += "'" + $(this).attr("id").replace("data-", "") + "':'" + getFormFieldValue($(this)) + "',";
		}

		// Check Require Validation
		if ($(this).attr("data-validation-require") == "true" && ($(this).val() == "" || $(this).val() == null) && !$(this).attr("disabled") && $(this).is(":visible")) {
			$(this).css('border', '1px solid red').focus();
			var fieldText = LANG_selected_field;
			if ($(this).attr("placeholder"))
				// fieldText = "'" + $(this).attr("placeholder") + "'";edit by Ganjyar
				fieldText = "مورد نظر";
			alert(LANG_please_complete_selected_field.replace("%field%", fieldText), "alert", form);
			isValid = false;
			form.attr("data-status", "done");
			form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
			return false;
		}

		// Check Length Validation
		if ($(this).attr("data-validation-length") && $(this).val().length < parseInt($(this).attr("data-validation-length")) && !$(this).attr("disabled") && $(this).is(":visible")) {
			$(this).css('border', '1px solid red').focus();
			var fieldText = LANG_selected_field;
			if ($(this).attr("placeholder"))
				fieldText = "'" + $(this).attr("placeholder") + "'";
			alert(LANG_please_enter_required_length_field.replace("%field%", fieldText).replace("%length%", $(this).attr("data-validation-length")), "alert", form);
			isValid = false;
			form.attr("data-status", "done");
			return false;
		}

		// Check Compare Validation
		if ($(this).attr("data-validation-compare") && $(this).attr("data-validation-compare") != "" && $(this).is(":visible")) {
			if (form.find("#" + $(this).attr("data-validation-compare")).val() != $(this).val()) {
				$(this).css('border', '1px solid red').focus();
				alert(LANG_please_enter_repassword_correctly, "alert", form);
				isValid = false;
				form.attr("data-status", "done");
				form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
				return false;
			}
		}

		// Check Pattern Validation
		var pattern = "";
		var tooltipMessage = "";
		switch ($(this).attr("data-validation-pattern")) {
		case "number":
			pattern = patternNumber;
			tooltipMessage = LANG_please_enter_number_format;
			break;
		case "date":
			pattern = patternDate;
			tooltipMessage = LANG_please_enter_date_format;
			break;
		case "email":
			pattern = patternEmail;
			tooltipMessage = LANG_please_enter_email_format;
			break;
		}
		if (pattern != "" && !pattern.test($(this).val()) && $(this).val() != "") {
			$(this).css('border', '1px solid red').focus();
			alert(tooltipMessage, "alert", form);
			isValid = false;
			form.attr("data-status", "done");
			form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
			return false;
		}
	});


	// Post form
	if (isValid) {
		$.ajax({
			type: "POST",
			url: actionUrl,
			data: "{" + "\"data\":" + convertObjectToJSON(data_params) + "}",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				form.attr("data-status", "done");
				form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
				if (response.result.state == "success") {

					// If success , clear AutoSave data
					if (form.attr('data-enableAutoSave') == 'true') {
						localStorage.setItem('autoSaveForm', null);
					}

					if ((response.result.message) && response.result.message != null && response.result.message != "") {
						// If showMessageInFancy is true and height of form is too much, hide form and show message
						if (form.attr("data-showMessageInFancy") == "true") {
							if (form.find('div:first').height() > 500)
								form.find('div:first').hide();
						}
						// Then show message(message div box now should be drawn inside the form tag)
						alert(response.result.message, "success", form);
					}
//					if (response.resultSet != null){
//					for(var iSort = 0 ; iSort < response.resultSet.length ; iSort++ ){

//					sort(response.resultSet[iSort].id);
//					}

////					eval("(eval('" + JSON.stringify(response.resultSet) + "'));");khodayari
//					callback(response.resultSet);
//					}


//					if ((response.result.returnCallbackMethod) && response.result.returnCallbackMethod != null && response.result.returnCallbackMethod != "")
//					eval(response.result.returnCallbackMethod + "(eval('" + JSON.stringify(response.resultSet) + "'));");
					else if ((response.result.callback) && response.result.callback != null && response.result.callback != "")
						eval(response.result.callback);
					else if ((response.result.redirectUrl) && response.result.redirectUrl != null && response.result.redirectUrl != "") {
						if (response.result.redirectUrl.indexOf("fancy:") == 0)
							clickFancy(response.result.redirectUrl.substr(6));
						else if (response.result.redirectUrl != "none")
							location.href = response.result.redirectUrl;
					} else
						callback();

				} else {
					// if session timed out, then open login popup
					if (response.result.message.indexOf(LANG_please_login_again) > -1) {
						clickFancy("/artist/login/");
					}
					alert(response.result.message, "alert", form);

					// If showMessageInFancy is true, show result at bottom position of page
					if (form.attr("data-showMessageInFancy") == "true") {
						var righPos = (screen.width - $(".alert-box").width()) / 2;
						$(".alert-box").attr("style", "position: fixed; margin: auto; z-index: 100; bottom: 0px;width:100%;left:" + righPos + "px;");
					}
				}
			},
			failure: function (msg) {
				form.attr("data-status", "done");
				form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
				alert(msg);
			},
			always: function (msg) {
				form.attr("data-status", "done");
				form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
				alert(msg);
			},
			error: function (xhr, error, msg) {
				if (xhr.status > 299) {
					form.attr("data-status", "done");
					form.find("input[type='submit']").val(form.find("input[type='submit']").attr("data-text"));
					alert(msg, "alert", form);
					console.debug(xhr);
				}else if(xhr.status == 200){
					if(xhr.responseText.indexOf("ASNAD_LOGINPAGE") > -1)
						location.href = "login.html";
				}
			}
		});
	}

	if (form.attr("data-showMessageInFancy") == "true") {
		var righPos = (screen.width - $(".alert-box").width()) / 2;
		$(".alert-box").attr("style", "position: fixed; margin: auto; z-index: 100; bottom: 0px;width:100%;left:" + righPos + "px;");

	}

	// Auto save form if Autosave
	if (form.attr('data-enableAutoSave') == 'true') {
		autoSaveForm(form);
	}
}



function ajaxRequestGet(actionUrl, data, success, fail) {
	$.ajax({
		type: "GET",
		url: actionUrl,
		data: convertObjectToJSON(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (response) {
			if (response.result.state == "success") {
				success(response.resultSet);
			} else {
				// if session timed out, then open login popup
				if (response.result.message.indexOf(LANG_please_login_again) > -1) {
					clickFancy("/artist/login/");
				}
				fail(response.result.message);
			}
		},
		failure: function (msg) {
			fail(msg);
		},
		always: function (msg) {
			fail(msg);
		},
		error: function (xhr, error, msg) {
			if (xhr.status > 299) {
				fail(msg);
				console.debug(xhr);
			}else if(xhr.status == 200){
				if(xhr.responseText.indexOf("ASNAD_LOGINPAGE") > -1)
					location.href = "login.html";
			}

		}

	});
}


function ajaxGet(actionUrl, data, success, fail) {//khodayari
	$.ajax({
		type: "GET",
		url: actionUrl,
		data: convertObjectToJSON(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function () {
			success();
		},
		failure: function (msg) {
			fail(msg);
		},
		always: function (msg) {
			fail(msg);
		},
		error: function (xhr, error, msg) {
			if (xhr.status > 299) {
				fail(msg);
				console.debug(xhr);
			}
			else if(xhr.status == 200){
				if(xhr.responseText.indexOf("ASNAD_LOGINPAGE") > -1)
					location.href = "login.html";
			}
		}

	});
}

function convertObjectToJSON(obj) {
    
	if (!obj)
		return "{}";
	var newObj = new Object();
	var allProperties = Object.keys(obj);
	for (var iProperty = 0; iProperty < allProperties.length; iProperty++) {
		var key = allProperties[iProperty];
		newObj[key] = obj[key];
	}
	return JSON.stringify(newObj);
}

function getEmptySkinPageUrl(module,page) {
	return "/portal.aspx?module=" + module + "&skin=empty&page=" + page;
}
//khodayari
function predicatBy(prop) {
	return function (a, b) {
		if (b[prop] < a[prop]) {
			return 1;
		} else if (b[prop] > a[prop]) {
			return -1;
		}
		return 0;
	};
}

function orderBy(prop , asc) {
	if(asc){
		return function (a, b) {
			if (b[prop] < a[prop]) {
				return 1;
			} else if (b[prop] > a[prop]) {
				return -1;
			}
			return 0;
		};
	}
	else{
		return function (a, b) {
			if (b[prop] > a[prop]) {
				return 1;
			} else if (b[prop] < a[prop]) {
				return -1;
			}
			return 0;
		};
	}
}

function sort(prop_name) {
	//  predicatBy(prop_name);

};

//----------------------------------load Html---------------------------------------
function loadHtml(fileName, callback) {

	$.get(fileName + ".html?r=" + Math.random(), "", function (data) {
		$("body").html(data);
		setFormAjax();

		$(document).foundation();
		if(callback)
			callback();
	});
}

function ajaxPost(actionUrl , params , callback){//khodayari
	$.ajax({
		type: "POST",
		url: actionUrl,
		data: "{" + "\"data\":" + convertObjectToJSON(params) + "}",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (response) {
			if(response != undefined){
				if(response.resultSet)
					callback(response.resultSet);
				else if(response.result){
					if(response.result.state == 'error'){
						failMsg('.tabs-content');
						callback();
					}else if(response.result.state == 'success'){
						callback();
					}
				}
			}else{
				callback();
			}

		},
		failure: function (msg) {
		},
		always: function (msg) {},
		error: function (xhr, error, msg) {

			if (xhr.status > 299) {
//				fail(msg);
failMsg('.tabs-content');
if($("#_loder"))
	$("#_loder").addClass('hide');
setTimeout(function(){
	$(".alert-box").remove();
}, 1000);
console.debug(xhr);
			}
			else if(xhr.status == 200){
				if(xhr.responseText.indexOf("ASNAD_LOGINPAGE") > -1)
					location.href = "login.html";
			}

		}

	});
}


function RequestQueryString(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return "";
}




function ajaxRequestGetDownload(actionUrl, data, success, fail) {// khodayari

	$.ajax({
		type: "GET",
		url: actionUrl,
		data: data,
		contentType: "application/json; charset=utf-8",
		dataType: "a" +
		"" +
		"",
		success: function (response) {
			console.log(response);
		},
		failure: function (msg) {
			failMsg(msg);
		},
		always: function (msg) {
			failMsg(msg);
		},
		error: function (xhr, error, msg) {
			if (xhr.status > 299) {
				failMsg(msg);
				console.debug(xhr);
			}
			if(xhr.status  == 200){
				console.log(xhr.status);
			}

		}

	});


}
function afterAppletLoaded(){
	alert(0)
	$("#mainLoder").addClass('hide');
	return false;
}

function sendRequestWithJQuery(callback, showErrorMessage, configurationData) {
	$.ajax({
		dataType: "json",
		success : callback,
		error   : showErrorMessage,
		url     : configurationData.url,
		timeout : configurationData.remainingTime
	});
}

function myCallback(ajaxResponse) {
	var out = "";
	for(i = 0; i < ajaxResponse.length; i++) {
		out += ajaxResponse[i].book + ' by '+ ajaxResponse[i].author;
	}
	$("#my-fixture").html(out);
}
/**
 *@NApiVersion 2.x
 *@NScriptType Portlet
 */
define(['N/file', "N/runtime"], function (file, runtime) {
	function render(context) {
		log.debug("Row 7, script initiliased.", context);

		// Step 1: Source input parameters
		var objInput = getInput(context);

		context.portlet.title = objInput['title'];

		var strHtml = compileHtml(objInput);

		context.portlet.html = strHtml; // objFile.getContents() https://system.eu2.netsuite.com/app/help/helpcenter.nl?fid=section_4229269811.html
	}

	function getInput(context) {
		var objInput = {};

		// Get account ID
		var idAccount = runtime.accountId;

		// Get script parameters
		var objScript = runtime.getCurrentScript();
		objInput['title'] = objScript.getParameter({ name: "custscript_oro_1020_pl_title" });
		objInput['idfile'] = objScript.getParameter({ name: "custscript_oro_1020_pl_html" });
		objInput['height'] = objScript.getParameter({ name: "custscript_oro_1020_pl_height" }) + "px";

		// var nmeFileParameter = "custscript_oro_1020_pl_html";
		// if (idAccount.toString().indexOf("sb")>-1) {
		// 	var numSbAccount = idAccount.substr(idAccount.search("sb")+2);
		// 	if (numSbAccount == 1) nmeFileParameter += "_sb1";
		// 	else nmeFileParameter += "_sb2";
		// }

		return objInput;
	}

	function compileHtml(objInput) {
		var objFile = file.load({
			id: objInput['idfile']
		});
		var urlFile = objFile.url;

		var html = "<!DOCTYPE HTML>";
		html += "<html>";
		html += "<head></head>";
		html += "<body>";
		
		html += '<iframe width="100%" height=' + objInput['height'] + ' src=' + urlFile + ' frameborder="0"></iframe>';
		html += "</body>";
		html += '</html>';

		return html;
	}
	return {
		render: render
	};
});
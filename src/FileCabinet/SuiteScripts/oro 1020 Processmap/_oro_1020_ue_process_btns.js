/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */

define(["N/record", "N/runtime", "N/ui/serverWidget"], function (record, runtime, serverWidget) {
	function beforeLoad(context) {
      	// BY GUN TO SET PROCESS MAP DEFAULT AS HIDDEN
		var objForm = context.form;
      	objForm.clientScriptModulePath = "SuiteScripts/oro 1020 Processmap/_oro_1020_cs_process_btn.js";
      
      	objForm.addButton({
          id:"custpage_process_map_btn",
          label:"Show Process Map",
          functionName:"toggleMap"
        });
      
      log.debug("User Event script initialised.", JSON.stringify(objForm));
      
      	var scriptField = objForm.addField({
          id: 'custpage_script',
          type:  serverWidget.FieldType.INLINEHTML,
          label: 'Custom Script'
        }).defaultValue = "<script>jQuery(function($){ require(['/SuiteScripts/oro 1020 Processmap/_oro_1020_cs_process_btn.js'], function(mod){ mod.hideInit();});});</script>";
      	
      	
      	/*
		// log.debug("User Event script initialised.", JSON.stringify(context));

		// Get script parameters and client script
		var objInput = {};
		objInput = getInput(context, objInput);

		// Load form, attach client script, and store process map field name in form field so that the client script can pick it up again
		var objForm = context.form;
		objForm.clientScriptModulePath = "SuiteScripts/oro 1020 Processmap/_oro_1020_cs_process_btn.js";
		//var objFldId = objForm.addField({
		//	id : "custpage_oro_1020_fldid",
		//	type : serverWidget.FieldType.TEXT,
		//	label : 'Internal ID of Process Map field',
		//	defaultValue : objInput.processMapField
		//});
		// objFldId.defaultValue = objInput.processMapField;
		//log.debug("objFldId", "objInput.processMapField = " + objInput.processMapField + " | objFldId = " + objFldId);

		// var objFld = objForm.getField({
		// 	id: objInput.processMapField
		// });

		// Hide the process map field
		// objFld.updateDisplayType({
		// 	displayType: serverWidget.FieldDisplayType.HIDDEN
		// }); // setDisplayType("hidden") Hide the process map field and store the field id so that the client script can pick it up again

		var objBtnShow = objForm.addButton({
			id: "custpage_oro_1020_btnShow",
			label: "Hide Process Map",
			functionName: "buttonClick(`" + JSON.stringify(objForm) + "`)" // https://netsuite.custhelp.com/app/answers/detail/a_id/85239/kw/pass%20value%20to%20client%20script
		});*/
	}

	function getInput(context, objInput) {
		objInput.objScript = runtime.getCurrentScript();

		objInput.showButtonLabel = objInput.objScript.getParameter({
			name: "custscript_oro_1020_btnShow"
		});
		if (isNullOrEmpty(objInput.showButtonLabel)) objInput.showButtonLabel = "Show Process Map";

		objInput.hideButtonLabel = objInput.objScript.getParameter({
			name: "custscript_oro_1020_btnHide"
		});
		if (isNullOrEmpty(objInput.hideButtonLabel)) objInput.hideButtonLabel = "Hide Process Map";

		objInput.processMapField = objInput.objScript.getParameter({
			name: "custscript_oro_1020_fldnme"
		});
		if (isNullOrEmpty(objInput.processMapField)) {
			switch (context.newRecord.type) {
				case "inventoryitem":
					objInput.processMapField = "custitem_oro_1020_itm_process";
				default: objInput.processMapField = "custitem_oro_1020_itm_process";
			}
		}

		// objInput.flagField = objInput.objScript.getParameter({
		// 	name: "custitemcustitem_oro_1020_is_show"
		// });
		// if (isNullOrEmpty(objInput.flagField)) {
		// 	switch (context.newRecord.type) {
		// 		case "inventoryitem":
		// 			objInput.flagField = "custitemcustitem_oro_1020_is_show";
		// 		default: objInput.flagField = "custitemcustitem_oro_1020_is_show";
		// 	}
		// }

		return objInput;
	}

	function isNullOrEmpty(str) {
		return (typeof str == 'undefined' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) /* || str.replace(/\s/g,"") === "" */);
	}

	return {
		beforeLoad: beforeLoad
	};
});
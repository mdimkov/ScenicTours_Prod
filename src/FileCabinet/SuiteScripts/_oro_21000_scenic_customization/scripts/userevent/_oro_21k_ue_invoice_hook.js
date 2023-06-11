/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NAmdConfig /SuiteBundles/Bundle 372579/_oro_1010_library.json
 */
define(["ORO/HookManager", "../hooks/_oro_21k_hook_invoice_tax_statement"],

    (HookManager, TaxStatement) => {

        const beforeSubmit = (scriptContext) => {
            let { newRecord  } = scriptContext;
            let hookManager = new HookManager(scriptContext);
            hookManager.register(new TaxStatement(newRecord));
        }

        return { beforeSubmit }
    });

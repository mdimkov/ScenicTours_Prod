/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(["N/query", "N/search", "./lib"],

    (query, search, lib) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

            try {

                log.audit('MDIMKOV', '--- SCRIPT START ---');

                // return JSON.stringify(query.runSuiteQL({query: "SELECT Top 3 * FROM customer"}).asMappedResults());

                let balances = [];

                // MDIMKOV 24.09.2021: load the customers search
                let customerBalanceSearch = search.load({
                    id: "customsearch_oro_21291_custbalget"
                });

                customerBalanceSearch.filters.push(search.createFilter({
                    name: "subsidiary",
                    operator: search.Operator.ANYOF,
                    values: requestParams.SubsidiaryID
                }));

                customerBalanceSearch.filters.push(search.createFilter({
                    name: "account",
                    operator: search.Operator.ANYOF,
                    values: lib.findAccountByNumber(requestParams.GLAccount)
                }));

                customerBalanceSearch.run().each(result => {
                    let entry = {};
                    result.columns.forEach(column => {

                        let label = column.label;
                        let value = result.getText(column);

                        switch (label) {

                            case 'Subsidiary':
                                value = result.getValue(column);
                                break;
                        }

                        if (value == null) {
                            value = result.getValue(column)
                        }

                        entry[label] = value;
                    });

                    balances.push(entry);

                    return true;
                });

                return '{"CustomerBalance":' + JSON.stringify(balances) + '}';

            } catch (e) {

                log.error('ERROR', e.message + ' --- ' + e.stack);
                return e.message + ' --- ' + e.stack;

            }
        }

        return {get}
    });

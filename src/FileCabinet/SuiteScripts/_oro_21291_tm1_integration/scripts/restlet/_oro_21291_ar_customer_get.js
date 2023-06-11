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

                let customers = [];

                // MDIMKOV 24.09.2021: load the customers search
                let arCustomersSearch = search.load({
                    id: "customsearch_oro_21291_customers"
                });

                if (requestParams.CustomerID) {
                    arCustomersSearch.filters.push(search.createFilter({
                        name: "entityid",
                        operator: query.Operator.IS,
                        values: requestParams.CustomerID
                    }));
                }

                arCustomersSearch.run().each(result => {
                    let entry = {};
                    result.columns.forEach(column => {

                        // log.audit('column', column);

                        let label = column.label;
                        let value = result.getText(column);

                        switch (label) {
                            case 'AgentCountry':
                            case 'Country':
                                value = lib.countryByText(value)[0].code;
                                break;

                            case 'Subsidiary':
                                value = result.getValue(column);
                                break;

                            case 'BookingBrand':
                                value = result.getValue(column);
                                break;

                            case 'DefaultARAccount':
                                let flAcc = search.lookupFields({
                                    type: search.Type.ACCOUNT,
                                    id: 119,
                                    columns: ['number']
                                });

                                value = flAcc.number;
                                break;
                        }

                        if (value == null) {
                            value = result.getValue(column)
                        }

                        entry[label] = value;
                    });

                    customers.push(entry);

                    return true;
                });

                return '{"ARCustomers":' + JSON.stringify(customers) + '}';

            } catch (e) {

                log.error('ERROR', e.message + ' --- ' + e.stack);
                return e.message + ' --- ' + e.stack;

            }
        }

        return {get}
    });

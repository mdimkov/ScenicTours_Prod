/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(["N/search", "N/format"],

    (search, format) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

            const convertValue = (field, value) => {
                let numberFields = ["Balance", "DepositBalance", "DocumentFXRate", "DocumentAmountHC", "DocumentAmountTC",
                    "ApplyNetSuiteID", "SubsidiaryID", "CustNetSuiteID", "DepositBalance", "NetSuiteID"];

                if (numberFields.includes(field)) {
                    return value ? Number(value) : null;
                } else if (value === "- None -") {
                    return "";
                }
                return value;
            }


            let arTrans = [];

            let arTransSearch = search.load({
                id: "customsearch_oro_21291_ar_trans"
            });

            if (requestParams.DateFrom) {
                arTransSearch.filters.push(search.createFilter({
                    name: "trandate",
                    operator: search.Operator.ONORAFTER,
                    values: formatDate(requestParams.DateFrom)
                }));
            }

            if (requestParams.SubsidiaryID && Number.isInteger(parseInt(requestParams.SubsidiaryID))) {
                arTransSearch.filters.push(search.createFilter({
                    name: "subsidiary",
                    operator: search.Operator.ANYOF,
                    values: requestParams.SubsidiaryID
                }));
            } else {
                // MDIMKOV 30.07.2021: this is a required parameter, raise error message if not provided or not integer
                return {"status": "error", "error message": "SubsidiaryID is required"};
            }

            arTransSearch.run().each(result => {
                let entry = {};
                result.columns.forEach(column => {
                    let label = column.label;
                    let value = '';

                    if (label === 'Currency' || label === 'CreatedUser') {
                        value = result.getText(column);
                    } else {
                        value = result.getValue(column);
                    }

                    entry[label] = convertValue(label, value);
                });
                arTrans.push(entry);
                return true;
            });

            const arTransReduced = reduceJSON(arTrans);

            return JSON.stringify(arTransReduced);

        }

        const convertValue = (field, value) => {
            let numberFields = ["subsidiary", "account", "department", "location", "fiscalYear", "fiscalPeriod",
                "amount"];

            if (numberFields.includes(field)) {
                return value ? Number(value) : null;
            } else if (value === "- None -") {
                return "";
            }
            return value;
        }

        const formatDate = date => {
            return format.format({
                value: new Date(date),
                type: format.Type.DATE,
                timezone: format.Timezone.GMT
            });
        }

        // MDIMKOV 29.07.2021: this function groups the data by customer, as requested in the requirements document
        const reduceJSON = obj => {
            var reduceObj = obj.reduce(function (r, a) {
                r[a.CustomerNumber] = r[a.CustomerNumber] || [];
                r[a.CustomerNumber].push(a);
                return r;
            }, Object.create(null));


            var resultObject = {};
            resultObject['ARCustomerSummary'] = [];

            Object.keys(reduceObj).forEach(function (key) {

                for (var i = 0; i < reduceObj[key].length; i++) {
                    var newObj = {};

                    newObj['CustomerNumber'] = reduceObj[key][i].CustomerNumber;
                    newObj['CustNetSuiteID'] = reduceObj[key][i].CustNetSuiteID;
                    newObj['SubsidiaryID'] = reduceObj[key][i].SubsidiaryID;
                    newObj['Balance'] = reduceObj[key][i].Balance;
                    newObj['DepositBalance'] = reduceObj[key][i].DepositBalance;
                    newObj['ARTransactions'] = reduceObj[key];

                    // delete child object lines
                    delete reduceObj[key][i].Balance;
                    delete reduceObj[key][i].DepositBalance;

                }

                resultObject['ARCustomerSummary'].push(newObj);
            });
            return resultObject;
        }

        return {get}
    });

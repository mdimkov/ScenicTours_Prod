/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(["N/query"],

    (query) => {
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

                // return JSON.stringify(query.runSuiteQL({query: "SELECT Top 3 * FROM customrecord_cseg_oro_tour"}).asMappedResults());

                let tours = [];

                // MDIMKOV 22.09.2021: create the Tours query
                let tourQuery = query.create({
                    type: "customrecord_cseg_oro_tour"
                });

                let locationJoin = tourQuery.autoJoin({
                    fieldId: "custrecord_oro_tour_loc"
                });

                let tourRegionJoin = tourQuery.autoJoin({
                    fieldId: "custrecord_oro_tour_reg_name"
                });

                let globalRegionJoin = tourQuery.autoJoin({
                    fieldId: "custrecord_oro_tour_glo_reg_name"
                });

                let statusJoin = tourQuery.autoJoin({
                    fieldId: "custrecord_oro_tour_status"
                });

                let saleTypeJoin = tourQuery.autoJoin({
                    fieldId: "custrecord_oro_tour_sale_type"
                });

                let vesselJoin = tourQuery.autoJoin({
                    fieldId: "custrecord_oro_tour_vessel"
                });

                let opsGroupJoin = tourQuery.autoJoin({
                    fieldId: "custrecord_oro_tour_ops"
                });

                let journeyModeJoin = tourQuery.autoJoin({
                    fieldId: "custrecord_oro_tour_journey"
                });

                let tourBrandJoin = tourQuery.autoJoin({
                    fieldId: "custrecord_oro_tour_brand"
                });

                tourQuery.columns = [
                    "externalid",
                    "id",
                    "custrecord_oro_tour_code",
                    "custrecord_oro_tour_start",
                    "custrecord_oro_tour_end",
                    "custrecord_oro_tour_loc",
                    "custrecord_oro_tour_reg",
                    "custrecord_oro_tour_glo_reg",
                    "custrecord_oro_tour_ops",
                    "custrecord_oro_tour_journey",
                    "custrecord_oro_tour_brand",
                    "custrecord_oro_tour_duration",
                    "custrecord_oro_tour_pax_budget",
                    "custrecord_oro_tour_room_cap",
                    "custrecord_oro_tour_pax_actual",
                    "custrecord_oro_tour_pax_cancel",
                    "custrecord_oro_tour_extension",
                    "custrecord_oro_tour_subs",
                    "custrecord_oro_tour_loc_name",
                ]
                    .map(fieldId => tourQuery.createColumn({fieldId: fieldId}));
                tourQuery.columns.push(locationJoin.createColumn({fieldId: "name"}));
                tourQuery.columns.push(tourRegionJoin.createColumn({fieldId: "name"}));
                tourQuery.columns.push(globalRegionJoin.createColumn({fieldId: "name"}));
                tourQuery.columns.push(statusJoin.createColumn({fieldId: "name"}));
                tourQuery.columns.push(saleTypeJoin.createColumn({fieldId: "name"}));
                tourQuery.columns.push(vesselJoin.createColumn({fieldId: "name"}));
                tourQuery.columns.push(opsGroupJoin.createColumn({fieldId: "name"}));
                tourQuery.columns.push(journeyModeJoin.createColumn({fieldId: "name"}));
                tourQuery.columns.push(tourBrandJoin.createColumn({fieldId: "name"}));

                if (requestParams.tourCode) {
                    tourQuery.condition = tourQuery.createCondition({
                        fieldId: "custrecord_oro_tour_code",
                        operator: query.Operator.IS,
                        values: requestParams.tourCode
                    });
                }

                // MDIMKOV 22.09.2021: create the Cabins query
                let cabinQuery = query.create({
                    type: "customrecord_oro_cabin_cpcty"
                });

                let classJoin = cabinQuery.autoJoin({
                    fieldId: "custrecord_oro_cabin_cpcty_class"
                });

                let categoryJoin = cabinQuery.autoJoin({
                    fieldId: "custrecord_oro_cabin_cpcty_category"
                });

                let deckJoin = cabinQuery.autoJoin({
                    fieldId: "custrecord_oro_cabin_cpcty_deck"
                });

                cabinQuery.columns.push(classJoin.createColumn({fieldId: "name"}));
                cabinQuery.columns.push(cabinQuery.createColumn({fieldId: "name"}));
                cabinQuery.columns.push(categoryJoin.createColumn({fieldId: "name"}));
                cabinQuery.columns.push(deckJoin.createColumn({fieldId: "name"}));
                cabinQuery.columns.push(cabinQuery.createColumn({fieldId: "custrecord_oro_cabin_cpcty_capacity"}));


                tourQuery.run().iterator().each(result => {
                    let values = result.value.values;
                    let i = 0;
                    const tourid = values[1];
                    let cabins = [];

                    log.audit('values', values);

                    // MDIMKOV 22.09.2021: prepare the cabin sub-set
                    cabinQuery.condition = cabinQuery.createCondition({
                        fieldId: "custrecord_oro_cabin_cpcty_tour",
                        operator: query.Operator.EQUAL,
                        values: tourid
                    });

                    cabinQuery.run().iterator().each(resultCabin => {
                        let values = resultCabin.value.values;
                        let j = 0;

                        cabins.push({
                            "TourID": tourid,
                            "CabinClass": values[j++],
                            "CabinName": values[j++],
                            "CabinCategory": values[j++],
                            "CabinDeck": values[j++],
                            "Capacity": values[j++]
                        })

                        return true;
                    });

                    // v2 using template
                    tours.push({
                        "IntegrationID": values[0],
                        "IntegrationType": "TourRecord",
                        "TourID": values[1],
                        "Tour": values[2],
                        "DepartureDate": values[3],
                        "ReturnDate": values[4],
                        "TourLocation": values[19],
                        "TourLocationName": values[18],
                        "TourRegion": values[6],
                        "TourRegionName": values[20],
                        "TourGlobalRegion": values[7],
                        "TourGlobalRegionName": values[21],
                        "OpsGroup": values[25],
                        "JourneyMode": values[26],
                        "TourBrand": values[10],
                        "TourStatus": values[22],
                        "TourDays": values[11],
                        "PassengerCapacity": values[12],
                        "RoomCapacity": values[13],
                        "TourPassengers": values[14],
                        "CancelPassengers": values[15],
                        "SaleType": values[23],
                        "Vessel": values[24],
                        "IsExtension": values[16],
                        "SubsidiaryID": values[17],
                        "Cabins": cabins
                    });

                    // v1 after loc name
                    /*tours.push({
                        "IntegrationID": values[i++],
                        "IntegrationType": "TourRecord",
                        "TourID": values[i++],
                        "Tour": values[i++],
                        "DepartureDate": values[i++],
                        "ReturnDate": values[i++],
                        "TourLocation": values[19],
                        "TourLocationName": values[18],
                        "TourRegion": values[i++],
                        "TourRegionName": values[20],
                        "TourGlobalRegion": values[i++],
                        "TourGlobalRegionName": values[21],
                        "OpsGroup": values[25],
                        "JourneyMode": values[26],
                        "TourBrand": values[27],
                        "TourStatus": values[22],
                        "TourDays": values[i++],
                        "PassengerCapacity": values[i++],
                        "RoomCapacity": values[i++],
                        "TourPassengers": values[i++],
                        "CancelPassengers": values[i++],
                        "SaleType": values[23],
                        "Vessel": values[24],
                        "IsExtension": values[i++],
                        "SubsidiaryID": values[i++],
                        "Cabins": cabins
                    });
*/
                    // old values, before custrecord_oro_tour_loc_name
                    /*tours.push({
                        "IntegrationID": values[i++],
                        "IntegrationType": "TourRecord",
                        "TourID": values[i++],
                        "Tour": values[i++],
                        "DepartureDate": values[i++],
                        "ReturnDate": values[i++],
                        "TourLocation": values[i++],
                        "TourLocationName": values[18],
                        "TourRegion": values[i++],
                        "TourRegionName": values[19],
                        "TourGlobalRegion": values[i++],
                        "TourGlobalRegionName": values[20],
                        "OpsGroup": values[24],
                        "JourneyMode": values[25],
                        "TourBrand": values[26],
                        "TourStatus": values[21],
                        "TourDays": values[i++],
                        "PassengerCapacity": values[i++],
                        "RoomCapacity": values[i++],
                        "TourPassengers": values[i++],
                        "CancelPassengers": values[i++],
                        "SaleType": values[22],
                        "Vessel": values[23],
                        "IsExtension": values[i++],
                        "SubsidiaryID": values[i++],
                        "Cabins": cabins
                    });*/

                    return true;
                });

                return '{"TourRecord":' + JSON.stringify(tours) + '}';

            } catch (e) {

                log.error('ERROR', e.message + ' --- ' + e.stack);
                return e.message + ' --- ' + e.stack;

            }
        }

        return {get}
    });

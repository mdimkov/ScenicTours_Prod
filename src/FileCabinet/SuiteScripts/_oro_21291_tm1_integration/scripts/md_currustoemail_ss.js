/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 */
    (email, record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} context
         * @param {string} context.type - Script execution context. Use values from the context.InvocationType enum.
         * @since 2015.2
         */
        const execute = (context) => {

            var fullXmlContent = '';
            fullXmlContent += '<html><h3>List of Active Users</h3>';
            fullXmlContent += '<table>';

            var employeeSearchObj = search.create({
                type: 'employee',
                filters:
                    [
                        ['access','is','T'],
                        'AND',
                        ['isinactive','is','F']
                    ],
                columns:
                    [
                        search.createColumn({
                            name: 'entityid',
                            sort: search.Sort.ASC
                        }),
                        'email',
                        search.createColumn({
                            name: 'role',
                            sort: search.Sort.ASC
                        })
                    ]
            });
            var searchResultCount = employeeSearchObj.runPaged().count;
            employeeSearchObj.run().each(function(result){

                fullXmlContent += '<tr>';

                var name = result.getValue(result.columns[0]);
                var emailaddr = result.getValue(result.columns[1]);
                var role = result.getText(result.columns[2]);
                role = (role=='Administrator') ? '<font color ="red">' + role + '</font>' : role;

                fullXmlContent += '<td>' + name + '</td>';
                fullXmlContent += '<td>' + emailaddr + '</td>';
                fullXmlContent += '<td>' + role + '</td>';

                fullXmlContent += '</tr>';
                return true;
            });
            
            fullXmlContent += '</table></html>';

            try {
                log.audit('MDIMKOV', '--- SCRIPT START ---');

                var senderId = -5;
                var recipientEmail = 'christophe.lacour@scenic.eu';
                email.send({
                    author: senderId,
                    recipients: recipientEmail,
                    subject: 'Scenic - List of Active Users',
                    body: fullXmlContent
                });

                log.audit('MDIMKOV', '--- SCRIPT END ---');
            } catch (e) {
                log.error('ERROR', e.message + ' --- ' + e.stack);
            }

        }

        return {execute}

    });

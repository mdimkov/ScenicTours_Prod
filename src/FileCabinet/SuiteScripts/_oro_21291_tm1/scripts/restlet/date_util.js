/**
 * @NApiVersion 2.1
 */
define([],
    
    () => {

        const getUtcDate = systemDate => {
            let utcDate = new Date(systemDate);
            let offset = utcDate.getTimezoneOffset()/60;
            utcDate.setTime(utcDate.getTime() + offset*60*60*1000);

            return utcDate;
        }

        return {getUtcDate}

    });

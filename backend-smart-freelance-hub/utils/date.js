const moment = require('moment');

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
    
}
function isUserActive()
{
    var lastActiveDate = moment("2018-07-26");
    var currentDate = moment("2018-08-04");
    var diff = moment.duration(currentDate.diff(lastActiveDate));
    moment.duration(currentDate.diff(lastActiveDate))
    console.log(diff.months() + " months, " + diff.weeks() + " weeks, " + diff.days()%7 + " days.");
    if(diff.months() == 0 && diff.weeks() < 1)
    {
        console.log("Active");
        return true;
    }else
    {
        console.log("Inactive");
        return false;
    }
}
function currentDate()
{
    return moment().format('DD-MM-YYYY')
}
module.exports = {isUserActive, formatDate, currentDate}
var archive = require('./helpers/archive-helpers');

var CronJob = require('cron').CronJob;
var job = new CronJob('0-59 0-59 0-23 * * 0-6', function(){
    archive.updateSites();
    console.log('Updating');
}, null, true, "America/Los_Angeles");



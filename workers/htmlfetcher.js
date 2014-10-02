// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
//
var http = require('http-request');
var archive = require('../helpers/archive-helpers');

exports.htmlFetcher = function(url, callback){
  http.get(url, archive.paths.archivedSites +'/'+ url, function (err, res) {
    if (err) {
      console.error(err, 'fetcher error');
      return;
    }else{
      console.log('downloaded ', url)
      if(callback !== undefined){
        console.log('should call here', callback)
        callback(url);
      }
    }
  });
};

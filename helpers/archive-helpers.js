var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var fetcher = require('../workers/htmlfetcher.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};
// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

//reads a list of urls and calls a callback with an array of sites
exports.readListOfUrls = function(callback){
  fs.readFile(this.paths.list, function(err, data){
    if(err){
      console.log('cannot read list of urls');
    }
    callback(data.toString().split('\n'));
  });
};

exports.isUrlInList = function(url, callback){
  this.readListOfUrls(function(urlArray){
    if(urlArray.indexOf(url) >= 0){
      callback(true);
    }else{
      callback(false);
    }
  });
};

exports.addUrlToList = function(url){
  fs.appendFile(this.paths.list,url + '\n');
};

exports.isURLArchived = function(url, callback){
  fs.readFile(this.paths.archivedSites + '/' + url, function(err){
    if(err){
      callback(false);
    }else{
      callback(true);
    }
  });
};

exports.downloadUrls = function(url, callback){
  fetcher.htmlFetcher(url, callback);
};

exports.updateSites = function() {
  var self = this;
  this.readListOfUrls(function(sites){
    console.log(sites)
    for(var i = 0; i < sites.length -1; i++){
      self.downloadUrls(sites[i]);
    }
  })
}

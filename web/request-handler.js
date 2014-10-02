var path = require('path');
var http = require('http');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var actions = {
    'GET': function(req, res){
      if(req.url === '' || req.url === '/'){
        returnHtml(200,archive.paths.siteAssets + '/index.html',req,res, 'text/html');

      }
       else if (req.url.match('styles.css')){
         returnHtml(200,archive.paths.siteAssets + '/styles.css',req,res, 'text/css');
      } else if(req.url){
         returnHtml(200,archive.paths.archivedSites + req.url,req,res, 'text/html');

      }
    },
    'POST': function(req, res){
      getData(req,function(data){
        archive.isUrlInList(data,function(isInList){
          if(isInList){
            archive.isURLArchived(data,function(isArchived){
              if(isArchived){
                returnHtml(200, archive.paths.archivedSites + '/' +  data,req,res, 'text/html');
              }else{
                archive.downloadUrls(data, function(url){
                  returnHtml(200, archive.paths.archivedSites + '/' +  url,req,res, 'text/html');
                });
              }
            });
          }else{
            archive.addUrlToList(data);
            returnHtml(302,archive.paths.siteAssets + '/loading.html',req,res, 'text/html');
            archive.downloadUrls(data, function(url){
               returnHtml(200, archive.paths.archivedSites + '/' +  url,req,res, 'text/html');
            });
          }
      })

      })

    },
    'OPTIONS': function(){

    }
  };
  actions[req.method](req, res);
};
var returnHtml = function(status,path, req, res,type){

  fs.readFile(path, function (err, html) {
    if (err) {
      res.writeHead(404,httpHelper.headers);
      res.end('Neko.');
    }else{
      console.log('found file!')
      httpHelper.headers['Content-Type'] = type;
      res.writeHead(status,httpHelper.headers);
      res.end(html);
    }
  });
};
var getData = function(req,callback){
    var data = '';
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      data = data.substr(4);
      callback(data);
    });
};


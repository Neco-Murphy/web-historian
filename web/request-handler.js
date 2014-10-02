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
      archive.isUrlInList(req.url,function(trueOrFalse){
        if(trueOrFalse){
          archive.isURLArchived(req.url,function(isArchived)
          {
            if(isArchived){
              returnHtml(200,archive.paths.archivedSites + req.url,req,res, 'text/html');
            }
        });

        }else{
          addData(req);
          //returnHtml(loading)
          returnHtml(302,archive.paths.siteAssets + '/loading.html',req,res, 'text/html');
        }
      };
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
      httpHelper.headers['Content-Type'] = type;
      res.writeHead(status,httpHelper.headers);
      res.end(html);
    }
  });
};

var addData = function(req){
  var url = '';
  req.on('data', function(chunk){
    url += chunk;
  });
  req.on('end', function(){
    archive.addUrlToList(url);
  });
};

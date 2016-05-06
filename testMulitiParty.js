var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var bodyParser = require('body-parser');
var express = require('express');
var port = process.env.PORT || 8080;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/',function(req, res){
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="movie[name]"><br>'+
      '<input type="text" name="movie[title]"><br>'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
});
app.post('/upload',function(req, res ){
    console.log("123+++++")
    console.log(req.body)
    console.log("123+++++")
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
      req.poster = files
      console.log(req.poster)
      console.log(fields)

    });



});

app.listen(port);
console.log('imooc started on port '+port);
// http.createServer(function(req, res) {
//   if (req.url === '/upload' && req.method === 'POST') {
//     // parse a file upload
    // var form = new multiparty.Form();
    //
    // form.parse(req, function(err, fields, files) {
    //   res.writeHead(200, {'content-type': 'text/plain'});
    //   res.write('received upload:\n\n');
    //   res.end(util.inspect({fields: fields, files: files}));
    //   req.poster = fields
    // });
    //
    // return;
//   }
//
//   console.log(req.body)
//   console.log(req.poster)
//   // show a file upload form
//   res.writeHead(200, {'content-type': 'text/html'});
  // res.end(
  //   '<form action="/upload" enctype="multipart/form-data" method="post">'+
  //   '<input type="text" name="title"><br>'+
  //   '<input type="file" name="upload" multiple="multiple"><br>'+
  //   '<input type="submit" value="Upload">'+
  //   '</form>'
  // );
// }).listen(8080);

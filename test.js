var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

//用http模块创建一个http服务端
http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() === 'post') {
    // 处理上传的文件
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }

  //显示一个用于上传的form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title" /> '+
    '<input type="file" name="upload" multiple="multiple" /> '+
    '<input type="submit" value="Upload" />'+
    '</form>'
  );
}).listen(8080);

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var port = process.env.PORT || 3000;
var app = express();
app.locals.moment = require('moment');
var fs = require('fs')
var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl);
// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)
// 静态资源请求路径
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'bower_components')));
// console.info('__dirname',__dirname,path.join(__dirname, 'bower_components'));

app.set('views','./app/views/pages');
app.set('view engine','jade');
// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multipart());
app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection:'sessions'
    }),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

if('development' === app.get('env')){
    app.set('showStackError', true);  //输出报错信息
    app.use(logger(':method :url :status')); //输出的信息领域
    app.locals.pretty = true;   //输出样式格式化、便于观看
    mongoose.set('debug', true);    //数据库层输出报错信息
}

require('./config/routes')(app)
app.listen(port);
console.log('imooc started on port '+port);

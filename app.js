var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost/imooc';
app.locals.moment = require('moment');
mongoose.connect(dbUrl);

// 静态资源请求路径
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'bower_components')));
// console.info('__dirname',__dirname,path.join(__dirname, 'bower_components'));

app.set('views','./app/views/pages');
app.set('view engine','jade');
// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
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

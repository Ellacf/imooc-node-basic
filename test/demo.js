var express = require("express");
var request = require("supertest");
var bodyParser = require('body-parser');
var app = express();
var expect = require('chai').expect;

// 定义路由
app.get('/user', function(req, res){
  res.status(200).send({ name: 'get it' });
});

describe('GET /user', function(){
  it('respond with json', function(done){
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err){
          done(err);
        }
        expect(res.body.name).to.equal('get it');
        done();
      })
  });
});

// 定义路由
describe('POST /user', function(){
  it('should work with .send() etc', function(done){
    var app = express();

    app.use(bodyParser.json());

    app.post('/', function(req, res){
      res.send(req.body.name);
    });

    request(app)
    .post('/')
    .send({ name: 'jimmy' })
    .expect('jimmy', done);
  });
});

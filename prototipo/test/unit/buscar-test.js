var proxyquire = require('proxyquire');
var sinon = require('sinon');
var supertest = require('supertest');
var expect = require('chai').expect;

var express = require('express');

describe('POST /buscar', function () {
  var app, getUserStub, request, route;

  beforeEach(function () {
    getUserStub = sinon.stub();
    app = express();
    route = proxyquire('../../routes/vfs/file-list.js', {
      '../utils/login.js': function(req, res, next){
        next();
      },
      "../../models/file.js": {
        find: function(opts, cb){
          cb("Ahhhh");
        }
      }
    });
    route(app);
    request = supertest(app);
  });

  it('should respond with 200 and a user object', function (done) {
    var userData = {
      username: 'nodejs'
    };
    getUserStub.returns(userData);
    request
      .post('/buscar')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        expect(res.body).to.deep.equal({});
        done();
      });
  });
});

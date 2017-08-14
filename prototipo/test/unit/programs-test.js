// We'll use this to override require calls in routes
var proxyquire = require('proxyquire');
// This will create stubbed functions for our overrides
var sinon = require('sinon');
// Supertest allows us to make requests against an express object
var supertest = require('supertest');
// Natural language-like assertions
var expect = require('chai').expect;

var express = require('express');

describe('GET /listarProgramas', function () {
  var app, softwareFindStub, request, route;

  beforeEach(function () {
    softwareFindStub = sinon.stub();
    app = express();

    route = proxyquire('../../routes/programas.js', {
      '../utils/login.js': function(req, res, next){
        next();
      },
      "../models/software.js": {
        find: softwareFindStub,
      },
    });

    route(app);

    request = supertest(app);
  });

  it('should respond with a 200 and a list of default programs', function (done) {
    softwareFindStub.returns(Promise.resolve([]));

    request
      .post('/listarProgramas')
      .set('Content-Type', 'application/json')
      .set({
        'Accept' : 'application/json'
      })
      .expect(200, function (err, res) {
        expect(res.body).to.be.an("Array");
        done();
      });
  });
});

var proxyquire = require('proxyquire');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('NodeAClassad', function () {
  var app, fileFindStub,fileFindOneStub,dagExeFindStub, request, route;

  beforeEach(function () {
    fileFindStub = sinon.stub();
    fileFindOneStub = sinon.stub();
    dagExeFindStub = sinon.stub();
    route = proxyquire('../../routes/run/loadmanagers.js', {
      "../../utils/logger.js": console,
    });
  });

  it('should return nothing', function (done) {
    fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({}, "")).to.be.equal("");
      done();
  });

  it('should respond with 200 and Invalid filename', function (done) {
    fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({
          title: "String",
          id: 0,
          x: 0,
          y: 0,
          NodeStatus: "String",
          StatusDetail:"String",
          configurado : {
              programa: "String",
              location : "String",
              useDocker : false,
              image:"String",
              argumento : "String",
              raw: "Number",
              times: "Number",
              file: [{

              }]
          }
      }, 0)).to.be.equal("");
      done();
  });
});

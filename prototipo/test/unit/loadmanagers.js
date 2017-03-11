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

  it('should respond with valid openlava file format', function (done) {
    fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({
        title: "nombre",
        id: 0,
        x: 0,
        y: 0,
        nombre: "nombre",
        directorio : "directorio",
        configurado : {
          programa: "programa",
          location : "location",
          useDocker : false,
          image: "image",
          argumento : "argument",
          raw: 0,
          times: 0
        },
        dependencia : []
      }, 1)).to.be.equal("");
      done();
  });

  it('should respond with valid torque file format', function (done) {
    fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({
        title: "nombre",
        id: 0,
        x: 0,
        y: 0,
        nombre: "nombre",
        directorio : "directorio",
        configurado : {
          programa: "programa",
          location : "location",
          useDocker : false,
          image: "image",
          argumento : "argument",
          raw: 0,
          times: 0
        },
        dependencia : []
      }, 2)).to.be.equal("");
      done();
  });

  it('should respond with valid slurm file format', function (done) {
    fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({
        title: "nombre",
        id: 0,
        x: 0,
        y: 0,
        nombre: "nombre",
        directorio : "directorio",
        configurado : {
          programa: "programa",
          location : "location",
          useDocker : false,
          image: "image",
          argumento : "argument",
          raw: 0,
          times: 0
        },
        dependencia : []
      }, 3)).to.be.equal("");
      done();
  });

  it.skip('should respond with exception', function (done) {
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
      }, 1)).to.throw(new Error("Cannot read property 'length' of undefined"));
      done();
  });
});

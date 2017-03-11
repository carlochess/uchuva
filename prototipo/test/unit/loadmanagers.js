var proxyquire = require('proxyquire');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('NodeAClassad', function () {
  var app, fileFindStub,fileFindOneStub,dagExeFindStub, request, route;

  beforeEach(function () {
    /*fileFindStub = sinon.stub();
    fileFindOneStub = sinon.stub();
    dagExeFindStub = sinon.stub();*/
    route = proxyquire('../../routes/run/loadmanagers.js', {
      "../../utils/logger.js": console,
    });
  });

  it('should return nothing', function (done) {
    //fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({}, "")).to.be.equal("");
      done();
  });

  it('should return an openlava valid bash desc file', function (done) {
    //fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({
          directorio: "String",
          nombre: "",
          dependencia: "hola".split(""),
          configurado : {
              location : "Location",
              argumento : "Argumento",
              times: 20,
              useDocker : false,
              image:"Image",
              //universe: ""
          }
      }, 1)).to.be.a('string');
      done();
  });

    it('should return a torque valid bash desc file', function (done) {
    //fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({
          directorio: "String",
          nombre: "",
          dependencia: "hola".split(""),
          configurado : {
              location : "Location",
              argumento : "Argumento",
              times: 20,
              useDocker : false,
              image:"Image",
              //universe: ""
          }
      }, 2)).to.be.a('string');
      done();
  });

  it('should return a slurm valid bash desc file', function (done) {
    //fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({
          directorio: "String",
          nombre: "",
          dependencia: "hola".split(""),
          configurado : {
              location : "Location",
              argumento : "Argumento",
              times: 20,
              useDocker : false,
              image:"Image",
              //universe: ""
          }
      }, 3)).to.be.a('string');
      done();
  });

  it.skip('should return an exception', function (done) {
    //fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({
          directorio: "String",
          nombre: "",
          dependencia: 5,//"hola".split(""),
          configurado : {
              location : "Location",
              argumento : "Argumento",
              times: 20,
              useDocker : false,
              image:"Image",
              //universe: ""
          }
      }, 3)).to.throw(new Error());
      done();
  });
});

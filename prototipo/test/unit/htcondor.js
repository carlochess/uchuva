var proxyquire = require('proxyquire');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('HTCondorNodeAClassad', function () {
  var route;

  beforeEach(function () {
    /*fileFindStub = sinon.stub();
    fileFindOneStub = sinon.stub();
    dagExeFindStub = sinon.stub();*/
    route = proxyquire('../../routes/run/htcondor.js', {
      "../../utils/logger.js": console,
    });
  });

  it('should return nothing', function (done) {
    //fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({}, "")).to.be.equal("");
      done();
  });

  it('should return a HTCondor valid submitfile', function (done) {
    //fileFindOneStub.yields(new Error(), []);
      expect(route.nodeAClassAd({
          directorio: "String",
          nombre: "nombre",
          dependencia: "hola".split(""),
          configurado : {
              location : "Location",
              argumento : "Argumento",
              //times: 20,
              //useDocker : true,
              image:"Image",
              //universe: ""
          }
      }, ["Hola"], ["Adios"], 1)).to.be.a('string');
      done();
  });
});

'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var customFormats = module.exports = function(zSchema) {
  // Placeholder file for all custom-formats in known to swagger.json
  // as found on
  // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat

  var decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/;

  /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
  zSchema.registerFormat('double', function(val) {
    return !decimalPattern.test(val.toString());
  });

  /** Validates value is a 32bit integer */
  zSchema.registerFormat('int32', function(val) {
    // the 32bit shift (>>) truncates any bits beyond max of 32
    return Number.isInteger(val) && ((val >> 0) === val);
  });

  zSchema.registerFormat('int64', function(val) {
    return Number.isInteger(val);
  });

  zSchema.registerFormat('float', function(val) {
    // should parse
    return Number.isInteger(val);
  });

  zSchema.registerFormat('date', function(val) {
    // should parse a a date
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('dateTime', function(val) {
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('password', function(val) {
    // should parse as a string
    return typeof val === 'string';
  });
};

customFormats(ZSchema);

var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;

chai.should();

describe('/crearArchivo', function() {
  describe('post', function() {
    it('should respond with 200 Result of the operation', function(done) {
      /*eslint-disable*/
      var schema = {
        "type": "object",
        "properties": {
          "success": {
            "type": "string",
            "description": "Error number. None is 0"
          }
        }
      };

      /*eslint-enable*/
      api.post('/crearArchivo')
      .set('Content-Type', 'multipart/form-data')
      .set({
        'apikey': 'DATA GOES HERE'
      })
      .send({
          cwd: 'DATA GOES HERE',
          file: 'DATA GOES HERE'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

    it('should respond with default Unexpected error', function(done) {
      /*eslint-disable*/
      var schema = {
        "type": "object",
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "message": {
            "type": "string"
          },
          "fields": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.post('/crearArchivo')
      .set('Content-Type', 'multipart/form-data')
      .set({
        'apikey': 'DATA GOES HERE'
      })
      .send({
          cwd: 'DATA GOES HERE',
          file: 'DATA GOES HERE'
      })
      .expect('DEFAULT RESPONSE CODE HERE')
      .end(function(err, res) {
        if (err) return done(err);

        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

  });

});

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
var conn = process.env.conn || "http://localhost:3000";
var api = supertest(conn); // supertest init;

chai.should();

describe('/build', function() {
  describe('get', function() {
    it('should respond with 200 Execution dag', function(done) {
      /*eslint-disable*/
      var schema = {
        "type": "object",
        "properties": {
          "proyecto": {
            "type": "string",
            "description": "Project ID"
          },
          "nombre": {
            "type": "string",
            "description": "Project ID"
          },
          "nodes": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "description": "Title of the node"
                },
                "id": {
                  "type": "number",
                  "description": "Unique id of the node"
                },
                "x": {
                  "type": "number",
                  "description": "X coord in canvas"
                },
                "y": {
                  "type": "number",
                  "description": "Y coord in canvas"
                },
                "configurado": {
                  "type": "object",
                  "properties": {
                    "location": {
                      "type": "string",
                      "description": "Program root path"
                    },
                    "argumento": {
                      "type": "string",
                      "description": "Program arguments"
                    },
                    "files": {
                      "type": "array",
                      "description": "Program arguments",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Id of the file"
                          },
                          "entrada": {
                            "type": "string",
                            "description": "true or"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "edges": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "source": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "number",
                      "description": "Unique id of the node"
                    }
                  }
                },
                "target": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "number",
                      "description": "Unique id of the node"
                    }
                  }
                }
              }
            }
          },
          "imagen": {
            "type": "string",
            "description": "Position in pagination."
          },
          "tipo": {
            "type": "integer",
            "format": "int32",
            "description": "Number of items to retrieve (100 max)."
          }
        }
      };

      /*eslint-enable*/
      api.get('/build')
      .query({
        id: "BBBBBBBBBB"
      })
      .set('Content-Type', 'application/json')
      .set({
        'apikey': 'testuser',
        'Accept' : 'application/json'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        // console.dir(res.body);
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
      api.get('/build')
      .query({
  id: 'AAAAAA'
      })
      .set('Content-Type', 'application/json')
      .set({
        'apikey': 'testuser',
        'Accept' : 'application/json'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

  });

});

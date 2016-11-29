'use strict';
var chai = require('chai');

var supertest = require('supertest');
var conn = process.env.conn || "http://localhost:3000";
var api = supertest(conn); // supertest init;

chai.should();

describe('/build', function() {
  describe('get', function() {
    it.skip('should respond with 200 Execution dag', function(done) {
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

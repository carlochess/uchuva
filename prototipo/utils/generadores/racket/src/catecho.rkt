#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "maze.rkt")
(require "lib/generadores.rkt")

(define (submit)
  (letrec (
    [credd (register (string->url "http://localhost:3000/register") "admin" "admin")]
    [apikey (hash-ref credd 'apikey)]
    [rootfolder (hash-ref credd 'rootfolder)]
    [idArchivo (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "main.rkt") 'success)]
    [idArchivo2 (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "maze.rkt") 'success)]
    [newdag (crearDag apikey (string->url "http://localhost:3000/crearDag"))]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
                'imagen  ""
                'workloader  "htcondor"
                'nodes
                (list (hasheq
                      'title  "aaa"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                         (hasheq
                            'location "/bin/echo "
                            'argumento "'Hola mundo'"))
                      (hasheq
                      'title  "aaa"
                      'id  1
                      'x  20
                      'y  20
                      'configurado
                         (hasheq
                            'file  (list (hasheq 'id idArchivo 'filename "main.rkt" 'type "file" 'entrada true))
                            'location "/bin/cat"
                            'argumento "main.rkt" )))
                'edges (list (hasheq
                              'source (hasheq 'id 0)
                              'target (hasheq 'id 1))))]
    )
    (run apikey (string->url "http://localhost:3000/run") dag)
  )
)
(submit)

#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "maze.rkt")
(require "generadores.rkt")

(define (submit)
  (letrec (
    [credd (login (string->url "http://localhost:3000/loginapi") "admin" "admin")]
    [apikey (hash-ref credd 'apikey)]
    [idArchivo (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "main.rkt") 'success)]
    [idArchivo2 (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "maze.rkt") 'success)]
    [idArchivo3 (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "generadores.rkt") 'success)]
    [newdag (crearDag apikey (string->url "http://localhost:3000/crearDag"))]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
                'imagen  ""
                'workloader  "htcondor"
                'nodes (list (hasheq
                      'title  "aaa"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                         (hasheq
                            'file  (list (hasheq 'id idArchivo 'filename "main.rkt" 'type "file" 'entrada #t)
                                         (hasheq 'id idArchivo2 'filename "maze.rkt" 'type "file" 'entrada #t)
                                         (hasheq 'id idArchivo3 'filename "generadores.rkt" 'type "file" 'entrada #t))
                            'location "/usr/bin/racket"
                            'argumento "main.rkt -m"))))]
    )
    (run apikey (string->url "http://localhost:3000/run") dag)
  )
)

(define maze-mode (make-parameter #f))

(define file-to-compile
  (command-line
   #:program "compiler"
   #:once-each
   [("-m" "--maze") "create a maze" (maze-mode #t)]
))

(if (maze-mode)
  (let ([m (build-maze 200 700)])
    (show-maze m))
  (submit)
)

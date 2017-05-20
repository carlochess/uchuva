#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "maze.rkt")
(require "generadores.rkt")

(define url "http://localhost:3000/")

(define (submit)
  (letrec (
    [apikey (enterCredd url "admin" "admin")]
    [archivos (sendFiles apikey url (list "main.rkt" "maze.rkt" "generadores.rkt") "")]
    [newdag (crearDag apikey url)]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
                'imagen  ""
                'workloader  "htcondor"
                'nodes (list (hasheq
                      'title  "Create Maze"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                         (hasheq
                            'file  (list (hasheq 'id (first (hash-ref archivos "main.rkt")) 'filename "main.rkt" 'type "file" 'entrada #t)
                                         (hasheq 'id (first (hash-ref archivos "maze.rkt")) 'filename "maze.rkt" 'type "file" 'entrada #t)
                                         (hasheq 'id (first (hash-ref archivos "generadores.rkt")) 'filename "generadores.rkt" 'type "file" 'entrada #t))
                            'location "/usr/bin/racket"
                            'argumento "main.rkt -m"))))]
    )
    (run apikey url dag)
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

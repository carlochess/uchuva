#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "../lib/generadores.rkt")

(define url "http://localhost:3000/")

(define (submit)
  (letrec (
    [apikey (enterCredd url "admin" "admin")]
    [archivos (sendFiles apikey url (list "catecho.rkt") "")]
    [newdag (crearDag apikey url)]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
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
                            'file  (list (hasheq 'id (first (hash-ref archivos "catecho.rkt")) 'filename "catecho.rkt" 'type "file" 'entrada #t))
                            'location "/bin/cat"
                            'argumento "catecho.rkt" )))
                'edges (list (hasheq
                              'source (hasheq 'id 0)
                              'target (hasheq 'id 1))))]
    )
    (run apikey url dag)
  )
)
(submit)

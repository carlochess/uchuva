#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "../lib/generadores.rkt")

(require racket/runtime-path)
(define-runtime-path HERE ".")

(provide submit-catecho)
(define (submit-catecho url wl)
  (letrec (
    [apikey (enterCredd url "admin" "admin")]
    [archivos (sendFiles apikey url (getAbsPath (list "catecho.rkt") HERE) "")]
    [newdag (crearDag apikey url)]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
                'workloader wl
                'nodes
                (list (hasheq
                      'title  "echo"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                         (hasheq
                            'location "/bin/echo "
                            'argumento "'Hola mundo'"))
                      (hasheq
                      'title  "cat self"
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

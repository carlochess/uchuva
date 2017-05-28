#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "../lib/generadores.rkt")

(require racket/runtime-path)
(define-runtime-path HERE ".")
(provide submit-nodejs)

(define (submit-nodejs url wl)
  (letrec (
    [apikey (enterCredd url "admin" "admin")]
    [archivos (sendFiles apikey url (getAbsPath (list "doodle.js" "query.js" "package.json") HERE) "")]
    [newdag (crearDag apikey url)]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
                'imagen  ""
                'workloader  wl
                'nodes
                (list (hasheq
                      'title  "Node Deps"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id (first (hash-ref archivos "package.json")) 'filename "package.json" 'type "file" 'entrada true)
                                       (hasheq 'filename "node_modules" 'type "folder" 'entrada false))
                          'useDocker #t
                          'image "node"
                            'location "npm "
                            'argumento "install"))
                      (hasheq
                      'title  "download image"
                      'id  1
                      'x  20
                      'y  20
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id (first (hash-ref archivos "doodle.js")) 'filename "doodle.js" 'type "file" 'entrada true)
                                       (hasheq 'filename "node_modules" 'type "folder" 'entrada true)
                                       (hasheq 'filename "doodle.jpg" 'type "file" 'entrada false))
                          'location "node "
                          'useDocker #t
                          'image "node"
                            'argumento "doodle.js" )))
                'edges (list (hasheq
                              'source (hasheq 'id 0)
                              'target (hasheq 'id 1))))]
    )
    (run apikey url dag)
  )
)

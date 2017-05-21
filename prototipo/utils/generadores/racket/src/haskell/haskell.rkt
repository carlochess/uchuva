#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "../lib/generadores.rkt")

(provide submit-haskell)

(define (submit-haskell url wl)
  (letrec (
    [apikey (enterCredd url "admin" "admin")]
    [archivos (sendFiles apikey url (list "Tokens.x" "Grammar.y" "Main.hs") "")]
    [newdag (crearDag apikey url)]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
                'imagen  ""
                'workloader  wl
                'nodes
                (list (hasheq
                      'title  "Alex"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id (first (hash-ref archivos "Tokens.x")) 'filename "Tokens.x" 'type "file" 'entrada true)
                                       (hasheq 'filename "Tokens.hs" 'type "file" 'entrada false))
                          'useDocker #t
                          'image "haskell"
                            'location "alex "
                            'argumento "Tokens.x"))
                      (hasheq
                      'title  "Happy"
                      'id  1
                      'x  20
                      'y  20
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id (first (hash-ref archivos "Grammar.y")) 'filename "Grammar.y" 'type "file" 'entrada true)
                                       (hasheq 'filename "Grammar.hs" 'type "file" 'entrada false))
                          'location "happy "
                          'useDocker #t
                          'image "haskell"
                            'argumento "Grammar.y" ))
                       (hasheq
                      'title  "Final"
                      'id  2
                      'x  20
                      'y  20
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id (first (hash-ref archivos "Main.hs")) 'filename "Main.hs" 'type "file" 'entrada true)
                                       (hasheq 'filename "Tokens.hs" 'type "file" 'entrada true)
                                       (hasheq 'filename "Grammar.hs" 'type "file" 'entrada true))
                          'location "ghc"
                          'useDocker #t
                          'image "haskell"
                            'argumento "--make Main" )))
                'edges (list (hasheq
                              'source (hasheq 'id 0)
                              'target (hasheq 'id 2))
                             (hasheq
                              'source (hasheq 'id 1)
                              'target (hasheq 'id 2))))]
    )
    (run apikey url dag)
  )
)

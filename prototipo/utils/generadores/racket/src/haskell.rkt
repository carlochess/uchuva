#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "maze.rkt")
(require "lib/generadores.rkt")

(define (submit)
  (letrec (
    [credd (register (string->url "http://localhost:3000/register") "carlos1629" "losa")]
    [apikey (hash-ref credd 'apikey)]
    [rootfolder (hash-ref credd 'rootfolder)]
    [idArchivo (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "Tokens.x") 'success)]
    [idArchivo2 (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "Grammar.y") 'success)]
    [idArchivo3 (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "Main.hs") 'success)]
    [newdag (crearDag apikey (string->url "http://localhost:3000/crearDag"))]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
                'imagen  ""
                'workloader  "htcondor"
                'nodes
                (list (hasheq
                      'title  "Alex"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id idArchivo 'filename "Tokens.x" 'type "file" 'entrada "true")
                                       (hasheq 'filename "Tokens.hs" 'type "file" 'entrada "false"))
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
                          'file  (list (hasheq 'id idArchivo2 'filename "Grammar.y" 'type "file" 'entrada "true")
                                       (hasheq 'filename "Grammar.hs" 'type "file" 'entrada "false"))
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
                          'file  (list (hasheq 'id idArchivo3 'filename "Main.hs" 'type "file" 'entrada "true")
                                       (hasheq 'filename "Token.hs" 'type "file" 'entrada "true")
                                       (hasheq 'filename "Grammar.hs" 'type "file" 'entrada "true"))
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
    (run apikey (string->url "http://localhost:3000/run") dag)
  )
)
(submit)

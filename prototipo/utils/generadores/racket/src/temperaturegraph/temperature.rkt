#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "../lib/generadores.rkt")

(require racket/runtime-path)
(define-runtime-path HERE ".")
(define-runtime-path MAPS "./Maps")

(provide submit-temperature)
(define (submit-temperature url wl)
  (letrec (
    [apikey (enterCredd url "admin" "admin")]
    [archivos (sendFiles apikey url (getAbsPath (list "boolmatrix.c" "rlxmmthd.c" "gnuplot_1.0.sh") HERE) "")]
    [folder (createFolders apikey url (list "Maps" "OutputData") "")]
    [carpetaMaps (first (hash-ref folder "Maps")) ]
    [carpetaOutputData (first (hash-ref folder "OutputData")) ]
    [archivosMaps
       (sendFiles apikey url
            (getAbsPath (list "Contour_VALLE_960_Border_1.dat"
                  "Contour_VALLE_960_Border_2.dat"
                  "Contour_VALLE_960_Border_3.dat"
                  "estaciones.dat"
                  ) MAPS)
            carpetaMaps
    )]
    [newdag (crearDag apikey url)]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
                'imagen  ""
                'workloader  wl
                'nodes
                (list (hasheq
                      'title  "Compile Bool Matrix"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id (first (hash-ref archivos "boolmatrix.c")) 'filename "boolmatrix.c" 'type "file" 'entrada true)
                                       (hasheq 'filename "boolmatrix" 'type "file" 'entrada false))
                          'useDocker #t
                          'image "gcc"
                            'location "gcc "
                            'argumento "-lm boolmatrix.c -o boolmatrix"))
                      (hasheq
                      'title  "Compile rlxmmthd"
                      'id  1
                      'x  20
                      'y  20
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id (first (hash-ref archivos "rlxmmthd.c")) 'filename "rlxmmthd.c" 'type "file" 'entrada true)
                                       (hasheq 'filename "rlxm" 'type "file" 'entrada false))
                          'location "gcc "
                          'useDocker #t
                          'image "gcc"
                          'argumento "-lm rlxmmthd.c -o rlxm -lm" ))

                      (hasheq
                      'title  "Execute boomatrix"
                      'id  2
                      'x  20
                      'y  20
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id carpetaMaps 'filename "Maps" 'type "dir" 'entrada true)
                                       (hasheq 'filename "boolmatrix" 'type "file" 'entrada true)
                                       (hasheq 'filename "boolmatrix.dat" 'type "file" 'entrada false))
                          'location "./boolmatrix "
                          'useDocker #f
                          'image "gcc"
                          'argumento "" ))

                      (hasheq
                      'title  "Execute rlxmmthd"
                      'id  3
                      'x  20
                      'y  20
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id carpetaMaps 'filename "Maps" 'type "dir" 'entrada true)
                                       (hasheq 'id carpetaOutputData 'filename "OutputData" 'type "dir" 'entrada true)
                                       (hasheq 'filename "boolmatrix.dat" 'type "file" 'entrada true)
                                       (hasheq 'filename "rlxm" 'type "file" 'entrada true)
                                       (hasheq 'filename "OutputData/RlxMthd_v1.0_2000.dat" 'type "file" 'entrada false))
                          'location "./rlxm "
                          'useDocker #f
                          'image "gcc"
                          'argumento "" ))

                      (hasheq
                      'title  "Generate Map"
                      'id  4
                      'x  20
                      'y  20
                      'configurado
                         (hasheq
                          'file  (list (hasheq 'id (first (hash-ref archivos "gnuplot_1.0.sh")) 'filename "gnuplot_1.0.sh" 'type "file" 'entrada true)
                                       (hasheq 'filename "RlxMthd_v1.0_2000.dat" 'type "file" 'entrada #t)
                                       (hasheq 'filename "Rlxm.png" 'type "file" 'entrada false))
                          'location "sh"
                          'useDocker #t
                          'image "pavlov99/gnuplot"
                          'argumento
                          "gnuplot_1.0.sh" )))
                'edges (list (hasheq
                              'source (hasheq 'id 0)
                              'target (hasheq 'id 2))
                             (hasheq
                              'source (hasheq 'id 1)
                              'target (hasheq 'id 3))
                             (hasheq
                              'source (hasheq 'id 2)
                              'target (hasheq 'id 3))
                             (hasheq
                              'source (hasheq 'id 3)
                              'target (hasheq 'id 4))))]
    )
    (run apikey url dag)
  )
)

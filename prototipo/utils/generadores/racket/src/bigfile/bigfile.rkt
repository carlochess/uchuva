#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "../lib/generadores.rkt")

(define workloadervar "$(CLUSTERID)")

(provide submit-bigfile)
(define (submit-bigfile url wl)
  (letrec (
    [apikey (enterCredd url "admin" "admin")]
    [archivos (sendFiles apikey url (list "bigfile.rkt" "main.js") "")]
    [newdag (crearDag apikey url)]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
                'workloader  wl
                'nodes
                (list (hasheq
                      'title  "splitter"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                      (hasheq
                            'file  (list
                               (hasheq 'id (first (hash-ref archivos "bigfile.rkt")) 'filename "bigfile.rkt" 'type "file" 'entrada #t)
                               ;; Colocar aquí las 25 partes: libroa[a-z]
                             )
                            'location "/usr/bin/split"
                            'argumento " -n 25 libro libro"))
                      (hasheq
                      'title  "counter"
                      'id  1
                      'x  20
                      'y  0
                      'times 1
                      'configurado
                      (hasheq
                       'file  (list
                               (hasheq 'id (first (hash-ref archivos "bigfile.rkt")) 'filename "bigfile.rkt" 'type "file" 'entrada #t)
                               ;; Colocar aquí las 25 partes: libroa[a-z]
                               )
                       'location "cat"
                       'argumento (string-append " libroa$(printf \"\\x$(printf %x $(("
                                                 workloadervar
                                                 +97")))\") | tr ' ' '\n' | sort | uniq -c | awk '{print $2\" \"$1}'")))
                      (hasheq
                      'title  "count bytes for part"
                      'id  2
                      'x  40
                      'y  0
                      'times 25
                      'configurado
                         (hasheq
                            ;;; Colocar aquí las 25 partes: libroa[a-z]
                            'location "start"
                            'argumento "npm" ))
                       (hasheq
                      'title  "diff"
                      'id  3
                      'x  60
                      'y  0
                      'configurado
                         (hasheq
                            'location "diff "
                            'argumento "book.txt file.txt")))
                'edges (list (hasheq
                              'source (hasheq 'id 0)
                              'target (hasheq 'id 1))
                             (hasheq
                              'source (hasheq 'id 0)
                              'target (hasheq 'id 2))
                             (hasheq
                              'source (hasheq 'id 2)
                              'target (hasheq 'id 3))))]
    )
    (run apikey url dag)
  )
)

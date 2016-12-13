#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "maze.rkt")

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (register url username password)
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8 (alist->form-urlencoded
                     (list (cons 'username username)
                           (cons 'password password)))) h))
                  read-json
                  (list "Accept: application/json" "Content-Type: application/x-www-form-urlencoded")))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define separator "-------------------------RacketFormBoundaryf1nfLeDGcfc30oHf")
(define CRLF "\r\n")
(define (listToMP l)
  (string-join
   (list
    (string-append "--" separator)
    (string-append "Content-Disposition: form-data; " "name=\"file\"; " "filename=\"" l "\"")
    "Content-Type: application/octet-stream"
    ""
    (readfile l)
    (string-append "--" separator "--")
    "")
   CRLF))
(define readfile
  (lambda (name)
    (port->string (open-input-file name))))
(define (crearArchivo apikey url file)
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8 (listToMP file)) h))
                  read-json
                  (list (string-append "apikey:" apikey) (string-append "Content-Type: multipart/form-data" "; boundary=" separator) "Accept: application/json")))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (crearDag apikey url)
  (call/input-url url
                  get-pure-port
                  read-json
                  (list (string-append "apikey:" apikey) "Accept: application/json")))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (run apikey url dag)
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8  (jsexpr->string dag)) h))
                  read-json
                  (list (string-append "apikey:" apikey) "Accept: application/json" "Content-Type: application/json")))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (dataNodeDag apikey url dag)
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8  (jsexpr->string dag)) h))
                  read-json
                  (list (string-append "apikey:" apikey) "Accept: application/json" "Content-Type: application/json")))

; http://docs.racket-lang.org/rackunit/quick-start.html


(define (submit)
  (letrec (
    [credd (register (string->url "http://localhost:3000/register") "carlos16" "losa")]
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
                'nodes (list (hasheq
                      'title  "aaa"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                         (hasheq
                            'file  (list (hasheq 'id idArchivo 'filename "main.rkt" 'type "file" 'entrada "true")
                                        (hasheq 'id idArchivo2 'filename "maze.rkt" 'type "file" 'entrada "true"))
                            'location "/usr/bin/racket"
                            'argumento "main.rkt -m"))))]
    )
    (run apikey (string->url "http://localhost:3000/run") dag)
  )
)
;(define credd (register (string->url "http://localhost:3000/register") "carlos" "losa"))

;(define credd #hasheq((username . "carlos") (apikey . "carlos") (rootfolder . "584ca975bac56b5b2f0a9420")))
;(define apikey (hash-ref credd 'apikey))
;(define rootfolder (hash-ref credd 'rootfolder))
;(define idArchivo (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "main.rkt") 'success))
;(define idArchivo (hash-ref #hasheq((success . "584cc883bac56b5b2f0a9421")) 'success))
;(define newdag (crearDag apikey (string->url "http://localhost:3000/crearDag")))
;(define idDag (hash-ref newdag 'id))
;(define nombreDag (hash-ref newdag 'nombre))

;(define idDag (hash-ref #hasheq((id . "584cc9f6bac56b5b2f0a9422") (nombre . "Thor Girl")) 'id))
;(define nombreDag (hash-ref #hasheq((id . "584cc9f6bac56b5b2f0a9422") (nombre . "Thor Girl")) 'nombre))

;(define dag (hasheq 'proyecto idDag
;          'imagen  ""
;          'workloader  "htcondor"
;          'nodes (list (hasheq
;                'title  "aaa"
;                'id  0
;                'x  0
;                'y  0
;                'configurado
;                   (hasheq
;                      'file  (list (hasheq 'id idArchivo 'type "file" 'entrada "true"))
;                      'location "racket"
;                      'argumento "main.rkt")))))
;(run apikey (string->url "http://localhost:3000/run") dag)

;(define dag #hasheq((idEjecucion . "vcwl8") (tipo . "") (nodo . (#hasheq((title . "aaa") (id . 0))) )))
;(dataNodeDag apikey (string->url "http://localhost:3000/dataNodeDag") dag)

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

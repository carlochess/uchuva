#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)

(provide register listToMP crearDag run dataNodeDag crearArchivo crearCarpeta login)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (register url username password)
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8 (alist->form-urlencoded
                     (list (cons 'username username)
                           (cons 'password password)))) h))
                  read-json
                  (list "Accept: application/json" "Content-Type: application/x-www-form-urlencoded")))

(define (login url username password)
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
(define (crearCarpeta apikey url newPath)
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8  (jsexpr->string newPath)) h))
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

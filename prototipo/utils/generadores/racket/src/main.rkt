#lang racket
; http://docs.racket-lang.org/rackunit/quick-start.html
(require net/http-client)
(require json)
(require net/uri-codec)

;(define hc (http-conn-open "localhost" #:port 3000))
;
;(call-with-values
; (lambda () (http-conn-sendrecv!
;  hc "/crearDag"; "/user" ; ?(alist->form-urlencoded ex)
;  #:method "GET"
;  #:headers (list "apikey: PhHAiktzuEmUQa09qN2e" "Accept: application/json")))
; (lambda (status-code headers res)
;   (read-json res)))
;;;
;(http-conn-close! hc)
;;;
(require racket/runtime-path)
(define separator "-------------------------RacketFormBoundaryf1nfLeDGcfc30oHf")
(define CRLF "\r\n")

(define (listToMP l)
  (string-join
   (list
    (string-append "--" separator)
    (string-append "Content-Disposition: form-data; " "name=\"file\"; " "filename=\"README.md\"")
    "Content-Type: application/octet-stream"
    ""
    (readfile "main.rkt")
    (string-append "--" separator "--")
    "")
   CRLF))

(define readfile
  (lambda (name)
    (port->string (open-input-file name))))

(define hc (http-conn-open "localhost" #:port 3000))

(call-with-values
 (lambda () (http-conn-sendrecv!
   hc "/crearArchivo"
   #:method "POST"
   #:data
   (listToMP (list "file" "README.md" "application/octet-stream"))
   #:headers
   (list (string-append "Content-Type: multipart/form-data" "; boundary=" separator) "apikey: PhHAiktzuEmUQa09qN2e" "Accept: application/json")))
 (lambda (status-code headers res)
   (read-json res)))
;;
(http-conn-close! hc)


; (display (listToMP (list "file" "README.md" "text/x-markdown")))



;(define dag #hasheq((proyecto . "vcwl8") (imagen . "") (nodes . (#hasheq((title . "aaa") (id . 0) (x . 0) (y . 0))) )))
;
;(define hc (http-conn-open "localhost" #:port 3000))
;
;(call-with-values
; (lambda () (http-conn-sendrecv!
;   hc "/save"
;   #:method "POST"
;   #:data
;   (jsexpr->string dag)
;   #:headers (list "Content-Type: application/json" "apikey: PhHAiktzuEmUQa09qN2e" "Accept: application/json")))
; (lambda (status-code headers res)
;   (read-json res)))
;;;
;(http-conn-close! hc)

#lang racket
; http://docs.racket-lang.org/rackunit/quick-start.html
(require net/http-client)
(require json)
(require net/uri-codec)

;;; Register
;(define hc (http-conn-open "localhost" #:port 3000))
;
;(call-with-values
; (lambda () (http-conn-sendrecv!
;   hc "/login"
;   #:method "POST"
;   #:data
;   (alist->form-urlencoded
;    (list (cons 'username "self")
;          (cons 'password "self")))
;   #:headers (list "Content-Type: application/x-www-form-urlencoded")))
; (lambda (status-code headers res)
;   (read-json res)))
;;;
;(http-conn-close! hc)

;;; crearArchivo
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

;;; CrearDag
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


;;; Run
;(define dag #hasheq((proyecto . "vcwl8") (imagen . "") (nodes . (#hasheq((title . "aaa") (id . 0) (x . 0) (y . 0))) (configurado . (#hasheq(( files . (list #hasheq((id . "FILE") (imagen . "entrada"))) (location . "racket") (argumento . "main.rkt"))) ))))
;
;(define hc (http-conn-open "localhost" #:port 3000))
;
;(call-with-values
; (lambda () (http-conn-sendrecv!
;   hc "/run"
;   #:method "POST"
;   #:data
;   (jsexpr->string dag)
;   #:headers (list "Content-Type: application/json" "apikey: PhHAiktzuEmUQa09qN2e" "Accept: application/json")))
; (lambda (status-code headers res)
;   (read-json res)))
;;;
;(http-conn-close! hc)

;;; dataNodeDag
;(define dag #hasheq((idEjecucion . "vcwl8") (tipo . "") (nodo . (#hasheq((title . "aaa") (id . 0))) )))
;
;(define hc (http-conn-open "localhost" #:port 3000))
;
;(call-with-values
; (lambda () (http-conn-sendrecv!
;   hc "/dataNodeDag"
;   #:method "POST"
;   #:data
;   (jsexpr->string dag)
;   #:headers (list "Content-Type: application/json" "apikey: PhHAiktzuEmUQa09qN2e" "Accept: application/json")))
; (lambda (status-code headers res)
;   (read-json res)))
;;;
;(http-conn-close! hc)

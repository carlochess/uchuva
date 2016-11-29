#lang racket

(require json)
(require net/url)
(require net/url-connect)
(require openssl)
(require (for-syntax syntax/parse))
(require (for-syntax racket/syntax))
(require (for-syntax racket))

;; Define a interleave function for the create-api-func macro
;; It combines two lists by alternating them
(begin-for-syntax
  (define (interleave list1 list2)
    (match (list list1 list2)
      [(list (cons x xs) (cons y ys)) (cons x (cons y (interleave xs ys)))]
      [(list '() ys)                  ys]
      [(list xs '())                  xs])))

(define (get-slack-json apimethod params)
  (let* ([url (url "https"
                   #f
                   "slack.com"
                   #f
                   #t
                   (list (path/param "api" '()) (path/param apimethod '()))
                   params
                   #f)])
    (call/input-url url
                    get-pure-port
                    (compose string->jsexpr port->string))))

;(define (getApi endpoint query key)
;  (call-with-values
;   (lambda ()
;     (http-conn-sendrecv!
;      hc
;      (string-apend endpoint "?" (alist->form-urlencoded ex))
;      #:method "GET"
;      #:headers (list (string-apend "apikey: " query) "Accept: application/json")))
;   (lambda (status-code headers res)
;     (read-json res)
;   )
;  )
;)
;; This macro generates a function which will recieve each of the macros arguments
;; It receives them into a list of pairs of the symbol and the value
;; That format is required for the net/url url struct
;; Lastly, it filters out any pairs whose value is not a string or false
(define-syntax (create-params stx)
  (syntax-parse stx
    [(_ params:id ...)
     #'(lambda (params ...)
         (filter (lambda (x) (or (false? (cdr x)) (string? (cdr x))))
                 (list (cons (quote params) params) ...)))]))

;; This macro generates functions to interact with the slack web API
;; It takes a string for the api method name, and two lists - one for
;; required arguments and one for optional arguments
;; The generated function returns the json if the web API call is successful
(define-syntax (create-api-func stx)
 (syntax-parse stx
   [(_ apimethod:str (req:id ...) (opt:id ...))
    (with-syntax* ([(keys ...)   (map (compose string->keyword symbol->string)
                                     (syntax->datum #'(opt ...)))]
                   [(pairs ...)  (map (lambda (x) (list x ''())) (syntax->datum #'(opt ...)))]
                   [(weaved ...) (datum->syntax stx (interleave (syntax->datum #'(keys ...))
                                                                (syntax->datum #'(pairs ...))))])
      #'(lambda (req ... weaved ...)
          (let* ([paramfunc (create-params req ... opt ...)]
                 [params    (paramfunc req ... opt ...)])
            (get-slack-json apimethod params))))]
 )
)

;; GET
(define user (create-api-func "user" (apikey) ()))
(define crearDag (create-api-func "crearDag" (apikey) ()))
(define eliminarDag (create-api-func "eliminarDag" (apikey id) ()))
(define builds (create-api-func "builds" (apikey id) ()))
(define build (create-api-func "build" (apikey id) ()))

;; GET -> File
;(define descargarArchivo (create-api-func "descargarArchivo" (apikey path) ()))

;;; POST
;(define run (create-api-func-post "run" (apikey body) ()))
;(define save (create-api-func-post "save" (apikey body) ()))
;(define dataNodeDag (create-api-func-post "dataNodeDag" (apikey body) ()))
;(define listar (create-api-func-post "listar" (apikey body) ()))
;(define eliminarArchivo (create-api-func-post "eliminarArchivo" (apikey item) ()))
;(define contenidoArchivo (create-api-func-post "contenidoArchivo" (apikey item) ()))
;(define crearCarpeta (create-api-func-post "crearCarpeta" (apikey newPath) ()))

;; POST (for..)
;(define crearArchivo (create-api-func-post-file "crearArchivo" (apikey dag) ()))





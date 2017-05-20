#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)

(provide createFolders register listToMP crearDag run dataNodeDag crearArchivo crearCarpeta login enterCredd sendFiles buscarArchivo)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (register urlEndPoint username password)
  (let ([url (string->url (string-append urlEndPoint "register"))])
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8 (alist->form-urlencoded
                     (list (cons 'username username)
                           (cons 'password password)))) h))
                  read-json
                  (list "Accept: application/json" "Content-Type: application/x-www-form-urlencoded"))))

(define (login urlEndPoint username password)
  (let ([url (string->url (string-append urlEndPoint "loginapi"))])
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8 (alist->form-urlencoded
                     (list (cons 'username username)
                           (cons 'password password)))) h))
                  read-json
                  (list "Accept: application/json" "Content-Type: application/x-www-form-urlencoded"))))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define separator "-------------------------RacketFormBoundaryf1nfLeDGcfc30oHf")
(define CRLF "\r\n")
(define (listToMP l folder)
  (let ((cwd (if (= (string-length folder) 0)
                 ""
                 (string-join (list
                               (string-append "--" separator)
                               "Content-Disposition: form-data; name=\"cwd\""
                               folder) CRLF))))
  (string-join
   (list
    cwd
    (string-append "--" separator)
    "Content-Disposition: form-data; name=\"cwd\""
    folder
    (string-append "--" separator)
    (string-append "Content-Disposition: form-data; " "name=\"file\"; " "filename=\"" l "\"")
    "Content-Type: application/octet-stream"
    ""
    (readfile l)
    (string-append "--" separator "--")
    "")
   CRLF)))
(define readfile
  (lambda (name)
    (port->string (open-input-file name))))

(define (crearArchivo apikey urlEndPoint file folder)
  (let ([url (string->url (string-append urlEndPoint "crearArchivo"))])
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8 (listToMP file folder)) h))
                  read-json
                  (list (string-append "apikey:" apikey) (string-append "Content-Type: multipart/form-data" "; boundary=" separator) "Accept: application/json"))))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (crearDag apikey urlEndPoint)
  (let ([url (string->url (string-append urlEndPoint "crearDag"))])
  (call/input-url url
                  get-pure-port
                  read-json
                  (list (string-append "apikey:" apikey) "Accept: application/json"))))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (run apikey urlEndPoint dag)
  (let ([url (string->url (string-append urlEndPoint "run"))])
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8  (jsexpr->string dag)) h))
                  read-json
                  (list (string-append "apikey:" apikey) "Accept: application/json" "Content-Type: application/json"))))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (crearCarpeta apikey urlEndPoint path cwd)
  (let ([url (string->url (string-append urlEndPoint "crearCarpeta"))])
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8 (alist->form-urlencoded
                     (list (cons path path)))) h))
                  read-json
                  (list (string-append "apikey:" apikey) "Accept: application/json" "Content-Type: application/x-www-form-urlencoded"))))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (buscarArchivo apikey urlEndPoint filename)
  (let ([url (string->url (string-append urlEndPoint "buscar"))])
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8 (alist->form-urlencoded
                     (list (cons 'filename filename)))) h))
                  read-json
                  (list (string-append "apikey: " apikey) "Accept: application/json" "Content-Type: application/x-www-form-urlencoded"))))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(define (dataNodeDag apikey urlEndPoint dag)
  (let ([url (string->url (string-append urlEndPoint "dataNodeDag"))])
  (call/input-url url
                  (lambda (url h)
                    (post-pure-port url (string->bytes/utf-8  (jsexpr->string dag)) h))
                  read-json
                  (list (string-append "apikey:" apikey) "Accept: application/json" "Content-Type: application/json"))))

(define (enterCredd url username password)
  (hash-ref
   (login url username password)
   'apikey
   (λ () (hash-ref (register url username password) 'apikey))
  )
)

(define (sendFiles apikey url fileList folder)
  (make-hash
   (map (lambda (fileAbs)
          (let*-values (
              [(x y z) (split-path (string->path fileAbs))]
              [(file)  (path->string y)]
              [(resultados) (hash-ref (buscarArchivo apikey url file) 'files)])
            (if (> (length resultados ) 0)
                (let ((elemento (first resultados)))
                  (list (hash-ref elemento 'name) (hash-ref elemento 'id)))
                (let ((archivo (crearArchivo apikey url fileAbs folder)))
                  (list file (hash-ref archivo 'success)))
                )))
        fileList)
   )
)

(define (createFolders apikey url foldersList destfolder)
  (make-hash
   (map (lambda (folder)
          (let ([resultados (hash-ref (buscarArchivo apikey url folder) 'files)])
            (if (> (length resultados ) 0)
                (let ((elemento (first resultados)))
                  (list (hash-ref elemento 'name) (hash-ref elemento 'id)))
                (let ((carpeta (crearCarpeta apikey url folder destfolder)))
                  (list folder (hash-ref carpeta 'success)))
                )))
        foldersList)
   )
)

; http://docs.racket-lang.org/rackunit/quick-start.html

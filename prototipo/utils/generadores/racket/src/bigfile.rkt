#lang racket
(require net/http-client)
(require json)
(require net/uri-codec)
(require net/url)
(require "maze.rkt")
(require "lib/generadores.rkt")

#|
-> Crear el archivo (aprox 900mb)

ruby -e 'a=STDIN.readlines;10000.times do;b=[];10000.times do; b << a[rand(a.size)].chomp end; puts b.join(" "); end' < /usr/share/dict/words > file.txt

cat file.txt file.txt > book.txt

-> Descargar  el archivo

curl -L -o book.txt https://bd00860d-a-62cb3a1a-s-sites.googlegroups.com/site/the74thhungergamesbyced/download-the-hunger-games-trilogy-e-book-txt-file/%281%29%20The%20Hunger%20Games.txt?attachauth=ANoY7cokMI62vd8oYgotLNSVKjP3JCX66_M1ErcmRoufUO9dDZy4MHy1I1URKEnUus2EWNFUnRH3Eq0vOXcHqRGL3BFECkPMN4WV8b0ZIgLGpHTET0Mq5c0lkXJcvev3i7EmbGAArn8oSBqCsMU0FbHOV5s7FPXBpWmoaNjVm9vnA3SQ-DZ1DYROUic4yC5mS2CkOjMwaD7SBuZvcH-MDpCn4hq2GJ8lo8tH6at0oOsa0FnhEzQNbH2jYkqHprISSF_YlU4hoYnuTyjfcLvMxeVFQszL4u0q0mbtv5LoYjRHx4wgUu6Hqt_VHQiG3oQUf2vlHEmJJHQn&attredirects=0&d=1

-> splitter nPartes libro -> 25 partes

split -n 25 book.txt libro

-> counter $parte -> k:v_$parte

cat libroa$(printf "\x$(printf %x $(($PARTE+97)))") | tr ' ' '\n' | sort | uniq -c | awk '{print $2" "$1}'

-> join

npm install && npm start

-> verficacion

diff book.txt file.txt

|#

(define (submit)
  (letrec (
    [credd (register (string->url "http://localhost:3000/register") "carlos1614" "losa")]
    [apikey (hash-ref credd 'apikey)]
    [rootfolder (hash-ref credd 'rootfolder)]
    [idArchivo (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "book.txt") 'success)]
    [idCarpeta (hash-ref (crearCarpeta apikey (string->url "http://localhost:3000/crearArchivo") (hasheq 'path "" 'cwd "")) 'success)]
    [mainjs (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "main.rkt" ... idCarpeta) 'success)]
    [packagejson (hash-ref (crearArchivo apikey (string->url "http://localhost:3000/crearArchivo") "main.rkt" ... idCarpeta) 'success)]
    [newdag (crearDag apikey (string->url "http://localhost:3000/crearDag"))]
    [idDag (hash-ref newdag 'id)]
    [nombreDag (hash-ref newdag 'nombre)]
    [dag (hasheq 'proyecto idDag
                'workloader  "htcondor"
                'nodes
                (list (hasheq
                      'title  "splitter"
                      'id  0
                      'x  0
                      'y  0
                      'configurado
                         (hasheq
                            'location "split"
                            'argumento " -n 25 book.txt libro"))
                      (hasheq
                      'title  "counter"
                      'id  1
                      'x  20
                      'y  0
                      'times 25
                      'configurado
                         (hasheq
                            'location "cat"
                            'argumento " libroa$(printf "\x$(printf %x $(($PARTE+97)))") | tr ' ' '\n' | sort | uniq -c | awk '{print $2" "$1}'"))
                      (hasheq
                      'title  "join"
                      'id  2
                      'x  40
                      'y  0
                      'configurado
                         (hasheq
                            'file  (list (hasheq 'id idArchivo 'filename "main.rkt" 'type "file" 'entrada true))
                            'location "cd carpeta &&"
                            'argumento "npm install && npm start" ))
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
    (run apikey (string->url "http://localhost:3000/run") dag)
  )
)
(submit)

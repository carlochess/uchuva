#lang racket

(require "./catecho/catecho.rkt"
         "./haskell/haskell.rkt"
         "./nodejs/node.rkt"
         "./temperaturegraph/temperature.rkt"
         "./reflection/main.rkt"
)

(module+ main
  (define url
    (if (string? (getenv "UENDPOINT"))
        (getenv "UENDPOINT")
        "http://localhost:3000/"))
  (define wl (if (string? (getenv "UWL"))
        (getenv "UWL")
        "htcondor"))
  (display "Cat echo")
  (submit-catecho url wl)
  (display "Haskell")
  (submit-haskell url wl)
  (display "Nodejs")
  (submit-nodejs url wl)
  ;(display "Reflection")
  ;(submit-reflection url)
  (display "Temperatura")
  (submit-temperature url wl)
)

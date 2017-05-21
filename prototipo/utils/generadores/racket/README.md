# Racket
Racket client and test for uchuva api

Build the docker image
> docker build -t uchuva/uchuvarestcli .

And then run it

> docker run -it --net=host -e UENDPOINT='http://localhost:3000/' -e UWL='htcondor' uchuva/uchuvarestcli

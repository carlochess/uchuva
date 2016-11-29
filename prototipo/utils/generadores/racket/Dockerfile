FROM jackfirth/racket:6.2-onbuild-test

#ONBUILD ADD ./src/info.rkt ./info.rkt
#ONBUILD RUN raco pkg install --auto --no-setup
#ONBUILD RUN raco setup --no-docs
#ONBUILD ADD ./src .
#ONBUILD RUN raco setup --no-docs

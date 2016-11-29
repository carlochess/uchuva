#!/bin/bash
LANG=${LENG:-ruby}
rm -rf $LANG
cp ~/Documentos/tesis/prototipo/static/swagger/api.json .
docker run -it --rm -v $(pwd):/swagger-api/out \
    jimschubert/swagger-codegen-cli generate \
    -i /swagger-api/out/api.json \
    -l $LANG \
    -o /swagger-api/out/$LANG

sudo chown -R $USER:$USER $LANG/
# ruby -Iruby/lib main.rb
# docker run -it --rm -v $(pwd):/usr/bin/app:rw niaquinto/gradle /bin/bash # clean war

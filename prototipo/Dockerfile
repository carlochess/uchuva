FROM node:6-onbuild

ENV SHARE=/app
ENV NODE_ENV=production
ENV DATABASE_URI=mongodb://mongo/uchuva
ENV CONDOR_URL=http://condor:8080/
#ENV CONDOR_URL=http://172.17.9.8:8080/
RUN chmod 400 keys/id_rsa.pub

EXPOSE 3000

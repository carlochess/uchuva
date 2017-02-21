FROM node:6-onbuild

ENV SHARE=/app
ENV NODE_ENV=production
ENV DATABASE_URI=mongodb://mongo/uchuva
ENV CONDOR_URL=http://condor:8080/
ENV LOGDIR=/app/logs/
RUN chmod 400 keys/id_rsa.pub

ENV HTCONDOR_SSH=true
ENV OPENLAVA_SSH=true
ENV TORQUE_SSH=true
ENV SLURM_SSH=true
ENV USEQUEUE=true

RUN mkdir -p /app/logs

EXPOSE 3000

# maybe use laTesT docker-image-version of cassandra?
FROM jaegertracing/jaeger-cassandra-schema

# replace docker's official enTrypoinT here
COPY docker-entrypoint.sh /docker-entrypoint.sh

# make my modified enTrypoinT execuTable
RUN chmod +x docker-entrypoint.sh

# ENTRYPOINT will be called in parenT-docker-image!
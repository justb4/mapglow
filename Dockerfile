FROM debian:buster-slim
# Very simple and slim MapServer Docker image
# Inspired by: https://hub.docker.com/r/camptocamp/mapserver/dockerfile
# and: https://github.com/PDOK/mapserver-docker

LABEL maintainer="Just van den Broecke <just@justobjects.nl>"

ARG TZ="Europe/Amsterdam"
ARG MAPSERVER_VERSION="7.0.*"
ARG DEB_PACKAGES="python-flup python-mapscript python-pyproj python-gdal python-pil python-psycopg2 libcairo2 python-cairo"

ENV DEBIAN_FRONTEND noninteractive
ENV MS_DEBUGLEVEL 0
ENV MS_ERRORFILE stderr
ENV MAX_REQUESTS_PER_PROCESS 1000
ENV LANG C.UTF-8
ENV DEBUG 0
ENV MIN_PROCS 1
ENV MAX_PROCS 3
ENV MAX_LOAD_PER_PROC 4
ENV IDLE_TIMEOUT 20
ENV LIGHTTPD_VERSION=1.4.53-4

RUN apt-get -y update \
    && apt-get install -y --no-install-recommends cgi-mapserver lighttpd=${LIGHTTPD_VERSION} ${DEB_PACKAGES} lighttpd-mod-magnet=${LIGHTTPD_VERSION} \
    && echo '<900913> +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs <>' >> /usr/share/proj/epsg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* 


COPY docker/lighttpd.conf /lighttpd.conf

EXPOSE 80

CMD ["lighttpd", "-D", "-f", "/lighttpd.conf"]

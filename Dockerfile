FROM pdok/mapserver:latest

LABEL maintainer="Just van den Broecke <justb4@gmail.com>"
 
ARG DEB_PACKAGES="python-flup python-mapscript python-pyproj python-gdal python-pil python-psycopg2"

RUN \
	apt-get update \
	&& apt-get -yy install ${DEB_PACKAGES} \
    && apt-get clean && rm -rf /var/cache/apk/* /tmp/* /var/tmp/* \
    && echo '<900913> +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs <>' >> /usr/share/proj/epsg

# Replace default mapserver CGI with MapGlow MapScript entry
COPY docker/lighttpd.conf /lighttpd.conf

# CMD ["/pgbackup/entrypoint.sh"]

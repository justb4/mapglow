#!/bin/sh
# This file is part of MapGlow.
#
# MapGlow is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with MapGlow.  If not, see <http://www.gnu.org/licenses/>.
#
# @author Just van den Broecke - OpenGeoGroep.nl 2011
#
# shortcut for mapserver with specific mapfile
# allows friendly URLs like http://my.com/ms/map1?service=wms...
# i.s.o. cgi with full mapfile path
#
# Just van den Broecke www.justobjects.nl 2011
#
MAPSERV="/usr/lib/cgi-bin/mapserv"

# Mac OSX MapServer location for Kynchaos version
if [ ! -f $MAPSERV ]
then
  MAPSERV="/Library/WebServer/CGI-Executables/mapserv"
fi

MAPFILE="/var/gworx/webapps/mapglow.org/site/config/mapserver/app1.map"

if [ "${REQUEST_METHOD}" = "GET" ]; then
  if [ -z "${QUERY_STRING}" ]; then
    QUERY_STRING="map=${MAPFILE}"
  else
    QUERY_STRING="map=${MAPFILE}&${QUERY_STRING}"
  fi
  exec ${MAPSERV}
else
  echo "Sorry, I only understand GET requests."
fi
exit 1

#!/usr/bin/env python
#  This file is part of MapGlow.
#
#  MapGlow is free software: you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with MapGlow.  If not, see <http://www.gnu.org/licenses/>.
#
#  @author Just van den Broecke - JustObjects.nl 2020

from mapglow_ms import MapGlowMS
import os
import sys

import mapscript

from flup.server.fcgi import WSGIServer


# def application(environ, start_response):
#     # MapGlowMS('../config/mapserver/app1.map').ows_req()
#     start_response('200 OK', [('Content-Type', 'text/plain;charset=utf-8')])
#     return ['Hello World!\n']

# List of all environment variable used by MapServer
# Inspeired by Tom Kralidis GIST
# https://gist.github.com/tomkralidis/9adbd4864c03647aa7eb4f96a3c33297
MAPSERV_ENV = [
  'CONTENT_LENGTH', 'CONTENT_TYPE', 'CURL_CA_BUNDLE', 'HTTP_COOKIE',
  'HTTP_HOST', 'HTTPS', 'HTTP_X_FORWARDED_HOST', 'HTTP_X_FORWARDED_PORT',
  'HTTP_X_FORWARDED_PROTO', 'MS_DEBUGLEVEL', 'MS_ENCRYPTION_KEY',
  'MS_ERRORFILE', 'MS_MAPFILE', 'MS_MAPFILE_PATTERN', 'MS_MAP_NO_PATH',
  'MS_MAP_PATTERN', 'MS_MODE', 'MS_OPENLAYERS_JS_URL', 'MS_TEMPPATH',
  'MS_XMLMAPFILE_XSLT', 'PROJ_LIB', 'QUERY_STRING', 'REMOTE_ADDR',
  'REQUEST_METHOD', 'SCRIPT_NAME', 'SERVER_NAME', 'SERVER_PORT'
]


def application(env, start_response):
    for key in MAPSERV_ENV:
        if key in env:
            os.environ[key] = env[key]
        else:
            os.unsetenv(key)

    return MapGlowMS(env['MS_MAPFILE']).ows_req(env, start_response)
    #
    # mapfile = mapscript.mapObj(mapfile)
    #
    # request = mapscript.OWSRequest()
    # mapscript.msIO_installStdoutToBuffer()
    # request.loadParamsFromURL(env['QUERY_STRING'])
    #
    # try:
    #     status = mapfile.OWSDispatch(request)
    # except Exception as err:
    #     pass
    #
    # content_type = mapscript.msIO_stripStdoutBufferContentType()
    # result = mapscript.msIO_getStdoutBufferBytes()
    # start_response('200 OK', [('Content-type', content_type)])
    # return [result]

# Main entry: call MapGlow OWS with the mapfile parm
WSGIServer(application).run()

#!/usr/bin/env python
#
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
from mapglow_ms import MapGlowMS

# Main entry: call MapGlow OWS with the mapfile parm
MapGlowMS('../config/mapserver/app1.map').ows_req()

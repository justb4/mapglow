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
import os
import sys
import cairo

import tempfile

from PIL import Image

# Gradient generator based on Cairo lib
class Gradient:
    def __init__(self):
        self.surface =None
        self.fd = None
        self.temp_path = None

    def __del__(self):
        self.clean()

    def create(self, srgba_str):
        WIDTH, HEIGHT = 20, 256

        self.surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, WIDTH, HEIGHT)
        ctx = cairo.Context(self.surface)

        grad = cairo.LinearGradient(0, 0, 0, HEIGHT)   # change to 0,0,WIDTH,0 for horiz strips

        # add_color_stop_rgba (double offset, double red, double green, double blue, double alpha)
        if not srgba_str:
            srgba_str = '0,1,1,0,1,0.75,1,0,0,1,0.9,1,1,0,0'

        srgba_arr = [float(x) for x in srgba_str.split(',')]

        for i in range(0,len(srgba_arr)-1,5):
            grad.add_color_stop_rgba(srgba_arr[i], srgba_arr[i+1], srgba_arr[i+2], srgba_arr[i+3], srgba_arr[i+4])
            # grad.add_color_stop_rgba(0, 1, 1, 0, 1)
            # grad.add_color_stop_rgba(0.75, 1, 0, 0, 1)
            # grad.add_color_stop_rgba(0.9, 1, 1, 0, 0)

        ctx.rectangle(0, 0, WIDTH, HEIGHT)
        ctx.set_source(grad)
        ctx.fill()
        return self

    def as_file(self, path=None):
        if not path:
            (self.fd, self.temp_path) = tempfile.mkstemp()
            path = self.temp_path

        self.surface.write_to_png(path)

        return path

    def as_img(self):
        # return Image.open(self.as_file())
        # Convert Cairo Surface to PIL in-moemory image
        # See http://www.pygame.org/wiki/CairoPygame
        return Image.frombuffer("RGBA",( self.surface.get_width(),self.surface.get_height() ),self.surface.get_data(),"raw","BGRA",0,1)

    def clean(self):
        if self.fd:
            os.close(self.fd)
        if self.temp_path:
            os.remove(self.temp_path)

if __name__ == '__main__':
    Gradient().create(
            sys.argv[1]).as_file(sys.argv[2])

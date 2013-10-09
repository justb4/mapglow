# simple ImageMagick receipe to convert RGB image to RGBA PNG
# See http://www.imagemagick.org/Usage//masking
# example
# convert pgaitch.png  -alpha off -alpha set gradient-jjguy-pgaitch.png
# See http://www.imagemagick.org/Usage//masking/
# See http://www.imagemagick.org/Usage/formats/#png_formats
# convert $1 -alpha off  -alpha set $2
convert $1 -define png:color-type=6 -channel RGBA  -alpha on $2


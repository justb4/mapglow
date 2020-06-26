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
import cStringIO
import os
import sys

import mapscript
from heatmap_seth import main, Point, printtime
from xml import sax
from gradient import Gradient
import osgeo.ogr as ogr
import osgeo.osr as osr

from postgis.PostGIS import PostGIS,Feature

# MapGlow MapScript WMS handler
class MapGlowMS:
    def __init__(self, mapfile_path):
        self.map = mapscript.mapObj(mapfile_path)

        # Determine root application dir: all paths relative from here
        self.root_dir = os.path.dirname(__file__) + '/../'

    # Main entry: handle any WMS/WFS request
    # Only catch heatmap-specific requests. Forward all others to the MapServer dispathcer
    def ows_req(self):
        # http://mapserver.org/ogc/mapscript.html#python-examples
        ows_req = mapscript.OWSRequest()
        ows_req.loadParams()
        req_str = ows_req.getValueByName('REQUEST')
        styles =  ows_req.getValueByName('STYLES')

        do_heatmap = styles and styles.startswith('heat')

         # Filter out "graphic" WMS requests
        if req_str == 'GetMap' and do_heatmap:
            self.wms_getheatmap_req(ows_req)
            return
        elif req_str == 'GetLegendGraphic':
            # GetLegendGraphic may have a optional STYLE parameter
            # if this indicates a heatmap style defer to our own implementation
            # to return heatmap gradient image as style for now.
            style = ows_req.getValueByName('STYLE')
            if style and style.startswith('heat'):
                self.wms_getheatmaplegend_req(ows_req)
                return

        # All other OWS (WFS/WMS-non-graphic) are XML-based
        # and can be dispatched/returned directly
        ows_req.setParameter('STYLES', '')
        mapscript.msIO_installStdoutToBuffer()
        self.map.OWSDispatch(ows_req)

        if req_str == 'GetMap':
            content = mapscript.msIO_getStdoutBufferBytes()
        else:
            content_type = mapscript.msIO_stripStdoutBufferContentType()
            content = mapscript.msIO_getStdoutBufferString()

            if content_type == 'vnd.ogc.se_xml' or content_type == 'application/vnd.ogc.wms_xml' or content_type == 'application/vnd.ogc.gml':
                content_type = 'text/xml'

            print('Content-type: ' + str(content_type))
            print

        print(content)

    def wms_getheatmap_req(self, wms_req):
        # http://mapserver.org/ogc/mapscript.html#python-examples
        # test url
        # http://mapglow.org/wms/?service=WMS&request=GetMap&bbox=4.95,52,5.6,52.3&version=1.1.0&layers=tracepoints&srs=EPSG:4326&format=image/png&width=400&height=400
    #    print("Content-type: text/plain\n\n")

        bbox = wms_req.getValueByName('BBOX')
        layer = wms_req.getValueByName('LAYERS')
        srs = wms_req.getValueByName('SRS')
        width = float(wms_req.getValueByName('WIDTH'))
        height = float(wms_req.getValueByName('HEIGHT'))

        # CREATE WKT STRING OF POINT COORDS
        bbox_arr = bbox.split(",")
        wktLL = 'POINT(%s %s)' % (bbox_arr[0], bbox_arr[1])
        wktUR = 'POINT(%s %s)' % (bbox_arr[2], bbox_arr[3])

        # CREATE PROJECTION OBJECTS
        google = osr.SpatialReference ()
        google.ImportFromEPSG(3857)
        wgs84 = osr.SpatialReference()
        wgs84.ImportFromEPSG(4326)

        # CREATE OGR POINT OBJECT, ASSIGN PROJECTION, REPROJECT
        pointLL = ogr.CreateGeometryFromWkt(wktLL)
        pointLL.AssignSpatialReference(google)
        pointLL.TransformTo(wgs84)
        pointUR = ogr.CreateGeometryFromWkt(wktUR)
        pointUR.AssignSpatialReference(google)
        pointUR.TransformTo(wgs84)

        bbox='%f,%f,%f,%f' % (pointLL.GetX(),pointLL.GetY(),pointUR.GetX(),pointUR.GetY())
        bboxLL='%f,%f,%f,%f' % (pointLL.GetY(),pointLL.GetX(),pointUR.GetY(),pointUR.GetX())

        # Do not use internal WFS (too slow)
        # points = self.get_layer_points_wfs(layer, bbox, max_features)

        # Get points from the layer (direct layer query)

        layerObj = self.map.getLayerByName(layer)
        points = []
        if layerObj:
            # see if layer has configured feature density
            # this determines max number of features for Layer query
            feature_density = float(layerObj.metadata.get('mapglow_feat_density', '0.002'))

            # calculate max features for Layer query
            max_features = int(round(feature_density * width * height))

            # get array of Point objects from Layer
            printtime("START - get points from layer max_features=" + str(max_features))
            points = self.get_layer_points(layerObj, bbox, max_features)
            printtime('Got ' + str(len(points)) + ' points from layer')

        # No points: generate transparent overlay image using standard MS dispatch
        if len(points) <= 0:
            mapscript.msIO_installStdoutToBuffer()

            # MS does not like the heatmap-style STYLES
            wms_req.setParameter('STYLES', '')

            self.map.OWSDispatch(wms_req)
            print(mapscript.msIO_getStdoutBufferBytes())
            return

        # Get heatmap algoritm+parms
        # Now 1 type in STYLES, e.g. 'heat/seth/red-yellow-green/12/0.5'
        # TODO: parameters are heatmap-type specific
        (heat, heatmap_type, gradient, radius, decay) = wms_req.getValueByName('STYLES').split('/')

        # Just to protect ourselves from blowing up
        if int(radius) > 20:
            radius = '20'

        # check how gradient is specified: either a gradient file or a range of doubles (stop, R, G, B, A)
        gradient_path = self.root_dir+ 'config/gradients/gradient-' + gradient +'.png'
        if os.path.exists(gradient_path):
            # Gradient as file
            gradient_option_name = '--gradient'
            gradient_option_value = gradient_path
        else:
            # Gradient as range of doubles (stop, R, G, B, A), (stop, R, G, B, A),...
            # each of value double between 0..1
            # e.g. 0,1,1,0,1, 0.75,1,0,0,1, 0.9,1,1,0
            gradient_option_name = '--gradient_color_srgba'
            gradient_option_value = gradient

        # Assemble arguments
        args = ["--web",
                "--points_arr",
                "--radius", radius,
                "--decay", decay,
                "--width", wms_req.getValueByName('WIDTH'),
                "--height", wms_req.getValueByName('HEIGHT'),
                gradient_option_name, gradient_option_value,
                "--extent", bboxLL]

        # Creates and sends the heatmap
        main(args, points)

    # Handle GetLegendGraphic WMS service for STYLE as heatmap
    def wms_getheatmaplegend_req(self, req):
        # This should do something with the gradient file
        # print("Content-type: text/plain\n\n")
        # Send the Content-Type header to let the client know what you're sending
        try:
            # FIXME: somehow the STYLE string is truncated by OpenLayers/GeoExt for explicit gradient parms
            (heat, heatmap_type, gradient, radius, decay) = req.getValueByName('STYLE').split('/')
            # Check how gradient is specified (spec or predef) and act on that
            f = None
            if gradient.find(',') > 0:
                # Explicit gradient parameters: create image from parms
                f = cStringIO.StringIO()
                Gradient().create(gradient).as_img().save(f, "PNG")
            else:
                # Predefined gradient: get image from file
                f = open(self.root_dir+ 'config/gradients/gradient-' + gradient + '.png', 'rb')

            # Send gradient image
            if f:
                sys.stdout.write('Content-Type: image/png\r\n\r\n')
                f.seek(0)
                sys.stdout.write(f.read())

        except Exception as inst:
            print("Content-type: text/plain\n\n")
            print("Exception while generating legend")
            print(type(inst))     # the exception instance
            print(inst.args)      # arguments stored in .args
            print(inst)
            # For now anything can go wrong
            return

   # Get points from layer using query on MS layer object
    def get_layer_points(self, layer, bbox_str, max_features):
        if layer.connectiontype == mapscript.MS_POSTGIS:
            # Do direct PostGIS access: 1) is much faster and 2) mapscript problems with !BOX! in complex query
           return self.get_layer_points_postgis(layer, bbox_str, max_features)
        else:
           return self.get_layer_points_layer(layer, bbox_str, max_features)

    # Get points from layer using query on MS layer object
    def get_layer_points_layer(self, layer, bbox_str, max_features):
        # print("Content-type: text/plain\n\n")

        points = []

        status = layer.open()
        bbox_arr = [float(x) for x in bbox_str.split(',')]
        rect = mapscript.rectObj(bbox_arr[0], bbox_arr[1], bbox_arr[2], bbox_arr[3])
        if layer.queryByRect(self.map, rect) == mapscript.MS_FAILURE:
            # print('queryByRect failed')
            return points

        # Query success and points found: create Points array from result
        results = layer.getResults()
        n_res = layer.getNumResults()

        # Return at most max_features by skipping points in the array
        skip_count = (n_res / max_features) + 1

        # print('QUERY OK: results=' + str(n_res) + ' skip_count=' + str(skip_count))
        for j in range(n_res):
            # Skip when remainder not 0
            if j % skip_count:
                # print('skip j=' + str(j))
                continue

            # print('do j=' + str(j))
            res = results.getResult(j)
            # print('res=' + str(res))

            # later version may use  resultsGetShape() ??
            # see: http://www.mail-archive.com/mapserver-users@lists.osgeo.org/msg11286.html
            # shp = mapscript.shapeObj(mapscript.MS_SHAPE_NULL)
            # shp = layer.resultsGetShape(shp, res.shapeindex)
            shp = layer.getFeature(res.shapeindex, res.tileindex)

            shp_point = shp.get(0).get(0)
            point = Point((shp_point.y, shp_point.x))
            points.append(point)

        layer.close()
        return points

   # Get points from layer using direct PostGIS query ((
    def get_layer_points_postgis(self, layer, bbox_str, max_features):
        # print("Content-type: text/plain\n\n")

        points = []

        name ='mapglow'
        dsn = layer.connection # e.g. "host=localhost dbname='dbname' user='theuser' password='thepwd'"
        table = layer.getMetaData('mapglow_table_name')
        fid = layer.getMetaData('gml_featureid') #defaults to ogc_fid
        geometry= layer.getMetaData('mapglow_table_geom_col') # defaults to the_geom
        srid=4326 #defaults to 4326
        schema = layer.getMetaData('mapglow_schema_name')
        encoding='utf-8' #defaults to utf-8
        attribute_cols='rating' #optional
        order='random()' #optional

        #    try:
        pg = PostGIS(name=name, fid=fid, geometry=geometry, srid=srid, order=order, schema=schema, layer=table, dsn=dsn)
        pg.begin()

        class Action:
            id = None
            attributes = None
            bbox = [float(x) for x in bbox_str.split(',')]
            maxfeatures = max_features
            startfeature = None
        action = Action()

        features = pg.select(action)
        # print(str(features[0].get_geo()['coordinates'][0 ]))

        ftCnt = features.__len__()
        printtime('PostGIS query done cnt=' + str(ftCnt))
        # print ftCnt
        try:
            for i in range(0, ftCnt):
                feat = features[i]
                feat_pt = feat.get_geo()
                point = Point((feat_pt['coordinates'][1], feat_pt['coordinates'][0]))
                points.append(point)

                # printtime('feat(' + str(i) + ') x=' + str(feat_pt.GetX()) + ' y=' + str(feat_pt.GetY()))
        except Exception:
            # print Exception.message
            # print sys.exc_info()
            return points

        return points

    # Get points from layer using direct GDAL/OGR PostGIS query ((
    def get_layer_points_postgis_ogr(self, layer, bbox_str, max_features):
        # print("Content-type: text/plain\n\n")

        points = []

        # "the_geom from (select g.id, g.point as the_geom from gw_tracepoint g where g.point && GeomFromText('POLYGON((-4.275557 50.242394,-4.275557 54.685361,14.115557 54.685361,14.115557 50.242394,-4.275557 50.242394))',4326) order by random() limit 3000) as subquery using unique id using srid=4326"
        bbox_arr = [float(x) for x in bbox_str.split(',')]


        box_polygon = str(bbox_arr[0]) + ' ' + str(bbox_arr[1]) + ',' + str(bbox_arr[0]) + ' ' + str(bbox_arr[3]) + ',' + str(bbox_arr[2]) + ' ' + str(bbox_arr[3]) + ','  + str(bbox_arr[2]) + ' ' + str(bbox_arr[1]) + ',' + str(bbox_arr[0]) + ' ' + str(bbox_arr[1])
        # box_polygon = "-4.275557 50.242394, -4.275557 54.685361, 14.115557 54.685361, 14.115557 50.242394, -4.275557 50.242394"
        sql = "select AsBinary(point) as wkb_geometry from gw_tracepoint where point && GeomFromText('POLYGON((" + box_polygon + "))',4326) order by random() limit " + str(max_features)
        connProp = "PG: host=localhost dbname='georambling' user='oaseuser' password='oase' active_schema='app'"
        conn = ogr.Open(connProp)
        result = conn.ExecuteSQL(sql)

        ftCnt = result.GetFeatureCount()
        printtime('PostGIS query done cnt=' + str(ftCnt))
        # print ftCnt
        try:
            for i in range(0, ftCnt):
                feat = result.GetFeature(i)
                feat_pt = feat.GetGeometryRef()
                point = Point((feat_pt.GetY(), feat_pt.GetX()))
                points.append(point)

                # printtime('feat(' + str(i) + ') x=' + str(feat_pt.GetX()) + ' y=' + str(feat_pt.GetY()))
        except Exception:
            # print Exception.message
            # print sys.exc_info()
            return points

        return points

    # Get points from layer using WFS
    # Nice abstraction but too slow in practice OBSOLETE
    def get_layer_points_wfs(self, layer, bbox, max_features):

        # Get points in bbox by creating/dispatching an WFS GetFeature
        # internally. This is a nice abstraction from various source types like
        # PostGIS, Shape etc.
        wfs_req = mapscript.OWSRequest()
        wfs_req.setParameter( 'SERVICE', 'WFS')
        wfs_req.setParameter( 'VERSION', '1.1.0')
        wfs_req.setParameter( 'REQUEST', 'GetFeature')
        wfs_req.setParameter( 'TYPENAME', layer)
        wfs_req.setParameter( 'BBOX', bbox)
        wfs_req.setParameter( 'VERSION', '1.1.0')
    #    wfs_req.setParameter( 'SRSNAME', "EPSG:4326")  ?????

        # TODO: reproject response points

        mapscript.msIO_installStdoutToBuffer()

        self.map.OWSDispatch(wfs_req)
    #    print 'bbox=' + wms_req.getValueByName('BBOX')
        mapscript.msIO_stripStdoutBufferContentType()
        content = mapscript.msIO_getStdoutBufferString()

        # Parse WFS result into array of Point (slooow, TODO optimize)
        parser = WFSParser(mapscript.msGetVersionInt() >= 50600, max_features)

        return parser.parse(content)

    def debug(self,msg=None):
        print("Content-type: text/plain\n\n")
        print(mapscript.msGetVersion())
        print('version int=' + str(mapscript.msGetVersionInt()))
        if msg:
            print(msg)

    def test_image(self):
        points_file = self.root_dir+ 'data/schoorl-1000.coords'

        # args = ["--points", points_file, "--output", out_file, "--width", "600"]
        args = ["--points", points_file, "--radius", "5", "--decay", "0.9", "--web", "--width", "400", "--gradient",
                self.root_dir + "config/gradients/gradient-red-yellow-trans2.png"]
        main(args)

# Parse WFS GetFeature response into Point array
class WFSParser:
    class Feature:
        def __init__(self, coords):
            self.lat = float(coords[0])
            self.lon = float(coords[1])
            self.coords = (self.lat, self.lon)

        def __str__(self):
            return '%f,%f' % (self.lat, self.lon)

    class _ParseHandler(sax.ContentHandler):
        def __init__(self, latlon=True, max_features=10000):
            self.latlon = latlon
            self.max_features = max_features
            self.skip = 0
            self.points = []
            self.coord_elm = False

        def startDocument(self):
            return

        def startElement(self, name, attrs):
            # printtime('startElement=' + name)
            if name == 'gml:pos':
                # Found coordinate: next content will be lon/lat
                self.coord_elm = True
            elif name == 'wfs:FeatureCollection':
                self.numberOfFeatures = int(attrs['numberOfFeatures'])
                self.skip_count = (self.numberOfFeatures / self.max_features) + 1
                printtime('max_features=' + str(self.max_features) + ' nroffeatures=' + str(self.numberOfFeatures) + ' skip_count=' + str(self.skip_count))

        def endElement(self, name):
            if name == 'gml:pos':
                self.coord_elm = False

        def characters(self, content):
            # printtime('characters=' + content)
            if self.coord_elm and len(content.split()) == 2:
                if self.skip == 0 or self.skip == self.skip_count:
                    # cater for stupid axis ordering
                    if self.latlon:
                        (lon, lat) = [float(x) for x in content.split()]
                    else:
                        (lat, lon) = [float(x) for x in content.split()]

                    # printtime(Point((lon,lat)))

                    self.points.append(Point((lon,lat)))
                    if self.skip >= self.skip_count:
                        self.skip = 0
                self.skip += 1

    def __init__(self, latlon=True, max_features=10000):
        self.handler = WFSParser._ParseHandler(latlon, max_features)

    def parse(self, content):
        sax.parseString(content, self.handler)
        return self.handler.points


# debug();
# heat()

# test url schoorl
# http://local.mapglow.org/wms/?LAYERS=tracepoints&FORMAT=image%2Fpng&TRANSPARENT=true&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&EXCEPTIONS=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A3857&BBOX=467719.65379781,6895177.5317481,570336.36425228,6948492.3589673&WIDTH=1342&HEIGHT=697
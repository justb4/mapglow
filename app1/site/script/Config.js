/*
 * This file is part of MapGlow.
 *
 * MapGlow is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MapGlow.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Just van den Broecke - OpenGeoGroep.nl 2011
 */

Ext.namespace("Heron.Map");
Ext.namespace("Heron.User");

OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";

/** Use Google projection/resolutions options. */
Heron.Map.options = {
    PROJECTION: 'EPSG:900913',
    UNITS: 'm',
    RESOLUTIONS: [156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875,
        4891.969809375, 2445.9849046875, 1222.99245234375, 611.496226171875,
        305.7481130859375, 152.87405654296876, 76.43702827148438, 38.21851413574219,
        19.109257067871095, 9.554628533935547, 4.777314266967774, 2.388657133483887,
        1.1943285667419434, 0.5971642833709717],

    MAX_RESOLUTION: 156543.0339,
    MAX_EXTENT: new OpenLayers.Bounds(-20037508.34, -20037508.34,
            20037508.34, 20037508.34),

    CENTER: new OpenLayers.LonLat(4.92, 52.52).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
            ),
    XY_PRECISION: 0,
    ZOOM: 9
};

Heron.Map.urls = {
    LOCAL_WMS :  '/wms/?'
};

/** Define OL layers. */
Heron.Map.layers = [

    /*
     * ==================================
     *            BaseLayers
     * ==================================
     */
    new OpenLayers.Layer.OSM(),
    new OpenLayers.Layer.Image(
             "Black Background",
             '/site/media/black-1x1.gif',
             Heron.Map.options.MAX_EXTENT,
             new OpenLayers.Size(256, 256),
     {isBaseLayer: true, visibility: false, displayInLayerSwitcher: true}
             ),
    new OpenLayers.Layer.Image(
            "White/Transparent Background",
            '/site/media/blanc-1x1.gif',
            Heron.Map.options.MAX_EXTENT,
            new OpenLayers.Size(256, 256),
    {isBaseLayer: true, visibility: false, displayInLayerSwitcher: true}
            ),

    /*
     * ==================================
     *            Overlays
     * ==================================
     */

    new OpenLayers.Layer.WMS(
            "NL Pubs Heat 1",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "nlpubs", format: "image/png", transparent: true, styles: 'heat/seth/lightblue-darkblue/10/0.8'},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),

    new OpenLayers.Layer.WMS(
            "NL Pubs Normal",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "nlpubs", format: "image/png", transparent: true},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),

    new OpenLayers.Layer.WMS(
            "Georambling Normal",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "tracepoints", format: "image/png", transparent: true},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),

    new OpenLayers.Layer.WMS(
            "Georambling Heat 1",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "tracepoints", format: "image/png", transparent: true, styles: 'heat/seth/0,1,0,0,1,0.6,1,1,0.25,1,0.95,1,1,1,0/5/0.2'},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),

    new OpenLayers.Layer.WMS(
            "Georambling Heat 2",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "tracepoints", format: "image/png", transparent: true, styles: 'heat/seth/0,1,0,0,1,0.75,1,1,1,1,0.9,1,1,1,0/5/0.2'},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),


    new OpenLayers.Layer.WMS(
            "Georambling Heat 3",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "tracepoints", format: "image/png", transparent: true, styles: 'heat/seth/0,0,0,1,1,0.9,1,1,1,1/5/0.5'},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),

    new OpenLayers.Layer.WMS(
            "Georambling PurpleYellowTrans",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "tracepoints", format: "image/png", transparent: true, styles: 'heat/seth/purple-yellow/6/0.8'},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),

    new OpenLayers.Layer.WMS(
            "Brandweer red-yellow-trans2/12/0.5",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "brandweer", format: "image/png", transparent: true, styles: 'heat/seth/red-yellow-trans2/12/0.5'},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),


    new OpenLayers.Layer.WMS(
            "Brandweer red-yellow-trans2/5/0.5",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "brandweer", format: "image/png", transparent: true, styles: 'heat/seth/red-yellow-trans2/5/0.5'},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),


    new OpenLayers.Layer.WMS(
            "Brandweer red-yellow-trans2/5/0.95",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "brandweer", format: "image/png", transparent: true, styles: 'heat/seth/red-yellow-trans2/5/0.95'},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),


    new OpenLayers.Layer.WMS(
            "Brandweer Fire Invert/10/0.95",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "brandweer", format: "image/png", transparent: true, styles: 'heat/seth/yellow-red-trans2/10/0.6'},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            ),

    new OpenLayers.Layer.WMS(
            "Brandweer Normal",
            Heron.Map.urls.LOCAL_WMS,
    {layers: "brandweer", format: "image/png", transparent: true},
    {isBaseLayer: false, singleTile: true,  visibility: false, alpha:true, opacity: 0.7
        ,featureInfoFormat: "application/vnd.ogc.gml"}
            )

];

Heron.lang = {
    txtWarning : "Warning",
    txtLegend : "Legend",
    txtNoLayerSelected : "No layer selected",
    txtSaveFeatures : "Save features to disk",
    txtGetFeatures : "Download features",
    txtFeatureInfo : "Feature information",
    txtNoData : "No information found",
    txtLayerNotAdded : "Layer not yet added",
    txtAttribute : "Attribute",
    txtValue:"Value",
    txtMask : "Busy recieving data...",
    txtLayers : "Layers",
    txtNoMatch : "Layer data not found",
    txtLoading : "Loading...",
    txtMapContexts : "Contexts",
    txtPlaces : "Places",
    txtTitleFeatureInfo : "Feature info",
    txtTitleFeatureData : "Feature data",
    txtLoadMask : "Busy recieving data...",
    txtUnknownFeatureType : "Unknown",
    txtNoLayersWithFeatureInfo: "The current map doesn't contain layers with feature information.",
    txtPan : "Pan map",
    txtZoomIn : "Zoom in by drawing a box",
    txtZoomOut : "Zoom out by drawing a box",
    txtZoomToFullExtent : "Zoom to full extent",
    txtZoomPrevious : "Go to previous extent",
    txtZoomNext : "Go to next extent",
    txtMeasureLength: "Measure distance (draw linesegments and double click at the end)",
    txtMeasureArea: "Measure area (draw polygon and double click at the end)",
    txtLength: "Length",
    txtArea: "Area"
};

Heron.layout = {

    north : {

        options : {
            layout: 'border',
            width: '100%',
            height: 77,
            bodyBorder: false,
            border: false
        },
        panels: [
            {
                type: 'gv-html',
                options: {
                    id: 'gv-logo-panel',
                    region: 'center',
                    bodyBorder: false,
                    border: false,
                    url: '/site/content/north-banner.html',
                    height: 52
                }
            },
            {
                type: 'gv-user',
                options: {
                    id: 'gv-menu-panel',
                    region: 'south',
                    bodyBorder: false,
                    border: false,
                    height: 25
                }
            }
        ]
    },

    center : {
        options : {
            layout: 'border',
            width: '100%',
            collapsible: true,
            split    : true,
            border: false
        },
        panels: [
            {
                type: 'gv-map',
                options: {
                    region: 'center',
                    collapsible : false,
                    border: false
                }
            },
            {
                type: 'gv-feature-info',
                options: {
                    region : "south",
                    border : true,
                    collapsible : true,
                    collapsed : true,
                    height : 205,
                    split : true,
                    maxFeatures    : 10
                }
            }
        ]
    },
    west : {
        options : {
            layout: 'accordion',
            width: 240,
            collapsible: true,
            split    : true,
            border: false
        },
        panels: [
            {
                type: 'gv-layer-browser'
            },

            {
                type: 'gv-html',
                options: {
                    id: 'gv-info-west',
                    url: '/site/content/west-info.html',
                    preventBodyReset: true, // prevent ExtJS disabling browser styles
                    title: 'Info'
                }
            },
            /*
             {
             type: 'gv-context-browser'
             }, */
            {
                type: 'gv-layer-legend'
            }
        ]
    }
};

// See ToolbarBuilder.js : each string item points to a definition
// in Heron.ToolbarBuilder.defs. Extra options and even an item create function
// can be passed here as well.
Heron.Map.toolbar = [
    {type: "featureinfo"},
    {type: "-"} ,
    {type: "pan"},
    {type: "zoomin"},
    {type: "zoomout"},
    {type: "zoomvisible"},
    {type: "-"} ,
    {type: "zoomprevious"},
    {type: "zoomnext"},
    {type: "-"},
    {type: "measurelength"},
    {type: "measurearea"}
];

/** Defines website menu + "CMS" */
var Pages = function() {
    this.panel = null;

    return {
        showPage : function(pageName) {
            Pages.hideMap();
            Pages.doLoad(pageName);
            Ext.get('gv-page').show();
        },

        hideMap : function() {
            Ext.get('gv-west-panel').hide();
            Ext.get('gv-center-panel').hide();
        },

        showMap : function() {
            Ext.get('gv-page').hide();
            Ext.get('gv-west-panel').show();
            Ext.get('gv-center-panel').show();
        },

        doLoad : function(pageName) {
            var url = '/site/content/' + pageName + '.html?t=' + new Date().getMilliseconds();
            if (!this.panel) {
                this.panel = new Ext.Panel({
                    applyTo:'gv-page',
                    title: pageName,
                    autoScroll: true,
                    frame:false
                });
            }
            this.panel.setTitle(pageName);
            this.panel.load(url);
            //Ext.get('gv-page').load({
            //	url: '/site/content/' + pageName + '.html?t=' + new Date().getMilliseconds()
            //});
        }
    };
}();

Heron.User.createPanel = function(options) {
    var menuHandler = function(button) {
        Pages.showPage(button.page);
    };

    var menu = new Ext.Toolbar({
        id: 'gv-main-menu',
        floating: false,
        items: [
            {
                xtype: 'tbspacer',
                width: 242
            },
            {
                xtype: 'tbbutton',
                text: 'Home',
                page: 'home',
                handler: menuHandler
            },
            {
                xtype: 'tbspacer',
                width: 30
            },
            {
                xtype: 'tbbutton',
                text: 'Examples',
                handler: Pages.showMap
            },
            {
                xtype: 'tbspacer',
                width: 20
            },
            {
                xtype: 'tbbutton',
                text: 'Documentation',
                page: 'documentation',
                handler: menuHandler
            },
            {
                xtype: 'tbspacer',
                width: 20
            },
            {
                xtype: 'tbbutton',
                text: 'Development',
                page: 'development',
                handler: menuHandler
            },
            {
                xtype: 'tbspacer',
                width: 20
            },
            {
                xtype: 'tbspacer',
                width: 20
            },
            {
                xtype: 'tbbutton',
                text: 'Contact',
                page: 'contact',
                handler: menuHandler
            }

        ]
    });

    var panel = new Ext.Panel(options);
    panel.add(menu);

    return panel;
};

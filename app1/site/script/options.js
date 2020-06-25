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

Ext.namespace("MapGlow.options");

/*
 * This file defines the layout for the entire app.
 * We could define a single huge Heron.layout tree, but for clarity we define
 * specific options (MapGlow.options) separate first and then assign them to fields in the Heron.layout tree.
 */
OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";

MapGlow.options.locations = {
	TILBURG: '5.0850, 51.5639',
	LIMBURG: '5.891, 50.775',
	AMERSFOORT: '5.2861, 52.1613',
	LOSSER: '6.84, 52.30'

};

MapGlow.options.urls = {
	// LOCAL_WMS :  '/wms/?',
	LOCAL_WMS :  'http://localhost:8081?',
	GS2_INSPIRE_WMS :  'http://kademo.nl/gs2/inspire/wms?',
	GS2_KADASTER_WMS :  'http://gis.kademo.nl/gs2/wms?',
	TILECACHE :  'http://gis.kademo.nl/cgi-bin/tilecache.cgi?',
	INTERACTIVE_INSTRUMENTS_WMS: 'http://services.interactive-instruments.de/exm-ni/cgi-bin/xs01-wms?',
	WHEREGROUP_WMS: 'http://osm.wheregroup.com/cgi-bin/osm_basic.xml?'
};

/** All MapPanel options. */
MapGlow.options.map = {
	settings : {

		allOverlays : true,
		projection: 'EPSG:3857',
		units: 'm',
		resolutions: [156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875,
			4891.969809375, 2445.9849046875, 1222.99245234375, 611.496226171875,
			305.7481130859375, 152.87405654296876, 76.43702827148438, 38.21851413574219,
			19.109257067871095, 9.554628533935547, 4.777314266967774, 2.388657133483887,
			1.1943285667419434, 0.5971642833709717],
		maxExtent: '-20037508.34,-20037508.34,20037508.34,20037508.34',
		center: '542977,6867208',
		xy_precision: 0,
		zoom: 9,
		theme: null
	},

	layers: [

		/*
		 * ==================================
		 *            BaseLayers
		 * ==================================
		 */
		new OpenLayers.Layer.OSM(),
/*		 new OpenLayers.Layer.Image(
		 "Black Background",
		 '/site/media/black-1x1.gif',
		 new OpenLayers.Bounds(MapGlow.options.maxExtent),
		 new OpenLayers.Size(256, 256),
		 {isBaseLayer: false, visibility: false}
		 ),
		 new OpenLayers.Layer.Image(
		 "White/Transparent Background",
		 '/site/media/blanc-1x1.gif',
		 new OpenLayers.Bounds(MapGlow.options.maxExtent),
		 new OpenLayers.Size(256, 256),
		 {isBaseLayer: false, visibility: false, displayInLayerSwitcher: true}
		 ),         */

		/*
		 * ==================================
		 *            Overlays
		 * ==================================
		 */

		new OpenLayers.Layer.WMS(
				"NL Pubs Heat 1",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "nlpubs", format: "image/png", transparent: true, styles: 'heat/seth/lightblue-darkblue/10/0.8'},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),

		new OpenLayers.Layer.WMS(
				"NL Pubs Normal",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "nlpubs", format: "image/png", transparent: true},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),

		new OpenLayers.Layer.WMS(
				"Georambling Normal",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "tracepoints", format: "image/png", transparent: true},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),

		new OpenLayers.Layer.WMS(
				"Georambling Heat 1",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "tracepoints", format: "image/png", transparent: true, styles: 'heat/seth/0,1,0,0,1,0.6,1,1,0.25,1,0.95,1,1,1,0/5/0.2'},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),

		new OpenLayers.Layer.WMS(
				"Georambling Heat 2",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "tracepoints", format: "image/png", transparent: true, styles: 'heat/seth/0,1,0,0,1,0.75,1,1,1,1,0.9,1,1,1,0/5/0.2'},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),


		new OpenLayers.Layer.WMS(
				"Georambling Heat 3",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "tracepoints", format: "image/png", transparent: true, styles: 'heat/seth/0,0,0,1,1,0.9,1,1,1,1/5/0.5'},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),

		new OpenLayers.Layer.WMS(
				"Georambling PurpleYellowTrans",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "tracepoints", format: "image/png", transparent: true, styles: 'heat/seth/purple-yellow/6/0.8'},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),

		new OpenLayers.Layer.WMS(
				"Brandweer red-yellow-trans2/12/0.5",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "brandweer", format: "image/png", transparent: true, styles: 'heat/seth/red-yellow-trans2/12/0.5'},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),


		new OpenLayers.Layer.WMS(
				"Brandweer red-yellow-trans2/5/0.5",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "brandweer", format: "image/png", transparent: true, styles: 'heat/seth/red-yellow-trans2/5/0.5'},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),


		new OpenLayers.Layer.WMS(
				"Brandweer red-yellow-trans2/5/0.95",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "brandweer", format: "image/png", transparent: true, styles: 'heat/seth/red-yellow-trans2/5/0.95'},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),


		new OpenLayers.Layer.WMS(
				"Brandweer Fire Invert/10/0.95",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "brandweer", format: "image/png", transparent: true, styles: 'heat/seth/yellow-red-trans2/10/0.6'},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		),

		new OpenLayers.Layer.WMS(
				"Brandweer Normal",
				MapGlow.options.urls.LOCAL_WMS,
				{layers: "brandweer", format: "image/png", transparent: true},
				{isBaseLayer: false, singleTile: true,  visibility: false
					,featureInfoFormat: "application/vnd.ogc.gml"}
		)

	],

	toolbar : [
		{type: "featureinfo", options: {max_features: 20}},
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
		{type: "measurearea"},
		{type: "-"}
	]
};

/**
 * Describes the menu layout and links to content items.
 * This config object is included in the Layout config below.
 *
 */
MapGlow.options.menuItems = [
	{
		id: 'hr-menu-bar',
		xtype: 'toolbar',
		floating: false,
		items:[
			{
				xtype: 'tbspacer',
				width: 240
			},
			{
				xtype: 'tbbutton',
				text: 'About',
				card: 'hr-content-main',
				page: 'home',
				handler: Heron.widgets.MenuHandler.onSelect
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'tbbutton',
				text: 'Examples',
				card: 'hr-geo-main',
				handler: Heron.widgets.MenuHandler.onSelect
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'tbbutton',
				text: 'Documentation',
				card: 'hr-content-main',
				page: 'documentation',
				handler: Heron.widgets.MenuHandler.onSelect
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'tbbutton',
				text: 'Development',
				card: 'hr-content-main',
				page: 'development',
				handler: Heron.widgets.MenuHandler.onSelect
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'tbbutton',
				text: 'Contact',
				card: 'hr-content-main',
				page: 'contact',
				handler: Heron.widgets.MenuHandler.onSelect
			}
		]
	}
];

// Replace default layer browser DefaultConfig.js
// Pass our theme tree config as an option
Ext.namespace("MapGlow.options.layertree");

MapGlow.options.layertree.tree = [
	{
		text:'Base Layers', children:
			[
				{nodeType: 'gx_layer', layer: 'OpenStreetMap', text: 'OpenStreetMap' }
				/*,
				{nodeType: 'gx_layer', layer: 'Black Background', text: 'Black Background' }    */
			]
	},

	{
		text:'Fire Brigade Ams', children:
			[
				{nodeType: 'gx_layer', layer: 'Brandweer Normal', text: 'Normal' },
				{nodeType: 'gx_layer', layer: 'Brandweer red-yellow-trans2/12/0.5', text: 'red-yellow-trans2/12/0.5' },
				{nodeType: 'gx_layer', layer: 'Brandweer red-yellow-trans2/5/0.5', text: 'red-yellow-trans2/12/0.5' },
				{nodeType: 'gx_layer', layer: 'Brandweer red-yellow-trans2/5/0.95', text: 'red-yellow-trans2/5/0.95' },
				{nodeType: 'gx_layer', layer: 'Brandweer Fire Invert/10/0.95', text: 'Fire Invert/10/0.95' }
			]

	},
	{
		text:'GeoRambling.com', children:
			[
				{nodeType: 'gx_layer', layer: 'Georambling Normal', text: 'Normal' },
				{nodeType: 'gx_layer', layer: 'Georambling Heat 1', text: 'Heat 1' },
				{nodeType: 'gx_layer', layer: 'Georambling Heat 2', text: 'Heat 2' },
				{nodeType: 'gx_layer', layer: 'Georambling Heat 3', text: 'Heat 3' },
				{nodeType: 'gx_layer', layer: 'Georambling PurpleYellowTrans', text: 'PurpleYellowTrans' }
			]
	},
	{
		text:'Pubs NL (OSM)', children:
			[
				{nodeType: 'gx_layer', layer: 'NL Pubs Normal', text: 'Normal' },
				{nodeType: 'gx_layer', layer: 'NL Pubs Heat 1', text: 'Heat 1' }
			]
	}

];

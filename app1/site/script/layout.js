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
/**
 * Defines the entire layout of the webapp using ExtJS-style.
 *
 * The layout specifies a hierarchy of ExtJS (Panel) components.
 * Each component is either a container of components (xtype: 'panel', i.e. an ExtJS Panel)
 * or a specific leaf component like a map panel (xtype: 'hr_mappanel') or simple HTML
 * panel (xtype: 'hr_htmlpanel'). Each component has a 'xtype' string and component-specific options.
 * The 'xtype' defines the component widget class .
 * For a container-type (xtype: 'panel') the options should include a 'layout' (like 'border' or 'card',
 * and an array of 'items' with each element being a component (another container or a leaf widget component).
 *
 * In order to distinguish ExtJS-specific config options from those that are Heron-specific,
 * the later are prefixed with "hr".
 *
 * Specific config options for ExtJS components can be found in the API docs:
 * http://dev.sencha.com/deploy/ext-3.3.1/docs
 *
 **/
Heron.layout = {
	/** Top Panel: fills entire browser window. */
	xtype: 'panel',
	id: 'hr-container-main',
	layout: 'border',

	items :  [
		{
			/** North container: fixed banner plus Menu. */
			xtype: 'panel',
			id: 'hr-container-north',
			region: 'north',
			layout: 'border',
			width: '100%',
			height: 93,
			bodyBorder: false,
			border: false,
			items :  [
				{
					xtype: 'hr_htmlpanel',
					id: 'hr-logo-panel',
					region: 'center',
					bodyBorder: false,
					border: false,
					autoLoad: {
						url: '/site/content/north-banner.html'
					},
					height: 64

				},
				{
					xtype: 'hr_menupanel',
					id: 'hr-menu-panel',
					region: 'south',
					bodyBorder: false,
					border: false,
					height: 29,
					/** Menu options, see widgets/MenuPanel */
					hropts: {
						pageRoot: '/site/content/',
						cardContainer: 'hr-container-center',
						pageContainer: 'hr-content-main',
						defaultPage: 'home',
						defaultCard: 'hr-content-main'
					},
					/** See above for the items. */
					items: MapGlow.options.menuItems
				}
			]
		},
		{
			/**
			 * Content area: either map + navigation or plain (HTML) content driven by Menu.
			 * An ExtJS Card Layout is used to swap between Map view and HTML content views.
			 **/
			xtype: 'panel',
			id: 'hr-container-center',
			region: 'center',
			layout: 'card',
			border: false,
			header: false,
			activeItem: 'hr-content-main',
			width: '100%',

			items :  [
				{
					/** HTML content area in which HTML fragments from content/ dir are placed. */
					xtype: 'hr_htmlpanel',
					id: 'hr-content-main',
					layout: 'fit',
					autoScroll: true,
					height: '100%',
					width: '100%',
					preventBodyReset: true,
					bodyBorder: false,
					border: false,
					style: {
						backgroundColor: '#00387D'
					}
				},
				{
					/** "Geo" content area, i.e. the Map and the Accordion widgets on the left. */
					xtype: 'panel',
					id: 'hr-geo-main',
					layout: 'border',
					width: '100%',
					border: false,
					items: [
						{
							/** "Geo" navigation area, i.e. the left widgets in Accordion layout. */
							xtype: 'panel',
							id: 'hr-geo-left-container',
							layout: 'vbox',
							layoutConfig: {
								align : 'stretch',
								pack  : 'start'
							},
							region : "west",
							width: 260,
							collapsible: true,
							split	: true,
							border: false,
							items: [
								{
									xtype: 'hr_activelayerspanel',
									height: 240,
									flex: 3,
									hropts: {
										/** Defines the custom component added under the standard layer node. */
										component : {
											xtype: "gx_opacityslider",
											showTitle: false,
											plugins: new GeoExt.LayerOpacitySliderTip(),
											width: 160,
											value: 100,
											inverse: false,
											aggressive: false,
											style: {
												marginLeft: '18px'
											}
										}

									}
								},
								{
									xtype: 'panel',
									flex: 5,
									layout: 'accordion',
									items: [
										{
											xtype: 'hr_layertreepanel',
											hropts: MapGlow.options.layertree
										},
										{
											xtype: 'hr_htmlpanel',
											id: 'hr-info-west',
											html: '<div class="hr-html-panel-body"><p>This website has been made with the' +
													' <a href="http://heron-mc.org" target="_new" >Heron Mapping Client</a>.' +
													'</div>',
											preventBodyReset: true,
											title: 'Info'
										},
										{
											xtype: 'hr_layerlegendpanel'
										}
									]
								}
							]
						},
						{
							/** Map and Feature Info panel area. */
							xtype: 'panel',
							id: 'hr-map-and-info-container',
							layout: 'border',
							region: 'center',
							width: '100%',
							collapsible: false,
							split	: true,
							border: false,
							items: [
								{
									xtype: 'hr_mappanel',
									id: 'hr-map',
									region: 'center',
									collapsible : false,
									border: false,
									hropts: MapGlow.options.map
								},
								{
									xtype: 'hr_featureinfopanel',
									id: 'hr-feature-info',
									region: "south",
									border: true,
									collapsible: true,
									collapsed: true,
									height: 205,
									split: true,
									maxFeatures: 10
								}
							]
						}
					]
				}
			]
		}
	]
};


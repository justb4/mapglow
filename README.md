# MapGlow
MapGlow enables displaying your geodata as heatmaps. See demo and docs at http://mapglow.opentraces.org/ .

MapGlow is currently a Python MapScript addition to UMN MapServer 
It intercepts WMS GetMap and GetLegendGraphic requests for heatmap generation
from MapServer Layer Vector (Point-type) sources when the STYLE(S) parameter starts with the magic word "heat". 

In that case MapGlow will query the MS Layer feature data
and draw a transparent overlay heatmap. The STYLES parameter also determines
the parameterization of how the heatmap should be drawn in terms of gradient colors and other parameters. 
See two extreme examples below:

![Examples MapGlow](doc/media/sample-1.png)

MapGlow will delegate processing to the standard MapServer OWS dispatching
for other requests like GetCapabilities	or when no STYLE(S) parameter is provided.

So the beauty of MapGlow is not just the heatmap, but to also function within OGC WMS standard!
That means any (WMS) client can fetch heatmaps (plus control their parameterization). In production
deployment cases it is optimal to use a tiling server like MapProxy in front.

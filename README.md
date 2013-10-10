MapGlow enables displaying your geodata as heatmaps. See more at http://webglow.org.
MapGlow is currently a Python MapScript addition to UMN MapServer 
It intercepts WMS GetMap and GetLegendGraphic requests for heatmap generation
from MapServer Layer Vector (Point-type) sources when the STYLE(S) parameter starts with the magic word "heat". In that case MapGlow will query the MS Layer feature data
and draw a transparent overlay heatmap. The STYLES parameter also determines
the parametrization of how the heatmap should be drawn in terms of gradient colors and other parameters. MapGlow will delegate processing to the standard MapServer OWS dispatching
for other requests like GetCapabilities	or when no STYLE(S) parameter is provided.
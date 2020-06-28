# TODO

# Segfault

```
import mapscript
map = mapscript.mapObj('/app1/config/mapserver/app1.map')
layer=map.getLayerByName('nlpubs')
layer.name
len(layer.metadata)

res = layer.queryByAttributes(map, 'Name', 'Lef', mapscript.MS_MULTIPLE)


```
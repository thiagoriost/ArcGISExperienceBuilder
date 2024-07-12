import React, {  useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { JimuMapView } from 'jimu-arcgis';

const columns = [
  { field: 'OBJECTID', headerName: 'OBJECTID', width: 150 },
  { field: 'DEPARTAMEN', headerName: 'DEPARTAMEN', width: 150 },
  { field: 'MUNICIPIO', headerName: 'MUNICIPIO', width: 150 },
  { field: 'PCC', headerName: 'PCC', width: 150 },
  { field: 'VEREDA', headerName: 'VEREDA', width: 150 },
]
const SelectWidget = ({props}) => {
  
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(props.jimuMapView);
  const startPointRef = useRef(null);
  const selectionGraphicsLayerRef = useRef<__esri.GraphicsLayer>(null);

  

  const handleMapClick = (event, Graphic) => {
    if (event.action !== 'start') return;
    startPointRef.current = event.mapPoint;
  };
  
  const handleMapDrag = (event, Graphic) => {
    if (event.action === 'end') {
      const startPoint = startPointRef.current;
      const endPoint = event.mapPoint;
      const extent = {
        xmin: Math.min(startPoint.x, endPoint.x),
        ymin: Math.min(startPoint.y, endPoint.y),
        xmax: Math.max(startPoint.x, endPoint.x),
        ymax: Math.max(startPoint.y, endPoint.y),
        spatialReference: startPoint.spatialReference
      };

      const layer = jimuMapView.view.map.findLayerById('your-layer-id') as __esri.FeatureLayer;
      if (layer) {
        const query = layer.createQuery();
        // query.geometry = extent;
        query.spatialRelationship = 'intersects';
        query.returnGeometry = true;
        query.outFields = ['*'];

        layer.queryFeatures(query).then((results) => {
          selectionGraphicsLayerRef.current.removeAll();
          selectionGraphicsLayerRef.current.addMany(
            results.features.map(feature => {
              return new Graphic({
                geometry: feature.geometry,
                symbol: {
                  type: 'simple-fill',
                  color: [51, 51, 204, 0.9],
                  style: 'solid',
                  outline: {
                    color: 'white',
                    width: 1
                  }
                }
              });
            })
          );
        });
      }
    }
  };

  useEffect(() => {
    if (!jimuMapView) return;

    // Load required ArcGIS modules
    loadModules([
      'esri/Graphic',
      'esri/layers/GraphicsLayer'
    ], {
      url: 'https://js.arcgis.com/4.29/'
    })
      .then(([Graphic, GraphicsLayer]) => {
        // Create a GraphicsLayer to store the selection graphics
        const selectionGraphicsLayer = new GraphicsLayer();
        jimuMapView.view.map.add(selectionGraphicsLayer);
        selectionGraphicsLayerRef.current = selectionGraphicsLayer;

        jimuMapView.view.on('click', (event) => {
          handleMapClick(event, Graphic);
        });

        jimuMapView.view.on('drag', (event) => {
          handleMapDrag(event, Graphic);
        });
      })
      .catch(err => console.error('Error loading ArcGIS modules:', err));
  }, [jimuMapView]);

  return (
    <div>
      <p>Click and drag to select features</p>
    </div>
  );
};

export default SelectWidget;

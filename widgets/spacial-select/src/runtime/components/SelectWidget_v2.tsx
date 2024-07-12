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
  const [selectionMode, setSelectionMode] = useState<any>('rectangle');
  const drawRef = useRef<__esri.Draw>();

  const startDrawing = () => {
    console.log("startDrawing", props)
    if (!drawRef.current) return;

    const action = drawRef.current.create(selectionMode);
    jimuMapView.view.graphics.removeAll();

    action.on('draw-complete', (event) => {
      const { geometry } = event;

      const layer = jimuMapView.view.map.findLayerById('your-layer-id') as __esri.FeatureLayer;
      if (layer) {
        const query = layer.createQuery();
        query.geometry = geometry;
        query.spatialRelationship = 'intersects';
        query.returnGeometry = true;
        query.outFields = ['*'];

        layer.queryFeatures(query).then((results) => {
          jimuMapView.view.graphics.addMany(
            results.features.map(feature => {
              return new jimuMapView.view.Graphic({
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
    });
  };

  const handleSelectionModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectionMode(event.target.value);
  };

  useEffect(() => {
    if (!jimuMapView) return;

    // Load required ArcGIS modules
    loadModules([
      'esri/views/2d/draw/Draw'
    ]/* , {
      url: 'https://js.arcgis.com/4.29/'
    } */)
      .then(([Draw]) => {
        drawRef.current = new Draw({
          view: jimuMapView.view
        });
      })
      .catch(err => console.error('Error loading ArcGIS modules:', err));
  }, [jimuMapView]);

  useEffect(() => {
    console.log(props)
    setJimuMapView(props.jimuMapView);
  
    return () => {}
  }, [])
  
  

  return (
    <div>
     
      <select onChange={handleSelectionModeChange}>
        <option value="rectangle">Select by Rectangle</option>
        <option value="lasso">Select by Lasso</option>
        <option value="circle">Select by Circle</option>
        <option value="line">Select by Line</option>
        <option value="point">Select by Point</option>
      </select>
      <button onClick={startDrawing}>Start Drawing</button>
    </div>
  );
};

export default SelectWidget;

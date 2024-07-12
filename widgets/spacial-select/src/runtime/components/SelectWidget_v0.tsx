import React, {  useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

const columns = [
  { field: 'OBJECTID', headerName: 'OBJECTID', width: 150 },
  { field: 'DEPARTAMEN', headerName: 'DEPARTAMEN', width: 150 },
  { field: 'MUNICIPIO', headerName: 'MUNICIPIO', width: 150 },
  { field: 'PCC', headerName: 'PCC', width: 150 },
  { field: 'VEREDA', headerName: 'VEREDA', width: 150 },
]
const SelectWidget = ({props}) => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [widgetModules, setWidgetModules] = useState(null);
  const [lastGeometriDeployed, setLastGeometriDeployed] = useState();
  const [LayerSelectedDeployed, setLayerSelectedDeployed] = useState(null);
  const [graphicsLayerDeployed, setGraphicsLayerDeployed] = useState(null);
  const [mostrarResultadoFeaturesConsulta, setMostrarResultadoFeaturesConsulta] = useState(false);





  const initiateSelection = async () => {
   

    const mapView = props.jimuMapView.view as __esri.MapView;

    // Interactive selection
    mapView.on('click', async (event) => {

      console.log(111111111111111)
      const layer = new FeatureLayer({
        url: 'https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/Ambiental_T_Ajustado/MapServer/14'
      });

      const query = layer.createQuery();
      query.where = '1=1';      
      query.geometry = event.mapPoint;
      query.distance = 10;
      query.units = 'meters';
      query.spatialRelationship = 'intersects';
      query.returnGeometry = true;
      query.outFields = ['*'];

      

      const results = await layer.queryFeatures(query);
      setSelectedFeatures(results.features.map(feature => feature.attributes));

      // Spatial selection
      const selectFeatures = async (geometry) => {

        const layer = new FeatureLayer({
          url: 'https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/Ambiental_T_Ajustado/MapServer/14'
        });

        const query = layer.createQuery();
        query.geometry = geometry;
        query.spatialRelationship = 'intersects';
        query.returnGeometry = true;
        query.outFields = ['*'];

        const results = await layer.queryFeatures(query);
        setSelectedFeatures(results.features.map(feature => feature.attributes));
      };

      mapView.ui.add('select-tools', 'top-right');
    });

  };

  useEffect(() => {
    import('../../../../commonWidgets/widgetsModule').then(modulo => setWidgetModules(modulo));
  
    return () => {}
  }, [])
  

  return (
    <div>
      
      <div className="widget-select">
        <button onClick={initiateSelection}>Start Selection</button>
        <div style={{ height: 400, width: '100%' }}>
          {
            mostrarResultadoFeaturesConsulta &&
            widgetModules.TABLARESULTADOS({
              rows:selectedFeatures,
              columns,
              jimuMapView:props.jimuMapView,
              lastGeometriDeployed,
              LayerSelectedDeployed,
              graphicsLayerDeployed,
              setLastGeometriDeployed,
              setMostrarResultadoFeaturesConsulta
            })
          }
        
          {/* <DataGrid rows={selectedFeatures} columns={[
            { field: 'OBJECTID', headerName: 'OBJECTID', width: 150 },
            { field: 'DEPARTAMEN', headerName: 'DEPARTAMEN', width: 150 },
            { field: 'MUNICIPIO', headerName: 'MUNICIPIO', width: 150 },
            { field: 'PCC', headerName: 'PCC', width: 150 },
            { field: 'VEREDA', headerName: 'VEREDA', width: 150 },
          ]} pageSize={5} /> */}
        </div>
      </div>
    </div>
  );
};

export default SelectWidget;

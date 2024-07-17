import React, { useEffect, useState } from 'react'
import { Button} from 'jimu-ui'; // import components
import DataGrid from 'react-data-grid';
import { loadModules } from 'esri-loader';
import 'react-data-grid/lib/styles.css';




const TablaResultados = ({
    rows, columns, jimuMapView, lastGeometriDeployed, setLastGeometriDeployed, graphicsLayerDeployed,
    setMostrarResultadoFeaturesConsulta, LayerSelectedDeployed
}) => {

  const [moduleUtils, setModuleUtils] = useState(null);

  const retornarFormulario = () => {
      if(lastGeometriDeployed){
        jimuMapView.view.map.remove(lastGeometriDeployed)
        setLastGeometriDeployed(null);
        jimuMapView.view.goTo({          
          target: graphicsLayerDeployed?graphicsLayerDeployed.graphics.items[0].geometry:lastGeometriDeployed.graphics.items[0].geometry,
          zoom: 10 
        });
      }
  
      setMostrarResultadoFeaturesConsulta(false)
  }
  const zoomToFeatureSelected = async (row) =>{
      if (lastGeometriDeployed) jimuMapView.view.map.remove(lastGeometriDeployed);
  
      /* const [
        Graphic, GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Point, Extent
      ] = await moduleUtils.loadEsriModules(); */
  
      const geometryType = LayerSelectedDeployed.geometryType?LayerSelectedDeployed.geometryType:row.row.geometry.type;
      const spatialReference = row.row.geometry.spatialReference?row.row.geometry.spatialReference:graphicsLayerDeployed.graphics.items.find(e => e.attributes.OBJECTID == row.row.OBJECTID).geometry.spatialReference;
      
      loadModules([
        'esri/layers/GraphicsLayer', 'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/Graphic',
        'esri/symbols/SimpleMarkerSymbol', 'esri/geometry/Point', 'esri/geometry/Extent'
      ]).then(([GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, Graphic, SimpleMarkerSymbol, Point, Extent]) => {
          
        const symbol = moduleUtils.createSymbol({ SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol }, geometryType);
        const geometry = moduleUtils.createGeometry({ Point }, geometryType, row.row.geometry, spatialReference);
    
        const graphic = new Graphic({ geometry, symbol });
        const graphicsLayer = new GraphicsLayer();
        graphicsLayer.add(graphic);
        jimuMapView.view.map.add(graphicsLayer);
    
        if (geometryType === 'point') {
          const extentData = moduleUtils.calculateExtent(row.row.geometry, LayerSelectedDeployed);
          const extent = new Extent(extentData);
          jimuMapView.view.goTo(extent, { duration: 1000 });
        } else {
          jimuMapView.view.goTo(graphic.geometry.extent.expand(1.5), { duration: 1000 });
        }
    
        setLastGeometriDeployed(graphicsLayer);
        });
  }

  const exportToCSV = () => {
    moduleUtils.moduleExportToCSV(rows, 'data')
  }

  useEffect(() => {
    console.log("TablaResultados")
    import('../../utils/module').then(modulo => setModuleUtils(modulo));
    return () => {}
  }, [])
  

  return (
    <>
        <div className="fila">
            <Button size="sm" className="mb-1" type="primary" onClick={retornarFormulario}>
              Parámetros consulta
            </Button>
            <Button onClick={exportToCSV} size="sm" className="mb-1" type="primary">
              Exportar
            </Button>
        </div>
        <DataGrid columns={columns} rows={rows} onCellClick={zoomToFeatureSelected}/>
      </>
  )
}

export default TablaResultados


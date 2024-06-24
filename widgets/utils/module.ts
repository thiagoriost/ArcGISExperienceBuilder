import { loadModules } from "esri-loader";
import { exportToCSV } from "./exportToCSV";



const moduleExportToCSV = (rows, fileName) => {
    return exportToCSV(rows, fileName)
}

const loadEsriModules = async () => {
    return await loadModules([
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
      'esri/symbols/SimpleFillSymbol',
      'esri/symbols/SimpleLineSymbol',
      'esri/symbols/SimpleMarkerSymbol',
      'esri/geometry/Point',
      'esri/geometry/Extent',
      'esri/PopupTemplate'
    ]);
};

// Función para calcular el Extent del polígono
const calculateExtent = (geometry, LayerSelectedDeployed) => {
    const {fullExtent, geometryType}=LayerSelectedDeployed
    
    let xmin = Infinity; let ymin = Infinity; let xmax = -Infinity; let ymax = -Infinity;
  
    if (geometryType == 'point') {
      const buffer = 100; // Tamaño del buffer alrededor del punto
      return {
        xmin: geometry.x - buffer,
        ymin: geometry.y - buffer,
        xmax: geometry.x + buffer,
        ymax: geometry.y + buffer,
        spatialReference:fullExtent.spatialReference
      };
    } else if(geometryType == 'polygon' || geometryType == 'polyline'){
      const geometries = geometryType == 'polygon' ? geometry.rings : geometry.paths;
      geometries.forEach(ring => {
        ring.forEach(([x, y]) => {
          if (x < xmin) xmin = x;
          if (y < ymin) ymin = y;
          if (x > xmax) xmax = x;
          if (y > ymax) ymax = y;
        });
      });
    
      return {
        xmin,
        ymin,
        xmax,
        ymax,
        spatialReference:fullExtent.spatialReference
      };    
    }else {
      return null
    }
  
};

const createSymbol = ({ SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol }, geometryType) => {
  switch (geometryType) {
    case 'polygon':
      return new SimpleFillSymbol({
        color: [255, 255, 0, 0.25],
        outline: new SimpleLineSymbol({ color: [255, 0, 0], width: 2 })
      });
    case 'polyline':
      return new SimpleLineSymbol({ color: [255, 0, 0], width: 2 });
    case 'point':
      return new SimpleMarkerSymbol({
        color: [255, 0, 0],
        outline: new SimpleLineSymbol({ color: [255, 255, 0], width: 1 }),
        size: '8px'
      });
    default:
      throw new Error('Tipo de geometría no soportado');
  }
};
  
  // Crear la geometría según el tipo
const createGeometry = ({ Point }, geometryType, geometryData, spatialReference) => {
  switch (geometryType) {
    case 'polygon':
      return { type: geometryType, rings: geometryData.rings, spatialReference };
    case 'polyline':
      return { type: geometryType, paths: geometryData.paths, spatialReference };
    case 'point':
      return new Point({
        x: geometryData.x,
        y: geometryData.y,
        spatialReference
      });
    default:
      throw new Error('Tipo de geometría no soportado');
  }
};


export {
    moduleExportToCSV,
    loadEsriModules,
    calculateExtent,
    createSymbol,
    createGeometry
}
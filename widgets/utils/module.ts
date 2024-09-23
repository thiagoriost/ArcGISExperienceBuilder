import { loadModules } from "esri-loader";
import { exportToCSV } from "./exportToCSV";
// import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { JimuMapView, loadArcGISJSAPIModules } from "jimu-arcgis";
import ClassBreaksRenderer from '@arcgis/core/renderers/ClassBreaksRenderer';
import Polygon from "@arcgis/core/geometry/Polygon";
import { coloresMapaCoropletico } from "./constantes";



const moduleExportToCSV = (rows, fileName) => {
    return exportToCSV(rows, fileName)
}

const loadEsriModules = async () => {
  try {
    const [FeatureLayer, SimpleFillSymbol, Polygon, Graphic, GraphicsLayer, SimpleMarkerSymbol,SimpleLineSymbol] = await loadModules([
      'esri/layers/FeatureLayer', 'esri/symbols/SimpleFillSymbol', 'esri/geometry/Polygon', 'esri/Graphic',
       'esri/layers/GraphicsLayer', 'esri/symbols/SimpleMarkerSymbol', 'esri/symbols/SimpleLineSymbol'], {
      url: 'https://js.arcgis.com/4.29/'
    });

    return {FeatureLayer, SimpleFillSymbol, Polygon, Graphic, GraphicsLayer,SimpleMarkerSymbol,SimpleLineSymbol}
    
  } catch (error) {
    if(logger()) console.error('Error loading loadModules: ', error);
  }
};

// Función para calcular el Extent del polígono
const calculateExtent = (geometry, LayerSelectedDeployed) => {
    const {fullExtent, geometryType}=LayerSelectedDeployed
    
    let xmin = Infinity; let ymin = Infinity; let xmax = -Infinity; let ymax = -Infinity;
  const tipoGeometria = geometryType?geometryType:geometry.type
    if (tipoGeometria == 'point') {
      const buffer = 10; // Tamaño del buffer alrededor del punto
      return {
        xmin: geometry.x - buffer,
        ymin: geometry.y - buffer,
        xmax: geometry.x + buffer,
        ymax: geometry.y + buffer,
        spatialReference:fullExtent.spatialReference
      };
    } else if(tipoGeometria == 'polygon' || tipoGeometria == 'polyline'){
      const geometries = tipoGeometria == 'polygon' ? geometry.rings : geometry.paths;
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

/**
 * Apartir de una url "https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/Ambiental_T_Ajustado/MapServer/14"
 * renderiza en el mapa el layer
 * @param url 
 */
const renderLayer = async (url: string, jimuMapView: JimuMapView) => {
  try {
    const [FeatureLayer, SpatialReference] = await loadArcGISJSAPIModules([
      'esri/layers/FeatureLayer',
      'esri/geometry/SpatialReference'
    ]);
    const layer = await new FeatureLayer({url});
    jimuMapView.view.map.add(layer);    
    return {layer,SpatialReference};
  } catch (error) {
    if(logger()) console.error(error);    
  }
}

/**
 * Este metodo se emplea para traer los campos u atributos de un layer
 * @param campo "*"
 * @param url "https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/Ambiental_T_Ajustado/MapServer/14/query"
 * @param returnGeometry boolean
 * @param where "1=1"
 * @returns jsonResponse
 */
const realizarConsulta = async (campo: string, url: string, returnGeometry: boolean, where: string) => {
  const controller = new AbortController();
  const fixUrl = `${url}?where=${where}&geometryType=esriGeometryEnvelope&outFields=${campo}&returnGeometry=${returnGeometry}&f=pjson`
  if(logger()) console.log(fixUrl)
  // "https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/Ambiental_T_Ajustado/MapServer/14/query?where=1=1&geometryType=esriGeometryEnvelope&outFields=VEREDA&returnGeometry=false&f=pjson"
  try {
    const response = await fetch(fixUrl,
      {
        method: "GET",
        signal: controller.signal,
        redirect: "follow"
      });
    if(logger()) console.log({ response })
    const _responseConsulta = await response.text();
    if(logger()) console.log(JSON.parse(_responseConsulta))
    return JSON.parse(_responseConsulta);
  } catch (error) {
    if(logger()) console.error({ error });
  }


}

/**
 * se utiliza para pintar un feachureLayer en el mapa y/o para consultar los atributos de cada feature
 * @param param0 
 */
const pintarFeatureLayer = async ({url, jimuMapView, colorOutline="white", color='transparent', doZoom, geometryType,
    outFields="*",returnGeometry=false, definitionExpression='1=1', getAttributes=false,pintarFeature=false,
    _dataCoropletico, identificadorMixData, fieldValueToSetRangeCoropletico, lastLayerDeployed,
    setPoligonoSeleccionado, setClickHandler, setLastLayerDeployed, setIsLoading, setMunicipios, setRangosLeyenda,
    FeatureLayer,Graphic,GraphicsLayer,SimpleFillSymbol,SimpleMarkerSymbol,SimpleLineSymbol
}) => {
  try {
    if(logger()) console.log("pintarFeatureLayer",{url, jimuMapView, colorOutline, color, doZoom, geometryType, outFields,
      returnGeometry, definitionExpression, getAttributes,pintarFeature, _dataCoropletico, identificadorMixData, fieldValueToSetRangeCoropletico });    

    const layer = new FeatureLayer({ url, outFields, definitionExpression, /* renderer:classBreaksRenderer, */
      editingEnabled: true, objectIdField: "objectid",
    });
    await layer.load();
    

    if (pintarFeature) {
      const query = layer.createQuery();
      query.returnGeometry = true;
      query.outFields = ["*"];
      const featureSet = await layer.queryFeatures(query);
      const features = featureSet.features;
      
      // Con el siguietne for, se agrega los indicadores a cada feature dependiendo del codigo de municipio
      features.map(f=>{
        _dataCoropletico.forEach(dc =>{
          const codigoMunicipio = f.attributes.mpcodigo?f.attributes.mpcodigo:f.attributes.cod_municipio;
            if(codigoMunicipio == dc.attributes.cod_municipio){
            // if(f.attributes.mpcodigo == dc.attributes.cod_municipio){
                f.attributes.dataIndicadores
                    ? f.attributes.dataIndicadores.push(dc)
                    : f.attributes.dataIndicadores=[dc]
            }
        })
      });
      const dataOrdenada = ajustarDataToRender({features}, "" , "mpnombre");
      setMunicipios(dataOrdenada)
      if(logger()) console.log({features})      
      // Datos para configurar los rangos del coropletico
      // const {minValue, maxValue, interval} = rangosCoropleticos(features, fieldValueToSetRangeCoropletico);
      // end Datos para configurar los rangos del coropletico

      dibujarPoligono({features, jimuMapView, setPoligonoSeleccionado,
        setClickHandler, fieldValueToSetRangeCoropletico, setLastLayerDeployed, lastLayerDeployed,
         setRangosLeyenda, Polygon, Graphic, GraphicsLayer, SimpleFillSymbol}
      )

      // Esperar a que la capa esté lista
      layer.when();
      if(logger()) console.log(layer)
      // Hacer zoom a la extensión completa de la capa
      setTimeout(() => {
        if (doZoom) jimuMapView.view.goTo(layer.fullExtent);      
      }, 500);
  
      // Determine symbol type based on layer geometry type
      let symbol;
      switch (geometryType) {
        case 'point':
          symbol = new SimpleMarkerSymbol({
            color,
            outline: {
              color: colorOutline,
              width: 1
            }
          });
          break;
        case 'polyline':
          symbol = new SimpleLineSymbol({
            color,
            width: 2
          });
          break;
        case 'polygon':
          symbol = new SimpleFillSymbol({
            color,
            outline: {
              color: colorOutline,
              width: 1
            }
          });
          break;
        default:
          if(logger()) console.warn('Unsupported geometry type');
          return;
      }
  
      // Apply the renderer with the new symbol
      layer.renderer = {
        type: 'simple',
        symbol
      };
      setIsLoading(false)      
    }
    let dataResponse = undefined;
    if (getAttributes) {
      // Crear y ejecutar la consulta
      const query = layer.createQuery();
      query.where = definitionExpression;
      query.returnGeometry = returnGeometry;
      query.outFields = outFields;
      // query.outFields = ["OBJECTID", "OBJECTID_1", "DEPARTAMEN", "MUNICIPIO", "PCC", "VEREDA"];
  
      dataResponse = await layer.queryFeatures(query);
      if(logger()) console.log(dataResponse);
    }
    // return layer
  } catch (error) {
    if(logger()) console.error('Error fetching data:', error);
  }
};

/* const rangosCoropleticos = (features, fieldValueToSetRangeCoropletico) => {
  const values = []; // guarda los acumulados totales del valor de indicador para el campo fieldValueToSetRangeCoropletico, para cada feature
  features.forEach(featu => {
    let tempValue = 0;
    if(featu.attributes.dataIndicadores){ //este aplica para el coropletico municipal
        featu.attributes.dataIndicadores.forEach(indicadore => tempValue += indicadore.attributes[fieldValueToSetRangeCoropletico]);
        featu.attributes[fieldValueToSetRangeCoropletico]=tempValue
    }else if(!featu.attributes[fieldValueToSetRangeCoropletico]){
      if(logger()) console.error("Sin match para el campo => ", {fieldValueToSetRangeCoropletico, features})
    }else if(featu.attributes[fieldValueToSetRangeCoropletico]){//este aplica para el coropletico nacional
      tempValue = featu.attributes[fieldValueToSetRangeCoropletico];
    }
    values.push(tempValue)
  });    
  if(logger()) console.log({values})
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const numClasses = 5;
  const interval = (maxValue - minValue) / numClasses;
  return {minValue, maxValue, interval}
} */

const calculoValoresQuintiles = (features, fieldValueToSetRangeCoropletico) => {
  const values = []; // guarda los acumulados totales del valor de indicador para el campo fieldValueToSetRangeCoropletico, para cada feature
  features.forEach(featu => {
    let tempValue = 0;
    if(featu.attributes.dataIndicadores){ //este aplica para el coropletico municipal
        featu.attributes.dataIndicadores.forEach(indicadore => tempValue += indicadore.attributes[fieldValueToSetRangeCoropletico]);
        featu.attributes[fieldValueToSetRangeCoropletico]=tempValue
    }else if(!featu.attributes[fieldValueToSetRangeCoropletico]){
      if(logger()) console.error("Sin match para el campo => ", {fieldValueToSetRangeCoropletico, features})
    }else if(featu.attributes[fieldValueToSetRangeCoropletico]){//este aplica para el coropletico nacional
      tempValue = featu.attributes[fieldValueToSetRangeCoropletico];
    }
    values.push(tempValue)
  }); 

  values.sort((a, b) => a - b);
  const minValue = parseFloat(Math.min(...values).toFixed(2));
  const maxValue = parseFloat(Math.max(...values).toFixed(2));
/* 
  const getQuantile = (datos, k) => {
    const n = datos.length;
    const position = (n - 1) * k;
    // const position = (n * k) / 5;
    
      const base = Math.floor(position);
      const rest = position - base;

      if ((datos[base + 1] !== undefined)) {
          return datos[base] + rest * (datos[base + 1] - datos[base]);
      } else {
          return datos[base];
      }      
  }
  // Calcular los quintiles
  const q1 = parseFloat(getQuantile(values, 0.2).toFixed(2));
  const q2 = parseFloat(getQuantile(values, 0.4).toFixed(2));
  const q3 = parseFloat(getQuantile(values, 0.6).toFixed(2));
  const q4 = parseFloat(getQuantile(values, 0.8).toFixed(2));
  const q5 = parseFloat(getQuantile(values, 1.0).toFixed(2));
 
  const rangos = [
    [ minValue , q1    ],
    [ q1+0.01  , q2  ],
    [ q2+0.01  , q3  ],
    [ q3+0.01  , q4  ],    
    [ q4+0.01  , q5  ]
  ]
  console.log("Quintiles ", { minValue, q1, q2, q3, q4, q5, maxValue, rangos });
  return { q1, q2, q3, q4, q5, rangos }
   */
  let quintiles = [];
  const n = values.length;
  for (let k = 1; k < 5; k++) {
      const P = (n * k) / 5;
      
      if (Number.isInteger(P)) {
          quintiles.push(parseFloat(values[P - 1].toFixed(2)));
      } else {
          const lowerIndex = Math.floor(P) - 1;
          const upperIndex = lowerIndex + 1;
          const interpolatedValue = values[lowerIndex] + (P - Math.floor(P)) * (values[upperIndex] - values[lowerIndex]);
          quintiles.push(parseFloat(interpolatedValue.toFixed(2)));
      }
  }
  if(logger()) console.log({rangos:quintiles})
  const rangos = [
    [minValue, quintiles[0]],
    [parseFloat((quintiles[0]+0.01).toFixed(2)) , quintiles[1]],
    [parseFloat((quintiles[1]+0.01).toFixed(2)) , quintiles[2]],
    [parseFloat((quintiles[2]+0.01).toFixed(2)) , quintiles[3]],
    [parseFloat((quintiles[3]+0.01).toFixed(2)) , maxValue],
  ]
  return {rangos};
}

const queryAttributesLayer = async ({url, definitionExpression, returnGeometry, outFields}) => {
  if(logger()) console.log({url, definitionExpression, returnGeometry, outFields})
  const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer'], {
    url: 'https://js.arcgis.com/4.29/'
  });

  const layer = new FeatureLayer({url});
  // Crear y ejecutar la consulta
  const query = layer.createQuery();
  query.where = definitionExpression;
  query.returnGeometry = returnGeometry;
  query.outFields = outFields;
  // query.outFields = ["OBJECTID", "OBJECTID_1", "DEPARTAMEN", "MUNICIPIO", "PCC", "VEREDA"];

  const dataResponse = await layer.queryFeatures(query);
  if(logger()) console.log(dataResponse);
  return dataResponse
}

const ajustarDataToRender = (data: any, valueField, labelField) => {
  const dataAjsutada = [];
  data.features.forEach(e => dataAjsutada.push({
    ...e.attributes,
    ...e,
    value: valueField != "" ? e.attributes[valueField]:e ,
    label:e.attributes[labelField]
  }))
  // data.features.forEach(e => dataAjsutada.push({...e.attributes,value:e.attributes.decodigo,label:e.attributes.denombre}))
  const objetosOrdenados = dataAjsutada.sort((a, b) => {
    if (a[labelField] < b[labelField]) {
      return -1;
    }
    if (a[labelField] > b[labelField]) {
      return 1;
    }
    return 0;
  });  
  return objetosOrdenados
}

const dibujarPoligono = ({features, fieldValueToSetRangeCoropletico, wkid=4326, jimuMapView,
  setRangosLeyenda, setClickHandler, setLastLayerDeployed, setPoligonoSeleccionado, lastLayerDeployed,
  Polygon, Graphic, GraphicsLayer, SimpleFillSymbol}) => {

  
  const graphicsLayer = new GraphicsLayer();
  let tempLastLayerDeployed = lastLayerDeployed;
  /* interval = Math.round(interval);
  const rangos = [
    [ minValue        , interval    ],
    [ interval+1      , interval*2  ],
    [ (interval*2)+1  , 3*interval  ],
    [ (interval*3)+1  , 4*interval  ],
    // [ (interval*4)+1  , 5*interval  ]
    [ (interval*4)+1  , maxValue  ]
  ]; */
  const {rangos} = calculoValoresQuintiles(features, fieldValueToSetRangeCoropletico);
  // if(logger()) console.log({features, interval, fieldValueToSetRangeCoropletico, wkid, rangos})
  setRangosLeyenda(rangos);
  let fieldToFixRange;
  features.forEach(feature => {
    const rings = feature.geometry.rings, attributes = feature.attributes;
    fieldToFixRange = attributes[fieldValueToSetRangeCoropletico];
    const polygon = new Polygon({
      rings,
      spatialReference: { wkid }
    });
    // Definir el símbolo basado en un atributo
    let color = [51, 51, 204, 0.5]; // Color por defecto
    /* if (attributes.dataIndicadores) {
      attributes.dataIndicadores.length == 1 ? fieldToFixRange = attributes.dataIndicadores[0].attributes[fieldValueToSetRangeCoropletico]
      : attributes.dataIndicadores.length > 1 ? attributes.dataIndicadores.forEach(dato => {
        if(dato.attributes[fieldValueToSetRangeCoropletico]) fieldToFixRange += dato.attributes[fieldValueToSetRangeCoropletico]
      })
      : '';
    }else{
      fieldToFixRange = attributes[fieldValueToSetRangeCoropletico];      
    }
    if(logger()) console.log({fieldToFixRange}) */
    
    if (!fieldToFixRange){
      color = [255, 255, 255, 0.1];
    }else if (rangos[0][0] <= fieldToFixRange && fieldToFixRange <= rangos[0][1]) {
      color = coloresMapaCoropletico[0].value;
    }else if (rangos[1][0] < fieldToFixRange && fieldToFixRange <= rangos[1][1]) {
      color = coloresMapaCoropletico[1].value;
    }else if (rangos[2][0] < fieldToFixRange && fieldToFixRange <= rangos[2][1]) {
      color = coloresMapaCoropletico[2].value;
    }else if (rangos[3][0] < fieldToFixRange && fieldToFixRange <= rangos[3][1]) {
      color = coloresMapaCoropletico[3].value;
    }else {
      color = coloresMapaCoropletico[4].value;
    }
  
    const graphic = new Graphic({
      geometry: polygon,
      symbol: new SimpleFillSymbol({
        color,
        outline: {
          color: 'white',
          width: 1
        }
      }),
      attributes,
      popupTemplate: {
        title: attributes.mpnombre,
        content: [
          {
            type: "fields",
            fieldInfos: Object.keys(attributes)
            .filter(key => key !== "dataIndicadores") // Filtra la clave específica
            .map(key => ({
              fieldName: key,
              label: key.replace(/_/g, ' ')
            }))
          }
        ]
      }
    });
  
    graphicsLayer.add(graphic);
    jimuMapView.view.map.add(graphicsLayer);
    // tempLastLayerDeployed = [...tempLastLayerDeployed, graphic]
    tempLastLayerDeployed = {
      graphics:[...tempLastLayerDeployed.graphics, graphic],
      graphicsLayers:[...tempLastLayerDeployed.graphicsLayers, graphicsLayer]
    }
    if(logger()) console.log({tempLastLayerDeployed, fieldToFixRange, rangos})
    
  });

  setLastLayerDeployed(tempLastLayerDeployed);

  // Manejar evento de clic para capturar la información del polígono seleccionado
  const handler =  jimuMapView.view.on('click', (event) => {
    jimuMapView.view.hitTest(event).then((response) => {
      if (response.results.length) {
        const graphic = response.results.filter(result => result.graphic.layer === graphicsLayer)[0]?.graphic;
        if (graphic) {
          if(logger()) console.log({'Atributos del polígono seleccionado':graphic.attributes, rangos, fieldValueToSetRangeCoropletico});
          setPoligonoSeleccionado(graphic);
        }
        // Aquí puedes manejar la lógica adicional cuando se selecciona un polígono
      }
    });
  });
  setClickHandler(handler); // Guardar el manejador del evento en el estado
  jimuMapView.view.on('pointer-move', (event) => {
    // console.log('Puntero movido a:', event.mapPoint);
    
  });
  
  /* jimuMapView.view.on('mouse-wheel', (event) => {
    console.log('Rueda del ratón usada para hacer zoom.');
  }); */
  
  /* jimuMapView.view.on('resize', (event) => {
    console.log('El tamaño del mapa ha cambiado.');
  }); */

};

const logger = () => JSON.parse(localStorage.getItem("logger"))?.logger;

/**
 * Remueve los features poligonos dibujados en el mapa
 * @param jimuMapView 
 * @param features 
 */
const removeLayer = (jimuMapView, features: __esri.Layer[]) => {
  features.forEach(f => jimuMapView.view.map.remove(f))
  jimuMapView.view.zoom = jimuMapView.view.zoom -0.00000001;
}


const goToOneExtentAndZoom = ({jimuMapView, extent, duration= 10000}) => {
  // jimuMapView.view.goTo(extent, { duration}, zoom);
  jimuMapView.view.goTo(extent, { duration});
  setTimeout(() => {
    jimuMapView.view.zoom = jimuMapView.view.zoom - 1.5;    
    if(logger())console.log("zoooom",{"jimuMapView.view.zoom":jimuMapView.view.zoom})
  }, 2000);
}

const dibujarPoligonoToResaltar = async ({rings, wkid, attributes, jimuMapView, times, borrar}) => {

  const [SimpleFillSymbol, Polygon, Graphic, GraphicsLayer] = await loadModules([
    'esri/symbols/SimpleFillSymbol', 'esri/geometry/Polygon', 'esri/Graphic', 'esri/layers/GraphicsLayer',], {
    url: 'https://js.arcgis.com/4.29/'
  });
  const graphicsLayer = new GraphicsLayer();
  const polygon = new Polygon({
    rings,
    spatialReference: { wkid }
  });

  const graphic = new Graphic({
    geometry: polygon,
    symbol: new SimpleFillSymbol({
      color:[51, 51, 204, 0.5],
      outline: {
        color: 'red',
        width: 3
      }
    }),
    attributes,
    popupTemplate: {
      title: "Metadata",
      content: [
        {
          type: "fields",
          fieldInfos: Object.keys(attributes)
          .filter(key => key !== "dataIndicadores") // Filtra la clave específica
          .map(key => ({
            fieldName: key,
            label: key.replace(/_/g, ' ')
          }))
        }
      ]
    }
  });

  graphicsLayer.add(graphic);
  jimuMapView.view.map.add(graphicsLayer);

  let blinkCount = 0;
  let render = true;
  const intervalos = 6;
  const interval = setInterval(() => {
    if (blinkCount < intervalos) {
      if (render) {
        jimuMapView.view.map.add(graphicsLayer);
        render = !render
      } else {
        jimuMapView.view.map.remove(graphicsLayer);
        render = !render
      }
      blinkCount++;
    } else {
      clearInterval(interval); // Detiene el intervalo después de 3 veces
      jimuMapView.view.map.remove(graphicsLayer);
    }
  }, 1500); // Intervalo de 1.5 segundo

}

export {
  moduleExportToCSV,
  loadEsriModules,
  calculateExtent,
  createSymbol,
  createGeometry,
  renderLayer,
  realizarConsulta,
  pintarFeatureLayer,
  queryAttributesLayer,
  ajustarDataToRender,
  logger,
  removeLayer,
  goToOneExtentAndZoom,
  dibujarPoligonoToResaltar,
  dibujarPoligono,
  // rangosCoropleticos
}
import React, { useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
import { Point, Polygon, Polyline } from '@arcgis/core/geometry';

let idLastGraphicDeployedTest = '';
let clickHandler = null;

/**
 * Componente SelectWidget
 * @param {Object} props - Propiedades del componente
 */
const SelectWidget = ({ props }) => {
  const [drawing, setDrawing] = useState(true);
  const [mostrarResultadoFeaturesConsulta, setMostrarResultadoFeaturesConsulta] = useState(false);
  const [widgetModules, setWidgetModules] = useState(null);
  const [rows, setRows] = useState<Row[]>([])
  const [columns, setColumns] = useState<InterfaceColumns[]>([]);
  const [lastGeometriDeployed, setLastGeometriDeployed] = useState();
  const [LayerSelectedDeployed, setLayerSelectedDeployed] = useState(null);
  const [graphicsLayerDeployed, setGraphicsLayerDeployed] = useState(null);






  const startPointRef = useRef(null);
  const endPointRef = useRef(null);
  const graphicsLayerRef = useRef(null);

  /**
   * Maneja el clic en el mapa
   * @param {Object} Graphic - Módulo Graphic de ArcGIS
   * @param {Object} event - Evento de clic en el mapa
   * @param {Object} Extent - Módulo Extent de ArcGIS
   */
  const handleMapClick = (Graphic, event, Extent) => {
    if (!drawing) return;
    if (!startPointRef.current) {
      startPointRef.current = event.mapPoint;
    } else {
      endPointRef.current = event.mapPoint;
      drawRectangle(Graphic);
      queryFeatures(Extent);
      clickHandler.remove();
      startPointRef.current = null;
      props.jimuMapView.view.container.style.cursor = 'default';
    }
  };

  /**
   * Dibuja un rectángulo en el mapa
   * @param {Object} Graphic - Módulo Graphic de ArcGIS
   */
  const drawRectangle = (Graphic) => {
    const startPoint = startPointRef.current;
    const endPoint = endPointRef.current;
    const extent = {
      xmin: Math.min(startPoint.x, endPoint.x),
      ymin: Math.min(startPoint.y, endPoint.y),
      xmax: Math.max(startPoint.x, endPoint.x),
      ymax: Math.max(startPoint.y, endPoint.y),
      spatialReference: startPoint.spatialReference,
    };

    const rectangleGraphic = new Graphic({
      geometry: { type: 'extent', ...extent },
      symbol: {
        type: 'simple-fill',
        color: [51, 51, 204, 0.5],
        style: 'solid',
        outline: { color: 'white', width: 1 },
      },
    });

    graphicsLayerRef.current.add(rectangleGraphic);

    setTimeout(() => {
      graphicsLayerRef.current.remove(rectangleGraphic);
    }, 1000);
  };

  /**
   * Consulta las características dentro del rectángulo dibujado
   * @param {Object} Extent - Módulo Extent de ArcGIS
   */
  const queryFeatures = async (Extent) => {
    const startPoint = startPointRef.current;
    const endPoint = endPointRef.current;
    const extent = new Extent({
      xmin: Math.min(startPoint.x, endPoint.x),
      ymin: Math.min(startPoint.y, endPoint.y),
      xmax: Math.max(startPoint.x, endPoint.x),
      ymax: Math.max(startPoint.y, endPoint.y),
      spatialReference: startPoint.spatialReference,
    });

    const layersMaps = props.jimuMapView.view.layerViews.items.filter(
      (e: { layer: { parsedUrl: string; }; }) => e.layer.parsedUrl && e.layer.parsedUrl !== 'https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/CartografiaBasica/MapServer/74'
    );

    const lastLayer = layersMaps[layersMaps.length - 1];
    const layer = props.jimuMapView.view.map.findLayerById(lastLayer.layer.id);

    const query = layer.createQuery();
    query.geometry = extent;
    query.spatialRelationship = 'intersects';
    query.returnGeometry = true;
    query.outFields = ['*'];

    const resp = await layer.queryFeatures(query);
    if(resp.features.length < 1) return
    const DataOrderToRows = ordenarDataRows(resp);
    setRows(DataOrderToRows.filas);
    setColumns(DataOrderToRows.dataGridColumns)
    setTimeout(() => {
      setMostrarResultadoFeaturesConsulta(true)      
    }, 10);
    drawFeaturesOnMap(resp);
  };

  /**
   * Dibuja las características en el mapa
   * @param {Object} response - Respuesta de la consulta de características
   */
  const drawFeaturesOnMap = async (response) => {
    const { features, spatialReference } = response;
    if (!props.jimuMapView || features.length === 0) return;
    if (idLastGraphicDeployedTest) {
      props.jimuMapView.view.map.remove(props.jimuMapView.view.map.findLayerById(idLastGraphicDeployedTest));
    }

    const [GraphicsLayer, PopupTemplate, SimpleFillSymbol, SimpleLineSymbol, Graphic, SimpleMarkerSymbol] = await loadModules(
      ['esri/layers/GraphicsLayer', 'esri/PopupTemplate', 'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/Graphic', 'esri/symbols/SimpleMarkerSymbol'],
      { url: 'https://js.arcgis.com/4.29/' }
    );

    const graphicsLayer = new GraphicsLayer();
    let geometryType = null;

    features.forEach((feature) => {
      geometryType = feature.geometry.type;
      const popupTemplate = new PopupTemplate({
        title: "Feature Info",
        content: `
          <ul>
            ${Object.keys(feature.attributes).map(key => `<li><strong>${key}:</strong> ${feature.attributes[key]}</li>`).join('')}
          </ul>
        `,
      });

      let symbol = null, geometry = null;

      if (feature.geometry.type === 'point') {
        geometry = new Point({ x: feature.geometry.x, y: feature.geometry.y, spatialReference });
        const outline = new SimpleLineSymbol({ color: [255, 255, 0], width: 1 });
        symbol = new SimpleMarkerSymbol({ color: [255, 0, 0], outline, size: '8px' });
      } else if (feature.geometry.type === 'polyline') {
        geometry = new Polyline({ paths: feature.geometry.paths, spatialReference });
        symbol = { type: 'simple-fill', color: "orange", outline: { color: "magenta", width: 0.5 } };
      } else if (feature.geometry.type === 'polygon') {
        geometry = new Polygon({ rings: feature.geometry.rings, spatialReference });
        symbol = new SimpleFillSymbol({ color: "blue", outline: new SimpleLineSymbol({ color: "darkblue", width: 0.5 }) });
      }

      const graphic = new Graphic({ geometry, symbol, attributes: feature.attributes, popupTemplate });
      graphicsLayer.add(graphic);
    });

    props.jimuMapView.view.map.add(graphicsLayer);
    setLayerSelectedDeployed(graphicsLayer);
    // setLastGeometriDeployed(graphicsLayer);
    idLastGraphicDeployedTest = graphicsLayer.id;
    props.jimuMapView.view.goTo({
      target: graphicsLayer.graphics.items[0].geometry,
      zoom: geometryType === "polygon" ? 10 : geometryType === "polyline" ? 10 : 15
    });

    setDrawing(false);
  };

  /**
   * Limpia la capa de gráficos
   */
  const clearGraphicsLayer = () => {
    if (idLastGraphicDeployedTest) {
      const layer = props.jimuMapView.view.map.findLayerById(idLastGraphicDeployedTest);
      props.jimuMapView.view.map.remove(layer);
      props.jimuMapView.view.goTo(props.jimuMapView.view.extent);
      idLastGraphicDeployedTest = '';
      props.jimuMapView.view.container.style.cursor = 'default';
    }
  };

  /**
   * Alterna el estado de dibujo
   */
  const toggleDrawing = () => {
    setDrawing(!drawing);
  };

  useEffect(() => {
    if (!props.jimuMapView || !drawing) return;

    loadModules(['esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/geometry/Extent'], { url: 'https://js.arcgis.com/4.29/' })
      .then(([Graphic, GraphicsLayer, Extent]) => {
        const graphicsLayer = new GraphicsLayer();
        props.jimuMapView.view.map.add(graphicsLayer);
        graphicsLayerRef.current = graphicsLayer;

        const handleClick = (event) => {
          if (drawing) {
            handleMapClick(Graphic, event, Extent);
          }
        };
        props.jimuMapView.view.container.style.cursor = 'crosshair';
        clickHandler = props.jimuMapView.view.on('click', handleClick);
      })
      .catch(err => console.error('Error loading ArcGIS modules:', err));

    return () => {
      if (clickHandler) {
        clickHandler.remove();
      }
    };
  }, [drawing]);

  useEffect(() => {
    import('../../../../commonWidgets/widgetsModule').then(modulo => setWidgetModules(modulo));
    props.jimuMapView.view.container.style.cursor = 'crosshair';
    return () => {};
  }, []);

  return (
    <div className="w-100 p-3 bg-primary">
      
      {
        mostrarResultadoFeaturesConsulta
        ? widgetModules.TABLARESULTADOS({
            rows,
            columns,
            jimuMapView:props.jimuMapView,
            lastGeometriDeployed,
            LayerSelectedDeployed,
            graphicsLayerDeployed,
            setLastGeometriDeployed,
            setMostrarResultadoFeaturesConsulta
          })
          : <>
            <p style={{ color: 'black' }}>Haga clic en el mapa para capturar el primer punto y luego haga clic nuevamente para capturar el segundo punto.</p>
            <div className='fila mt-1'>
              <button onClick={toggleDrawing}>
                {drawing ? 'Detener selección' : 'Iniciar selección'}
              </button>
              <button onClick={clearGraphicsLayer}>
                Limpiar selección
              </button>
            </div>
          </>
      }
    </div>
  );
};

export default SelectWidget;

const ordenarDataRows = ({features}) => {
  
  const dataGridColumns = Object.keys(features[0].attributes).map(key => ({ key: key, name: key }));
  const filas = features.map(({ attributes, geometry }) => ({ ...attributes, geometry }));    
  console.log(dataGridColumns)
  console.log(filas)
  return {filas, dataGridColumns};
}

export interface Row {
  id: number;
  title: string;
  geometry?: InterfaceGeometry
}

export interface InterfaceGeometry {
  rings: Array<Array<number[]>>;
}

export interface InterfaceColumns {
  key:  string;
  name: string;
}
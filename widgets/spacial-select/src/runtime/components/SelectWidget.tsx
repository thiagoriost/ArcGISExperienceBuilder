import React, { useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
import { JimuMapView } from 'jimu-arcgis';
import { Point, Polygon, Polyline } from '@arcgis/core/geometry';

let idLastgraphicDeployedTest = '';
let clickHandler=null;

const SelectWidget = ({ props }) => {

  const [drawing, setDrawing] = useState(true);
  const startPointRef = useRef(null);
  const endPointRef = useRef(null);
  const graphicsLayerRef = useRef<__esri.GraphicsLayer>(null);

  const handleMapClick = (Graphic, event, Extent) => {
    console.log("handleMapClick")
    if(!drawing) return
    if (!startPointRef.current) {
      // First click - set the start point
      startPointRef.current = event.mapPoint;
    } else {
      // Second click - set the end point and draw the rectangle
      endPointRef.current = event.mapPoint;
      // clearGraphicsLayer();
      drawRectangle(Graphic);
      queryFeatures(Extent);
      clickHandler.remove();
      // Reset the start point for the next rectangle
      startPointRef.current = null;
      props.jimuMapView.view.container.style.cursor = 'default'; // Cambia el cursor al capturar el primer punto

    }
  };

  const drawRectangle = (Graphic) => {
    const startPoint = startPointRef.current;
    const endPoint = endPointRef.current;
    const extent = {
      xmin: Math.min(startPoint.x, endPoint.x),
      ymin: Math.min(startPoint.y, endPoint.y),
      xmax: Math.max(startPoint.x, endPoint.x),
      ymax: Math.max(startPoint.y, endPoint.y),
      spatialReference: startPoint.spatialReference
    };

    const rectangleGraphic = new Graphic({
      geometry: {
        type: 'extent',
        ...extent
      },
      symbol: {
        type: 'simple-fill',
        color: [51, 51, 204, 0.5],
        style: 'solid',
        outline: {
          color: 'white',
          width: 1
        }
      }
    });

    graphicsLayerRef.current.add(rectangleGraphic);

    // Eliminar el rectángulo después de 1 segundo
    setTimeout(() => {
      graphicsLayerRef.current.remove(rectangleGraphic);
    }, 1000);
  };

  const queryFeatures = async ( Extent) => {
    // clearGraphicsLayer();
    const startPoint = startPointRef.current;
    const endPoint = endPointRef.current;
    const extent = new Extent({
      xmin: Math.min(startPoint.x, endPoint.x),
      ymin: Math.min(startPoint.y, endPoint.y),
      xmax: Math.max(startPoint.x, endPoint.x),
      ymax: Math.max(startPoint.y, endPoint.y),
      spatialReference: startPoint.spatialReference
    });

    const layersMaps = props.jimuMapView.view.layerViews.items.filter(e => (e.layer.parsedUrl != 'https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/CartografiaBasica/MapServer/74' && e.layer.parsedUrl));
    const lastLayer = layersMaps[layersMaps.length - 1];
    const layer = props.jimuMapView.view.map.findLayerById(lastLayer.layer.id); // Replace with your layer ID
    // layer.when(()=>{})
    const query = layer.createQuery();
    query.geometry = extent;
    query.spatialRelationship = 'intersects';
    query.returnGeometry = true;
    query.outFields = ['*'];
       
    const resp = await layer.queryFeatures(query);
    console.log(resp)
    drawFeaturesOnMap(resp)
  };

  const drawFeaturesOnMap = async (response) => {

    const { features, spatialReference } = response;
    if (!props.jimuMapView || features.length === 0 || !response) return;
    if (idLastgraphicDeployedTest) props.jimuMapView.view.map.remove(props.jimuMapView.view.map.findLayerById(idLastgraphicDeployedTest));
    
    const [GraphicsLayer, PopupTemplate, SimpleFillSymbol, SimpleLineSymbol, Graphic, SimpleMarkerSymbol] = await loadModules(
      ['esri/layers/GraphicsLayer', 'esri/PopupTemplate', 'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol',
        'esri/Graphic', 'esri/symbols/SimpleMarkerSymbol'
    ], {
      url: 'https://js.arcgis.com/4.29/'
    });

      const graphicsLayer = new GraphicsLayer();
      let typerGeometry=null;
      features.forEach((feature) => {
        typerGeometry=feature.geometry.type;
        const popupTemplate = new PopupTemplate({
          title: "Feature Info",
          content: `
              <ul>
                ${Object.keys(feature.attributes).map(key => `<li><strong>${key}:</strong> ${feature.attributes[key]}</li>`).join('')}
              </ul>
            `
        });
  
        let symbol = null, geometry= null; 

        if (feature.geometry.type == 'point') {
          geometry = new Point({ x: feature.geometry.x, y: feature.geometry.y, spatialReference });
          const outline = new SimpleLineSymbol({ color: [255, 255, 0], width: 1 });
          symbol = new SimpleMarkerSymbol({ color: [255, 0, 0],outline, size: '8px'});
        } else if(feature.geometry.type == "polyline") {
          geometry = new Polyline({ paths: feature.geometry.paths,spatialReference, hasZ: false, hasM: true,});
          symbol = {type:'simple-fill',color:"orange",outline:{color:"magenta",width:0.5}};
        } else if(feature.geometry.type == 'polygon') {
          geometry = new Polygon({ rings: feature.geometry.rings, spatialReference });
          symbol = new SimpleFillSymbol({ color: "blue", outline: new SimpleLineSymbol({ color: "darkblue", width: 0.5 }) });
        }

        const graphic = new Graphic({ geometry, symbol, attributes: feature.attributes, popupTemplate });
  
        graphicsLayer.add(graphic);
      });
  
      props.jimuMapView.view.map.add(graphicsLayer);
      
      idLastgraphicDeployedTest = graphicsLayer.id
      
      props.jimuMapView.view.goTo({
        target: graphicsLayer.graphics.items[0].geometry,
        zoom:typerGeometry=="polygon"?10:typerGeometry=="polyline"?10:15 
      });
      setDrawing(false); // deshabilita select
  };

  const clearGraphicsLayer = () => {
    console.log("clearGraphicsLayert")
    if (idLastgraphicDeployedTest){
      const layer = props.jimuMapView.view.map.findLayerById(idLastgraphicDeployedTest)
      props.jimuMapView.view.map.remove(layer);
      // props.jimuMapView.view.goTo(layer.fullExtent)
      props.jimuMapView.view.goTo(props.jimuMapView.view.extent)
      idLastgraphicDeployedTest = ''
      props.jimuMapView.view.container.style.cursor = 'default'; // Cambia el cursor al capturar el primer punto
    } 
  };

  const toggleDrawing = () => {
    setDrawing(!drawing);
  };

  useEffect(() => {
    if (!props.jimuMapView || !drawing) return;
    // Load required ArcGIS modules
    loadModules([
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
      'esri/geometry/Extent'
    ], {
      url: 'https://js.arcgis.com/4.29/'
    })
      .then(([Graphic, GraphicsLayer, Extent]) => {
        const graphicsLayer = new GraphicsLayer();
        props.jimuMapView.view.map.add(graphicsLayer);
        graphicsLayerRef.current = graphicsLayer;

        // Handle map click
        const handleClick = (event) => {
          if (drawing) {
            handleMapClick(Graphic, event, Extent);
          }
        };
        props.jimuMapView.view.container.style.cursor = 'crosshair'; // Cambia el cursor al capturar el primer punto
        clickHandler = props.jimuMapView.view.on('click', handleClick);
       
      })
      .catch(err => console.error('Error loading ArcGIS modules:', err));
  }, [drawing]);

  useEffect(() => {
    props.jimuMapView.view.container.style.cursor = 'crosshair'; // Cambia el cursor al capturar el primer punto  
    return () => {}
  }, [])
  

  return (
    <div>
      <p style={{color:'black'}}>Haga clic en el mapa para capturar el primer punto y luego haga clic nuevamente para capturar el segundo punto.</p>
      <div className='fila'>
        <button onClick={toggleDrawing}>
          {drawing ? 'Stop Drawing' : 'Start Drawing'}
        </button>
        <button onClick={clearGraphicsLayer}>
          Limpiar selección
        </button>
      </div>
    </div>
  );
};


export default SelectWidget;

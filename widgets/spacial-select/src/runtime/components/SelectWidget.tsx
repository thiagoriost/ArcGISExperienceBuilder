import React, { useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
import { JimuMapView } from 'jimu-arcgis';
import { Polygon } from '@arcgis/core/geometry';

let idLastgraphicDeployedTest = ''

const SelectWidget = ({ props }) => {

  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(props.jimuMapView);
  const [drawing, setDrawing] = useState(false);
  const startPointRef = useRef(null);
  const endPointRef = useRef(null);
  const graphicsLayerRef = useRef<__esri.GraphicsLayer>(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [graphicsLayerDeployed, setGraphicsLayerDeployed] = useState(null);
  const [idLastgraphicDeployed, setIdLastgraphicDeployed] = useState<string>('');


  useEffect(() => {
    if (!jimuMapView) return;

    // Load required ArcGIS modules
    loadModules([
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
      'esri/PopupTemplate',
      'esri/geometry/Extent'
    ], {
      url: 'https://js.arcgis.com/4.29/'
    })
      .then(([Graphic, GraphicsLayer, PopupTemplate, Extent]) => {
        const graphicsLayer = new GraphicsLayer();
        jimuMapView.view.map.add(graphicsLayer);
        graphicsLayerRef.current = graphicsLayer;

        // Handle map click
        const handleClick = (event) => {
          if (drawing) {
            handleMapClick(Graphic, PopupTemplate, event, Extent);
          }
        };

        jimuMapView.view.on('click', handleClick);

      })
      .catch(err => console.error('Error loading ArcGIS modules:', err));
  }, [drawing]);

  const handleMapClick = (Graphic, PopupTemplate, event, Extent) => {
    if (!startPointRef.current) {
      // First click - set the start point
      startPointRef.current = event.mapPoint;
    } else {
      // Second click - set the end point and draw the rectangle
      endPointRef.current = event.mapPoint;
      clearGraphicsLayer();
      drawRectangle(Graphic);
      queryFeatures(PopupTemplate, Extent);
      // Reset the start point for the next rectangle
      startPointRef.current = null;
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

  const queryFeatures = async ( PopupTemplate, Extent) => {
    clearGraphicsLayer();
    const startPoint = startPointRef.current;
    const endPoint = endPointRef.current;
    const extent = new Extent({
      xmin: Math.min(startPoint.x, endPoint.x),
      ymin: Math.min(startPoint.y, endPoint.y),
      xmax: Math.max(startPoint.x, endPoint.x),
      ymax: Math.max(startPoint.y, endPoint.y),
      spatialReference: startPoint.spatialReference
    });

    const layersMaps = jimuMapView.view.layerViews.items.filter(e => (e.layer.parsedUrl != 'https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/CartografiaBasica/MapServer/74' && e.layer.parsedUrl));
    const lastLayer = layersMaps[layersMaps.length - 1];
    console.log(lastLayer.layer.id)
    console.log(lastLayer.layer.parsedUrl.path)
    const layer = jimuMapView.view.map.findLayerById(lastLayer.layer.id); // Replace with your layer ID
    console.log(layer)
    // layer.when(()=>{})
    const query = layer.createQuery();
    query.geometry = extent;
    query.spatialRelationship = 'intersects';
    query.returnGeometry = true;
    query.outFields = ['*'];
       
    const resp = await layer.queryFeatures(query);
    console.log(resp)
    drawFeaturesOnMap(resp)
    /* layer.queryFeatures(query).then(result => {
      
      console.log(result)
      setSelectedFeatures(result.features);
      const selectedGraphics = result.features.map(feature => {
        feature.symbol = {
          type: 'simple-fill',
          color: [0, 255, 0, 0.5],
          style: 'solid',
          outline: {
            color: 'white',
            width: 1
          }
        };
        feature.popupTemplate = new PopupTemplate({
          title: '{OBJECTID}',
          content: [{
            type: 'fields',
            fieldInfos: [
              { fieldName: 'DEPARTAMEN', label: 'Departamento' },
              { fieldName: 'MUNICIPIO', label: 'Municipio' },
              { fieldName: 'PCC', label: 'PCC' },
              { fieldName: 'VEREDA', label: 'Vereda' }
            ]
          }]
        });
        return new Graphic(feature);
      });

      graphicsLayerRef.current.addMany(selectedGraphics);
    }); */
  };

  const drawFeaturesOnMap = async (response) => {

    const { features, spatialReference } = response;
    if (!jimuMapView || features.length === 0 || !response) return;


    /* const [
      Graphic, GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Point, Extent, PopupTemplate
    ] = await utilsModule.loadEsriModules(); */

    console.log({graphicsLayerDeployed}, {idLastgraphicDeployedTest})
    console.log(jimuMapView.view.graphics)
    if (idLastgraphicDeployedTest) {
      console.log("have data")
      jimuMapView.view.map.remove(jimuMapView.view.map.findLayerById(idLastgraphicDeployedTest))
    } else {
      console.log("haven't data")
    }

    const [GraphicsLayer, PopupTemplate, SimpleFillSymbol,
      SimpleLineSymbol, Graphic] = await loadModules(['esri/layers/GraphicsLayer', 'esri/PopupTemplate',
      'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/Graphic'
    ], {
      url: 'https://js.arcgis.com/4.29/'
    });

    // setTimeout(() => {
      const graphicsLayer = new GraphicsLayer();
        
      features.forEach((feature) => {
  
        const polygon = new Polygon({
          rings: feature.geometry.rings,
          spatialReference: spatialReference
        });
  
        const popupTemplate = new PopupTemplate({
          title: "Feature Info",
          content: `
              <ul>
                ${Object.keys(feature.attributes).map(key => `<li><strong>${key}:</strong> ${feature.attributes[key]}</li>`).join('')}
              </ul>
            `
        });
  
        const SYMBOL = new SimpleFillSymbol({
          color: "blue", // Amarillo con transparencia
          outline: new SimpleLineSymbol({
            color: "darkblue",
            width: 0.5
          })
        });
  
        const graphic = new Graphic({
          geometry: polygon,
          // symbol: {
          //   type: 'simple-fill',
          //   color: "blue",
          //   outline: {
          //     color: "darkblue",
          //     width: 0.5
          //   }
          // },
          symbol: SYMBOL,
          attributes: feature.attributes,
          popupTemplate: popupTemplate
        });
  
        graphicsLayer.add(graphic);
      });
  
      jimuMapView.view.map.add(graphicsLayer);
      console.log(graphicsLayer.id)
      // setTimeout(() => {
      //   jimuMapView.view.map.remove(graphicsLayer)
      // }, 4000);
      setIdLastgraphicDeployed(graphicsLayer.id);
      idLastgraphicDeployedTest = graphicsLayer.id
      
      jimuMapView.view.goTo({
        target: graphicsLayer.graphics.items[0].geometry,
        zoom: 10 
      });
      
    // }, 3000);



   /*  loadModules([
      'esri/layers/GraphicsLayer', 'esri/PopupTemplate',
      'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/Graphic',
    ]).then(([GraphicsLayer, PopupTemplate, SimpleFillSymbol,
      SimpleLineSymbol, Graphic]) => {
      const graphicsLayer = new GraphicsLayer();
      
      features.forEach((feature) => {
  
        const polygon = new Polygon({
          rings: feature.geometry.rings,
          spatialReference: spatialReference
        });
  
        const popupTemplate = new PopupTemplate({
          title: "Feature Info",
          content: `
              <ul>
                ${Object.keys(feature.attributes).map(key => `<li><strong>${key}:</strong> ${feature.attributes[key]}</li>`).join('')}
              </ul>
            `
        });
  
        const SYMBOL = new SimpleFillSymbol({
          color: "blue", // Amarillo con transparencia
          outline: new SimpleLineSymbol({
            color: "darkblue",
            width: 0.5
          })
        });
  
        const graphic = new Graphic({
          geometry: polygon,
          // symbol: {
          //   type: 'simple-fill',
          //   color: "blue",
          //   outline: {
          //     color: "darkblue",
          //     width: 0.5
          //   }
          // },
          symbol: SYMBOL,
          attributes: feature.attributes,
          popupTemplate: popupTemplate
        });
  
        graphicsLayer.add(graphic);
      });
  
      jimuMapView.view.map.add(graphicsLayer);
      console.log(graphicsLayer)
      // setTimeout(() => {
      //   jimuMapView.view.map.remove(graphicsLayer)
      // }, 4000);
      setGraphicsLayerDeployed(graphicsLayer);
      
      jimuMapView.view.goTo({
        target: graphicsLayer.graphics.items[0].geometry,
        zoom: 10 
      });
      // setIsLoading(false);
      
    }) */


  };

  const clearGraphicsLayer = () => {
    console.log("clearGraphicsLayer")
    if (graphicsLayerDeployed) {
      graphicsLayerRef.current.removeAll();
      setSelectedFeatures([]);
      if(graphicsLayerDeployed?.graphics.items.length > 0){
        jimuMapView.view.map.removeAll()
        setGraphicsLayerDeployed([])
      }      
    }
  };

  const toggleDrawing = () => {
    setDrawing(!drawing);
  };

  

  useEffect(() => {
    console.log(jimuMapView.view.graphics)
  
    return () => {}
  }, [])
  

  return (
    <div>
      <button onClick={toggleDrawing}>
        {drawing ? 'Stop Drawing' : 'Start Drawing'}
      </button>
      <button onClick={clearGraphicsLayer}>
        Clear Selection
      </button>
      <p>Click twice to draw a rectangle on the map</p>
    </div>
  );
};


export default SelectWidget;

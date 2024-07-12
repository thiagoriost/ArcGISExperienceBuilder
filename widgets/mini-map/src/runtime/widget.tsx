import { React, AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { useEffect, useRef, useState } from "react";
import { loadModules } from "esri-loader";
import '../styles/style.css'
const Widget = (props: AllWidgetProps<any>) => {
  const [mapView, setJimuMapView] = useState<JimuMapView>();
  const [initialExtent, setInitialExtent] = useState(null);
  const [miniMapView, setMiniMapView] = useState(null);
  const miniMapDiv = useRef(null);

  
    
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
      setInitialExtent(jmv.view.extent); // Guarda el extent inicial
    }
  };

  useEffect(() => {
    if (mapView && miniMapDiv.current) {
      loadModules(['esri/views/MapView', 'esri/WebMap', 'esri/Graphic', 'esri/geometry/Extent'])
        .then(([MapView, WebMap, Graphic, Extent]) => {
          const webMap = new WebMap({
            portalItem: {
              id: mapView.view.map.portalItem.id // Utiliza el mismo WebMap que el mapa principal
            }
          });

          const miniView = new MapView({
            container: miniMapDiv.current,
            map: webMap,
            center: mapView.view.center,
            zoom: mapView.view.zoom - 0 // Ajusta el nivel de zoom para la vista general
          });

          miniView.when(() => {
            const updateMiniMap = () => {
              miniView.graphics.removeAll();
              const extent = mapView.view.extent;
              const graphic = new Graphic({
                geometry: extent,
                symbol: {
                  type: "simple-fill",
                  color: [0, 0, 0, 0],
                  outline: {
                    color: [255, 255, 0],
                    width: 2
                  }
                }
              });
              miniView.graphics.add(graphic);
              miniView.goTo(extent.expand(1.5));
            };

            updateMiniMap();
            mapView.view.watch('stationary', updateMiniMap);

            setMiniMapView(miniView);
          });
        });
    }
  }, [mapView]);
    
    return (
      <div  className="w-100 p-3 bg-primary text-white widget-minimap">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
        )}
        
        <div ref={miniMapDiv} style={{ width: '200px', height: '230px' }}></div>
        
      </div>
    );
  };
  
  export default Widget;
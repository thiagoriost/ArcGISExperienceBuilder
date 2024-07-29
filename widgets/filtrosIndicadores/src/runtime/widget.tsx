import { React, AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { useEffect, useState } from "react";

const Widget = (props: AllWidgetProps<any>) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [initialExtent, setInitialExtent] = useState(null);
  const [widgetModules, setWidgetModules] = useState(null);


  
    
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
      setInitialExtent(jmv.view.extent); // Guarda el extent inicial
    }
  };

  useEffect(() => {
      import('../../../commonWidgets/widgetsModule').then(modulo => setWidgetModules(modulo));
      return () => {
        // Acción a realizar cuando el widget se cierra.
        console.log('El widget se cerrará');
      };
  }, []);
    
    return (
      <div  className="w-100 p-3 bg-primary text-white">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
        )}
        {
          widgetModules && widgetModules.FILTROS_INDICADORES(props.dispatch)
        }
      </div>
    );
  };
  
  export default Widget;
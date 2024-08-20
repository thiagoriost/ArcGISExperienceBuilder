import { React, AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { useEffect, useState } from "react";
// import "../styles/styles.css"
import "../styles/style.css"

const Widget = (props: AllWidgetProps<any>) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [initialExtent, setInitialExtent] = useState(null);
  const [widgetModules, setWidgetModules] = useState(null);
  const [servicios, setServicios] = useState(null);
  const [utilsModule, setUtilsModule] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);

  
    
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
      setInitialExtent(jmv.view.extent); // Guarda el extent inicial
    }
  };

  const getDepartamentos = async (url: string) => {
    const dataResponse = await utilsModule.queryAttributesLayer({url:url+"/query", definitionExpression:"1=1", returnGeometry:false,outFields:"*"});   
    const departAjustadosToRender = utilsModule.ajustarDataToRender(dataResponse,"decodigo","denombre");
    if (utilsModule.logger()) console.log({departAjustadosToRender})
    setDepartamentos(departAjustadosToRender)
  }

  useEffect(() => {
    if (!jimuMapView) return
    setTimeout(() => {
      getDepartamentos(servicios.urls.Departamentos);      
    }, 2000);
    return () => {}
  }, [jimuMapView])

  useEffect(() => {
      import('../../../commonWidgets/widgetsModule').then(modulo => setWidgetModules(modulo));
      import('../../../utils/module').then(modulo => setUtilsModule(modulo));
      import('../../../api/servicios').then(modulo => setServicios(modulo));
      return () => {};
  }, []);
    
    return (
      <div  className="w-100 p-3 bg-primary text-white contendorTabFiltroIndicadores">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
        )}
        {
          widgetModules && widgetModules.FILTROS_INDICADORES(props.dispatch, departamentos, jimuMapView)
        }
      </div>
    );
  };
  
  export default Widget;



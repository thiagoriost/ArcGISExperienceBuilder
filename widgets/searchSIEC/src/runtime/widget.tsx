
import { React, AllWidgetProps, extensionSpec } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { useEffect, useRef } from "react";

//Componente sketch - 2025-05-02
//"esri/widgets/Sketch";
import Sketch  from "@arcgis/core/widgets/Sketch";
//Componente GraphicsLayer - 2025-05-02
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
//Componente Extent - 2025-05-02
import Extent from "@arcgis/core/geometry/Extent";

//Importación componentes personalizados
//Componente Filters Búsqueda Firmas (FiltersSrcSIEC)
import FiltersSrcSIEC from "./components/FiltersSrcSIEC";
//Componente TablaResultSrcSIEC
import TablaResultSrcSIEC from "./components/tablaResultSrcSIEC";
//Componente DialogsSrcSIEC
import DialogsSrcSIEC from "./components/dialogsSrcSIEC";
import { appActions } from 'jimu-core'

//Importación estilos
import '../styles/style.css';
import _ from "lodash";

//Importación interfaces
import { InterfaceResponseBusquedaFirmas, InterfaceMensajeModal, typeMSM } from "../types/InterfaceResponseBusquedaFirmas";

//Importación utilidades 
//Utilidades webMercator - 2025-05-02
import webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";

//Definición objetos
//Estados
const { useState } = React

/** 
  Sección procesamiento widget => Módulo Widget Búsqueda Firmas Espectrales
  @date 2025-04-01
  @author IGAC - DIP  
  @remarks Procesamiento Widget Principal
*/
const Widget = (props: AllWidgetProps<any>) => {  
 
    //States para procesar data desde servidor remoto
    //Para componente FiltersSrcSIEC (Filtros de la búsqueda)
    const [jsonSERV, setJsonSERV]     = useState ([]);
    const [jsonDpto, setJsonDpto]     = useState ([]);
    const [jsonMpio, setJsonMpio]     = useState ([]);

    
    //2025-04-02 - Control modo coordenadas opc radio componente FiltersSrcSIEC (Filtros de la búsqueda) 
    const [radValueNav, setValueNav]  = useState <string>("selArea");

    //2025-04-08 - Control cobertura componente FiltersSrcSIEC (Filtros de la búsqueda)
    const [selCoberVal, setCober] = useState <number>();

    //2025-04-22 - Listado de coberturas para filtro asociado
    const [coberLst, setCoberLst] = useState ([]);

    //2025-04-02 - Coordenadas latitud, longitud (Toda precisión cálculo)      
    //Pto
    const [txtValorLat, setValorLat]  = useState <string>("");  
    const [txtValorLon, setValorLon]  = useState <string>("");  
    
    //Polígono
    const [txtValorLatSupIzq, setValorLatSupIzq] = useState <string>("");
    const [txtValorLatInfDer, setValorLatInfDer] = useState <string>("");
    const [txtValorLonSupIzq, setValorLonSupIzq] = useState <string>("");
    const [txtValorLonInfDer, setValorLonInfDer] = useState <string>("");

    //2025-05-14 - Coordenadas extent con polígono medidas como decimales de 3 posiciones (Lon,Lat)
    //Esquina superior izquierda
    const [lonSupIzqFilter, setLonSupIzqFilter] = useState <string>("");
    const [latSupIzqFilter, setLatSupIzqFilter] = useState <string>("");
    //Esquina inferior derecha
    const [lonInfDerFilter, setLonInfDerFilter] = useState <string>("");
    const [latInfDerFilter, setLatInfDerFilter] = useState <string>("");
    
    //2025-05-14 - Coordenadas extent geometría punto como decimales de 3 posiciones (Lon,Lat)
    const [lonPtoFilter, setLonPtoFilter]       = useState <string>("");
    const [latPtoFilter, setLatPtoFilter]       = useState <string>("");
    //2025-04-08 - Control Proyecto componente FiltersSrcSIEC (Filtros de la búsqueda)
    const [selProyVal, setProy]                 = useState<number>();
    
    //2025-04-22 - Listado de proyectos para filtro asociado
    const [proyLst, setProyLst]                 = useState([]);
    
    //2025-04-08 - Control Campaña componente FiltersSrcSIEC (Filtros de la búsqueda)
    const [selCampaVal, setCampa]              = useState<number>();
    
    //2025-04-22 - Listado de campañas para filtro asociado
    const [campaLst, setCampaLst]            = useState([]);

    //2025-04-09 - DataGrid
    const [rows, setRows]                    = useState([]);
    const [paginationModel, setPaginationModel]=useState({
      pageSize: 5,
      page: 0
    });

    //2025-04-11 - cargue de archivos asociados al data Grid
    const [files, setFiles]                   = useState([]);

    //2025-04-15 - Modal asociado a la opción Detalles del data Grid
    const [modalDetail, setModalDetail]       = useState(false);
    //2025-05-16 - Encabezado modal
    const [modalHead, setModalHead]           = useState([]);
    //2025-05-16 - Cuerpo modal
    const [modalBody, setModalBody]           = useState([]);

    //Mapa
    const [jimuMapView, setJimuMapView]       = useState<JimuMapView>(); 
    
    //Extent Map
    const [view, setView]                   = useState(null);
    
    const [ResponseBusquedaFirma, setResponseBusquedaFirma] = useState<InterfaceResponseBusquedaFirmas>();

    const [controlForms, setControlForms] = useState(false);

    //Objeto condición que toma el campo valor del widget - 2024-06-25
    //OJO Para desactivar
    const [cond, setCond]                 = useState("");
    
    //Objeto que maneja el estado cargando - 2024-05-29
    const [isLoading, setIsLoading]       = useState(false);
    const [widgetModules, setWidgetModules]=useState(null);

    //Alert - 2024-06-19
    const [alertDial, setAlertDial]       = useState(false);

    //Modal - 2024-06-20
    const [mensModal, setMensModal]       = useState<InterfaceMensajeModal>({
      deployed: false,
      type: typeMSM.info,
      tittle:'',
      body:'',
      subBody:''
    })

    //Objeto que registra el extent inicial -- 2025-04-23
    const [initialExtent, setInitialExtent] = useState(null);

    //Objeto Sketch state -- 2025-05-02
    const [sketchSt, setSketch]               = useState <Sketch>();
    

    const mapDiv = useRef(null);
    
    
    useEffect(() => {
      console.log("Iniciando Widget...",props.state);  
      console.log("Hook tst =>",ResponseBusquedaFirma);
      if (!ResponseBusquedaFirma)
        return;
      
      //Data Grid
      //Seteo del atributo controlForms, para visualizar el componente DataGrid
      setControlForms(true);
      
      setTimeout(() => {
        setControlForms(true);
      },10);

      //Establecer atributo cargando en falso
      setIsLoading(false);
      //Importación componente ourLoading
      import('../../../commonWidgets/widgetsModule').then(modulo => { setWidgetModules(modulo) })

    },[ResponseBusquedaFirma]);
   


    const activeViewChangeHandler = (jmv: JimuMapView) => {
      let selGraphic = null;
      console.log("Ingresando al evento objeto JimuMapView...");
      if (jmv) {
        setJimuMapView(jmv);
        setInitialExtent(jmv.view.extent);  //Guarda el extent inicial
       
        //Creación capa gráficos - 2025-05-02
        const layerWeb = new GraphicsLayer();
        jmv.view.map.add(layerWeb);

        //Instanciación objeto sketch - 2025-05-02
        const sketchWeb = new Sketch({
          layer: layerWeb,
          view: jmv.view,
          creationMode: "single",
          availableCreateTools: ["rectangle"],
          visibleElements: {
            createTools: {
              point: false, 
              polyline: false, 
              polygon: false, 
              circle: false,
              rectangle: true
            },
            selectionTools: {
              "rectangle-selection": false
            }
          }          
        });
        // console.log("GraphicsLayer length =>",layerWeb.graphics.length);
        //Invocación widget en mapa ubicación inferior derecha, solo cuando se selecciona la opción Seleccionar Area
        console.log("Opc de sel area o navegar =>",radValueNav);
        //Opción Seleccionar Area, habilita el widget Sketch
        if (radValueNav === 'selArea')
        {
          //Al state
          setSketch(sketchWeb);
          //Al mapa
          jmv.view.ui.add(sketchWeb, "bottom-right");
          //Actualización estado - 2025-05-05
          sketchWeb.visible = true;

          console.log("Componente sketch adicionado! =>",sketchWeb.visible);
          
          //Evento que se genera al finalizar dibujo
          sketchWeb.on("create", function(event){
            if (event.state === "complete"){
              const geometry = event.graphic.geometry;
              let ext: Extent;

              //Obtener gráfico del sketch
              selGraphic = sketchWeb.updateGraphics;
              
              //Validaciones de la geometria
              if (geometry.type === "polygon"){
                ext = geometry.extent;
              }
              else if (geometry.type === "extent"){
                ext = geometry as Extent;
              }
              
              if (ext){
                //Visualizar objeto ext, con las propiedades xmin, ymin, xmax, ymax
                /* console.log("Extent es =>",ext);
                console.log("Long, Latitud Top Left (min) =>",webMercatorUtils.xyToLngLat(ext.xmin, ext.ymin));
                console.log("Long, Latitud Bot Right (max) =>",webMercatorUtils.xyToLngLat(ext.xmax, ext.ymax));
                //Coord Rectangulares
                console.log("Coord X Sup Izq =>",ext.xmin);
                console.log("Coord Y Sup Izq =>",ext.ymax);
                console.log("Coord X Inf Der =>",ext.xmax);
                console.log("Coord Y Inf Der =>",ext.ymin); */
                
                //Lat, Long
                //Coordenadas Sup Izq
                const coordTopLeft = webMercatorUtils.xyToLngLat(ext.xmin, ext.ymax);
                //Al state Latitud                
                setValorLatSupIzq(coordTopLeft[1].toString());
                //Al state Longitud                
                setValorLonSupIzq(coordTopLeft[0].toString());
                //Al state Latitud filtro
                setLatSupIzqFilter(coordTopLeft[1].toFixed(3));
                //Al state Longitud filtro
                setLonSupIzqFilter(coordTopLeft[0].toFixed(3));
                //Coordenadas Inf, Der
                const coordBotRight = webMercatorUtils.xyToLngLat(ext.xmax, ext.ymin);
                //Al state Latitud                
                setValorLatInfDer(coordBotRight[1].toString());
                //Al state Longitud
                setValorLonInfDer(coordBotRight[0].toString());
                //Al state Latitud filtro
                setLatInfDerFilter(coordBotRight[1].toFixed(3));
                //Al state Longitud filtro
                setLonInfDerFilter(coordBotRight[0].toFixed(3));

                //Borrado del polígono
                console.log("Objeto gráfico =>",selGraphic);
                if (selGraphic)
                {
                  try{
                    sketchWeb.complete();
                    jmv.view.map.layers.remove (sketchWeb.layer);
                    console.log("Borrado ejecutado!");
                  }
                  catch (error)
                  {
                    if (error.name === 'AbortError')
                    {
                      console.warn("Abort error!!!");
                    }
                    else
                    {
                      console.warn(error);                      
                    }
                  }
                }
              }
            }
          });
        } 
      }
    };

    useEffect(() => {
      
      if (rows.length != 0) {
        console.log({rows})     
        const dataToRender = JSON.stringify({ dataToRows: rows })
        props.dispatch(appActions.widgetStatePropChange('widget_81', 'dataFromDispatchWidget_searchSIEC', dataToRender))   
      }
    
      return () => {}
    }, [rows])
    
    
    return (
      <div className="w-100 p-3 bg-primary text-white">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />          
        )}
        
        {/*Sección diálogo cuando no se cumplan los criterios del widget*/}
        {alertDial
          //? showDialog("No se cumplen los criterios!")
          ? <DialogsSrcSIEC
          setAlertDial={setAlertDial}
          mensModal={mensModal}
          setMensModal={setMensModal}
          ></DialogsSrcSIEC>
          : null
        }
        {/*Si el estado dado en la constante es verdadero (true), invoca componente TablaResultSrcSIEC, el cual renderiza un  DataGrid. De lo contrario, invoca componente FiltersSrcSIEC, el cual renderiza filtros del widget */ }
        {controlForms
          && <TablaResultSrcSIEC
          rows={rows}
          view={view}
          setControlForms={setControlForms}
          jimuMapView={jimuMapView}
          setResponseBusquedaFirma={setResponseBusquedaFirma}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          files={files}
          setFiles={setFiles}
          modalDetail={modalDetail}
          setModalDetail={setModalDetail}
          props={props}
          initialExtent={initialExtent}
          modalHead={modalHead}
          setModalHeadState={setModalHead}
          modalBody={modalBody}
          setModalBodyState={setModalBody}
          jsonDpto={jsonDpto}
          jsonMpio={jsonMpio}
          ></TablaResultSrcSIEC>
        }
        {!controlForms
         && <FiltersSrcSIEC          
          jsonSERV={jsonSERV} 
          setJsonSERV={setJsonSERV}
          selCoberVal={selCoberVal}
          setCoberState={setCober}
          coberLst={coberLst}
          setCoberLst={setCoberLst}
          radValueNav={radValueNav}
          setValueNav={setValueNav}
          txtValorLat={txtValorLat}
          setValorLatState={setValorLat}
          txtValorLatSuIz={txtValorLatSupIzq} 
          setValorLatSuIzState={setValorLatSupIzq}
          txtValorLatInDe={txtValorLatInfDer}
          setValorLatInDeState={setValorLatInfDer}
          txtValorLon={txtValorLon}
          setValorLonState={setValorLon}
          txtValorLonSuIz={txtValorLonSupIzq}
          setValorLonSuIzState={setValorLonSupIzq}
          txtValorLonInDe={txtValorLonInfDer}
          setValorLonInDeState={setValorLonInfDer}
          lonPto={lonPtoFilter}
          setLonPtoState={setLonPtoFilter}
          latPto={latPtoFilter}
          setLatPtoState={setLatPtoFilter}
          lonSuIz={lonSupIzqFilter}
          setLonSuIzState={setLonSupIzqFilter}
          latSuIz={latSupIzqFilter}
          setLatSuIzState={setLatSupIzqFilter}
          lonInDe={lonInfDerFilter}
          setLonInDeState={setLonInfDerFilter}
          latInDe={latInfDerFilter}
          setLatInDeState={setLatInfDerFilter}
          selProyVal={selProyVal}
          setProyState={setProy}
          proyLst={proyLst}
          setProyLst={setProyLst}
          selCampaVal={selCampaVal}
          setCampaState={setCampa}
          campaLst={campaLst}
          setCampaLst={setCampaLst}
          ResponseBusquedaFirma={ResponseBusquedaFirma}
          setResponseBusquedaFirma={setResponseBusquedaFirma}
          view={view}
          setView={setView}
          jimuMapView={jimuMapView}          
          setAlertDial={setAlertDial}
          mensModal={mensModal}
          setMensModal={setMensModal}
          setControlForms={setControlForms}
          controlForms={controlForms}          
          props={props}
          sketchWeb={sketchSt}
          setRows={setRows}
          initialExtent={initialExtent}
          jsonDpto={jsonDpto}
          setJsonDptoState={setJsonDpto}
          jsonMpio={jsonMpio}
          setJsonMpioState={setJsonMpio}
          isLoad={isLoading}
          setIsLoadState={setIsLoading}
          setWidgetModules={setWidgetModules}
          ></FiltersSrcSIEC>                    
        }
        {
          //Renderizado del estado cargando, siempre y cuando el state isLoading sea true
        }
        {
	        isLoading && widgetModules?.OUR_LOADING()
        }
      </div>
    );
  };

  export default Widget;

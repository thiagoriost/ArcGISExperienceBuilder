/** 
  Widget de búsqueda firmas espectrales
  @date 2025-04-01
  @author IGAC - DIP
  @remarks Tomado del visor geográfico, REFA
*/
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


//Módulo para carga de módulos de ESRI externos - 2025-04-07
import { loadModules } from 'esri-loader'

//Importación componentes personalizados
//Componente Filters Búsqueda Firmas (FiltersSrcSIEC)
import FiltersSrcSIEC from "./components/FiltersSrcSIEC";
//Componente TablaResultSrcSIEC
import TablaResultSrcSIEC from "./components/tablaResultSrcSIEC";
//Componente DialogsSrcSIEC
import DialogsSrcSIEC from "./components/dialogsSrcSIEC";

//Importación estilos
import '../styles/style.css';
import _ from "lodash";

//Importación interfaces
import { InterfaceResponseBusquedaFirmas, InterfaceMensajeModal, typeMSM } from "../types/InterfaceResponseBusquedaFirmas";
import { number } from "prop-types";
//Importación utilidades 
//Utilidades webMercator - 2025-05-02
import webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import { uid } from "chart.js/dist/helpers/helpers.core";
//Definición objetos
//Estados
const { useState } = React

//Variables generales -- 2025-04-07
let clickHandler = null

/** 
  Sección procesamiento widget => Módulo Widget Búsqueda Firmas Espectrales
  @date 2025-04-01
  @author IGAC - DIP  
  @remarks Procesamiento Widget Principal
*/
const Widget = (props: AllWidgetProps<any>) => {  
  /** 
    Seccion de declaración del widget principal        
    @date 2025-04-01
    @dateUpdated 2025-04-02
    @changes Incluir coordenadas latitud y longitud desde el mapa, al widget
    @dateUpdated 2025-04-03
    @changes Incluir estados para manejo de opciones "Seleccionar area" y "Navegar"
    @dateUpdated 2025-04-08
    @changes Incluir estados para manejo control Cobertura
    @changes Incluir estados para manejo control Proyecto
    @changes Incluir estados para manejo control Campaña
    @dateUpdated 2025-04-09
    @changes Incluir propiedad pagination para manejo paginación componente dataGrid
    @changes Incluir estados para manejo paginación componente dataGrid
    @dateUpdated 2025-04-15
    @changes Incluir estados para manejo componente Modal, opción Detalles del Data Grid (componente tablaResultSrcSIEC)
    @dateUpdated 2025-04-22
    @changes Incluir estados para manejo listado de proyectos
    @changes Incluir estados para manejo listado de coberturas
    @changes Incluir estados para manejo listado de campañas
    @dateUpdated 2025-05-02
    @changes Incluir componente Sketch
    @changes Incluir state asociado al componente Sketch
    @changes Incluir state asociado al jimuMap
    @dateUpdated 2025-05-05
    @changes Optimización params drawing y setDrawing que no se usan
    @changes Incluir Referencia espacial (SpatialReference) al mapa
    @dateUpdated 2025-05-08
    @changes Envío parámetros rows y setRows al componente tablaResultSrcSIEC
    @dateUpdated 2025-05-09
    @changes Incluir state asociado a coordenadas espaciales rectángulares para polígono y punto
    @dateUpdated 2025-05-12
    @changes Envío parámero props al componente tablaResultSrcSIEC    
    @dateUpdated 2025-05-14
    @changes Envío parámero initialExtent al componente tablaResultSrcSIEC
    @changes Envío parámero initialExtent al componente FiltersSrcSIEC
    @dateUpdated 2025-05-16
    @changes Envío parámero rowsModal al componente tablaResultSrcSIEC    
    @changes Envío parámero setRowsModalState al componente tablaResultSrcSIEC
    @dateUpdated 2025-05-22
    @changes Envío parámetro jsonDpto a los componentes FiltersSrcSIEC y tablaResultSrcSIEC 
    @changes Envío parámetro setJsonDpto a los componentes FiltersSrcSIEC y tablaResultSrcSIEC    
    @changes Envío parámetro jsonMpio a los componentes FiltersSrcSIEC y tablaResultSrcSIEC 
    @changes Envío parámetro setJsonMpio a los componentes FiltersSrcSIEC y tablaResultSrcSIEC 
    @remarks FUENTE consulta en: https://developers.arcgis.com/experience-builder/guide/get-map-coordinates/
    @remarks FUENTE consulta en prueba (2025-05-02) en: https://community.esri.com/t5/arcgis-experience-builder-questions/sketch-widget-api-in-experience-builder-developer/td-p/334312
  */
   
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
    const [columns, setColumns]              = useState([]);
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

    //Tipo de gráfico en mapa - 2024-06-18
    const [typeGraphMap, setTypeGraphMap] = useState<string>();

    //Objeto condición que toma el campo valor del widget - 2024-06-25
    const [cond, setCond]                 = useState("");

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
    
    /**
     * Hook para visualizar el data Grid, incluyendo la información sobre el mismo
     * @date 2025-04-09
     * @author IGAC - DIP
     */
    useEffect(() => {
      console.log("Iniciando Widget...",props.state);  
      console.log("Hook tst =>",ResponseBusquedaFirma);
      if (!ResponseBusquedaFirma)
        return;
      const {features} = ResponseBusquedaFirma;
      
      //Data Grid
      /*const DgridCol = Object.keys(features[0].attributes).map(key => ({key: key, name: key}));
      const DgridRows= features.map(({ attributes, geometry}) => ({ ...attributes, geometry}));*/

      //Seteo del atributo controlForms, para visualizar el componente DataGrid
      setControlForms(true);
      
      setTimeout(() => {
        setControlForms(true);
      },10);

    },[ResponseBusquedaFirma]);
   
    /**
     * Hook inicial para cargue del objeto jsonSERV
     * @date 2024-05-29
     * @author IGAC - DIP     
     * @remarks FUENTE: https://www.pluralsight.com/resources/blog/guides/how-to-get-selected-value-from-a-mapped-select-input-in-react#:~:text=To%20fetch%20the%20selected%20value,state%20to%20pass%20the%20value.
     * @remarks Estructura de las opciones en objeto selOptions = [{label:"Tema_11", value: "11"},{label:"Tema_22", value: "22"},{label:"Tema_3",value:"3"}];    
     */
    
    useEffect(() => {
      //console.log("Control asociado al Alert =>",alertDial);
      // console.log("Control asociado al Modal =>", mensModal.deployed);
      //console.log("controlForms (Filter y DG) =>",controlForms);
      //console.log("Asigna cond desde state =>",cond);      
    },[])

    
    //https://developers.arcgis.com/experience-builder/guide/add-layers-to-a-map/
    /** 
     * @dateUpdated 2025-04-02
     * @changes Crear el evento para capturar la coordenada latitud, longitud
     * @dateUpdated 2025-04-23
     * @changes Guardar extent inicial
     * @dateUpdated 2025-05-02
     * @changes Referenciar el componente Sketch
     * @changes Obtener coordenadas geográficas en m con el componente Sketch
     * @changes Invocar convertidor a coordenadas decimales
     * @dateUpdated 2025-05-05
     * @changes Establecer visualización Widget sketch, para realizar un polígono - rectángulo en el mapa
     * @dateUpdated 2025-05-06
     * @changes Corrección condicional, para seleccionar un punto, estando la opción Navegar seleccionada
     * @dateUpdated 2025-05-07
     * @changes Actualización atributo creationMode "update" => "single" 
     * @changes Realización de borrado rectángulo de coordenadas al dibujar y obtener las coordenadas en los controles Esquina superior izquierda, Esquina inferior derecha
     * @dateUpdated 2025-05-13
     * @changes Actualización States coordenadas latitud, longitud ajustada a toda la precisión entera - decimal en geometría punto
     * @changes Actualización States coordenadas geográficas  empleando toda la precisión entera y decimal en geometría rectángulo
     * @remarks Fuente consulta https://epsg.io/transform
     * @remarks Fuente consulta convertidor API en Transformada a lat, long (https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-support-webMercatorUtils.html#xyToLngLat)
     * @remarks Fuente consulta atributo creationMode widget Sketch en https://community.esri.com/t5/arcgis-javascript-maps-sdk-questions/how-do-i-disable-sketch-widget-from-oncreate/td-p/1356497 
     * para implementación borrado polígono al obtener coordenadas geográficas de manera correcta
    **/
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

    {
      // console.log("Control asociado al Alert =>",alertDial);
      // // console.log("Control asociado al Modal =>", mensModal.deployed);
      console.log("controlForms (Filter y DG) =>",controlForms);
      // console.log("Control renderMap =>",renderMap);
      console.log("Valor radio ppal =>",radValueNav);
    }
    
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
          columns={columns}
          view={view}
          setControlForms={setControlForms}
          jimuMapView={jimuMapView}
          setResponseBusquedaFirma={setResponseBusquedaFirma}
          typeGraphMap={typeGraphMap}          
          setAlertDial={setAlertDial}
          setMensModal={setMensModal}
          pagination={true}
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
          setJsonDptoState={setJsonDpto}
          jsonMpio={jsonMpio}
          setJsonMpioState={setJsonMpio}
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
          ></FiltersSrcSIEC>                    
        }
        
      </div>
    );
  };

  export default Widget;

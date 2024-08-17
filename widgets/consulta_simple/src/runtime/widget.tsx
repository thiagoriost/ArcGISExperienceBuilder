/** 
  Sección de importación
  @dateUpdated 2024-05-29
  @changes Importar los componentes Query, FeatureLayer, Map, MapView
  @dateUpdated 2024-05-30
  @changes Importar los componentes useRef, Map, MapView, Graphic, esriConfig
  @dateUpdated 2024-06-04
  @changes inclusión libreria desde arcgis-rest-feature-layer, para uso del objeto queryFeatures
  @dateUpdated 2024-06-06
  @changes Renderizado al mapa, desde la libreria Graphic
  @dateUpdated 2024-06-07
  @changes Actualización tipo botón opción Consultar a Submit.
  @changes Inclusión sección form, para conectar la opción Consultar
  @dateUpdated 2024-06-12
  @changes Inclusión e Instalación dependencias loadModules
  @changes Inclusión dependencia Alert
  @dateUpdated 2024-06-13
  @changes Inclusión dependencia ReactDataGrid (En pruebas)
  @dateUpdated 2024-06-18
  @changes Importación estilos componente DataGrid
  @changes Inclusión objeto state para fijar Tipo de gráfico en mapa
  @dateUpdated 2024-06-19
  @changes Inclusión objeto state para manejo del componente Alert, cuando no se tengan resultados en el widget
  @dateUpdated 2024-06-20
  @changes Inclusión dependencias Modal, ModalHeader, ModalBody, ModalFooter Icon desde jimu-ui
  @changes Importar interface alusivo al componente Modal
  @dateUpdated 2024-06-24
  @changes Importar componente DrawMap
  @changes Importar componente FiltersCS
  @dateUpdated 2024-06-25
  @changes Cambio ruta para importar archivos estilos CSS (styles.css)
  @changes Parámetros para los componentes DrawMap y FiltersCS
  @changes Invocar componente TablaResultCS
  @dateUpdated 2024-06-26
  @changes Optimización sección importación, para incluir librerias requeridas en el desarrollo widget Consulta Simple, componente padre widget
*/
import { React, AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { useEffect, useRef } from "react";

//Importación componentes personalizados
//Componente DrawMap - 2024-06-24
import DrawMap from "./components/drawMap";
//Componente FiltersCS - 2024-06-24
import FiltersCS from "./components/filtersCS";
//Componente TablaResultCS - 2024-06-25
import TablaResultCS from "./components/tablaResultCS";
//Componente DialogsCS - 2024-06-26
import DialogsCS from "./components/dialogsCS";

//Importación estilos
import '../styles/style.css';
import _ from "lodash";

//Importación interfaces
import { InterfaceResponseConsultaSimple, InterfaceMensajeModal, typeMSM } from "../types/interfaceResponseConsultaSimple";

//Definición objetos
const { useState } = React

/** 
  Sección procesamiento widget => Módulo Widget Consulta Simple
  @date: 2024-05-22
  @author IGAC - DIP
  @dateUpdated 2024-05-24
  @changes Incluir campo Valor
  @changes Cambio campo Atributo / Capa => Capa.
  @changes Cambio campo valor => Atributo
  @dateUpdated 2024-05-31
  @changes Actualizar atributo activeViewChangeHandler
  @dateUpdated 2024-06-17
  @changes Incluir el atributo controlForms, para visualizar los campos de selección de criterios, o bien, el data Grid  
  @remarks Procesamiento Widget Principal
*/
const Widget = (props: AllWidgetProps<any>) => {  
    /** 
    Seccion de declaración
    @dateUpdated: 2024-05-22
    @changes Adicionar la variable jsonSERV
    @dateUpdated: 2024-05-23
    @changes Reestructurar uso de constantes empleando el componente useState, para lo objetos jsonSERV y temas
    @changes Adicionar objeto subtemas
    @changes Adicionar objeto capas
    @changes Adicionar objeto grupos
    @dateUpdated: 2024-05-24
    @changes Adicionar objeto capasAttr
    @dateUpdated: 2024-05-27
    @changes Adicionar objeto txtValorState (Objeto para atributo ReadOnly)
    @changes Adicionar objeto txtValor (Objeto para seteo de contenido campo Valor)
    @changes Adicionar objeto selAttr (Objeto para selección campo Atributo)
    @dateUpdated: 2024-05-28
    @changes Implementar atributo value en control Select alusivo a Tema
    @changes Implementar atributo value en control Select alusivo a Subtema
    @changes Implementar atributo value en control Select alusivo a Grupo
    @changes Implementar atributo value en control Select alusivo a Capa
    @changes Implementar atributo value en control Select alusivo a Atributo
    @dateUpdated 2024-05-31
    @changes mover objeto mapDiv, para ser visto como global
    @changes Adicionar objeto jimuMapView
    @dateUpdated 2024-06-13
    @changes Adicionar objeto view para la opción Extent
    @dateUpdated 2024-06-17
    @changes Adicionar objeto control controlForms
    @dateUpdated 2024-06-18
    @changes Adicionar objeto urlCapa para persistir la URL asociada al campo Capa del widget
    @dateUpdated 2024-06-20
    @changes Adicionar objeto mensModal para persitir mensaje en el componente Modal
    @dateUpdated 2024-06-21
    @changes Adicionar objeto spatialReference para permitir almacenar el objeto spatialReference
  */
    //Para componente FiltersCS
    const [jsonSERV, setJsonSERV]     = useState ([]);
    const [temas, setTemas]           = useState ([]);
    const [subtemas, setSubtemas]     = useState ([]);
    const [capas, setCapas]           = useState ([]);
    const [grupos, setGrupos]         = useState ([]);
    const [capasAttr, setCapasAttr]   = useState ([]);
    const [txtValorState, setValorState]=useState(true);
    const [txtValor, setValor]        = useState("");
    const [selTema, setselTema]       = useState(undefined);
    const [selSubtema, setselSubtema] = useState<number|string>();
    const [selGrupo, setselGrupo]     = useState(undefined);
    const [selCapas, setselCapas]     = useState(undefined);
    const [selAttr, setselAttr]       = useState(undefined);
    const [urlCapa, setUrlCapa]       = useState("");

    //2024-06-13 - DataGrid
    const [rows, setRows]             = useState([]);
    const [columns, setColumns]       = useState([]);
    const [utilsModule, setUtilsModule] = useState(null);

    
    //To add the layer to the Map, a reference to the Map must be saved into the component state.
    //Mapa
    const [jimuMapView, setJimuMapView] = useState<JimuMapView>(); 
    //2024-06-25
    const [renderMap, setRenderMap]     = useState<Boolean>(false);
    
    //Extent Map
    const [view, setView] = useState(null);

    //Layer Extent - 2023-06-20
    const [spatialRefer,setSpatialRefer]                  = useState<any>();
    const [lastGeometriDeployed, setLastGeometriDeployed] = useState();

    const [ResponseConsultaSimple, setResponseConsultaSimple] = useState<InterfaceResponseConsultaSimple>();

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

    const mapDiv = useRef(null);
  /**
    Cargue del contenido alusivo a las temáticas, subtemáticas, grupos y capas desde el servidor de contenidos
    @date 2024-05-22
    @author IGAC - DIP
    @param (String) urlServicioTOC => URL de acceso al servidor que proporciona la data de temas, subtemas, grupos y capas
    @dateUpdated 2024-06-11
    @changes adición término async
    @dateUpdated 2024-06-17
    @changes Corrección URL reemplazo término CartografiaBasica_5000 => Ambiental_T_Ajustado (En prueba)
    @dateUpdated 2024-06-24
    @changes Movimiento al componente DrawMap
    @dateUpdated 2024-06-25
    @changes Movimiento al componente FiltersCS
    @return (String)
    @remarks FUENTE: https://www.freecodecamp.org/news/how-to-fetch-api-data-in-react/
    @remarks Método en componente FiltersCS
  */
    // async function getJSONContenido(jsonSERV)
    // {}
    
    
  /** Implementación de la función alterna _.where
    @date 2024-05-22
    @author IGAC - DIP
    @param (Array) array: Array de búsqueda
    @param (Object) object: Criterio para ser buscado como un objeto
    @dateUpdated 2024-06-24
    @changes Movimiento al componente FiltersCS
    @returns (Array) Elemento del array que se busca
    @remarks método obtenido de Internet (https://stackoverflow.com/questions/58823625/underscore-where-es6-typescript-alternative)
  */
  // function where(array, object) {}
  
  /**Método getTemas()=> obtiene temáticas desde el objeto jsonData
    @date 2024-05-22
    @author IGAC - DIP
    @param (JSON) jsonData: Estructura organizada en formato JSON, desde el servidor que proporciona la data de temas, subtemas, grupos y capas
    @dateUpdated 2024-06-24
    @changes Movimiento al componente FiltersCS
    @return (Object) setTemas: Estructura de datos correspondiente a los temas desde el arreglo opcArr
  */

  // function getTemas(jsonData) {}
  
  /**
    Método getSubtemas => Obtener lista de subtemas, según el tema seleccionado en el control Tema
    @date 2023-05-23
    @author IGAC - DIP
    @param (Object) temas asocia el control con el tema seleccionado
    @dateUpdated 2024-05-27
    @changes Al cambiar tema, borrar valores campos Atributo y Valor
    @dateUpdated 2024-05-28
    @changes Actualizar estado de selección Tema
    @changes Fix selección items campo Subtema
    @changes Fix selección items campo Capa
    @dateUpdated 2024-06-17
    @changes Limpieza capas mapa, al cambiar tema (sección Inicialización de mapa)
    @dateUpdated 2024-06-24
    @changes Movimiento al componente FiltersCS
    @return (Object) setSubtemas: Estructura de datos correspondiente a los subtemas
  */
    // function getSubtemas(temas) {}
    
    /**
      Método getGrupoOrCapa => Método para obtener grupo (temáticas de las subtemáticas) y/o capas conocido subtema
      @date 2023-05-23
      @author IGAC - DIP
      @param (Object) subtemas: control Subtema
      @dateUpdated 2024-05-27
      @changes Al cambiar tema, borrar valores campos Atributo y Valor
      @dateUpdated 2024-05-28
      @changes Deseleccionar opciones en campo Grupo
      @changes Deseleccionar opciones en campo Capa
      @dateUpdated 2024-06-17
      @changes Limpieza capas mapa, al cambiar tema (sección Inicialización de mapa)
      @dateUpdated 2024-06-19
      @changes Activar asignación del objeto selSubtema
      @dateUpdated 2024-06-24
      @changes Movimiento al componente FiltersCS
    */
    // function getGrupoOrCapa(subtemas){}
    
    /**
        Método getCapaByGrupo => Método para obtener capa conocido un grupo
        @date 2023-05-23
        @author IGAC - DIP
        @param (Object)
        @dateUpdated 2024-05-27
        @changes Al cambiar tema, borrar valores campos Atributo y Valor
        @dateUpdated 2024-05-28
        @changes Fix selección item campo Grupo
        @changes Deselección item campo Capa
        @dateUpdated 2024-06-17
        @changes Limpieza capas mapa, al cambiar tema (sección Inicialización de mapa)
        @dateUpdated 2024-06-24
        @changes Movimiento al componente FiltersCS
    */
    // function getCapaByGrupo(grupos){}
    
    //Por revisar - Optimización
    //@date 2024-05-23
    // function procesaData(idPRoc)
    // {
    //   var idParent: number= -1;
    //   var type: string    = "";
    //   var jsonSubtemas: any = "";
    //   var jsonCapas: any = "";
    //   var subtemasArr: Array<string> = [];
    //   var capasArr: Array<string> = []; 
    //   for (var cont = 0; cont < jsonSERV.length; cont++) {
    //     idParent  = parseInt(jsonSERV[cont].parent);
    //     type      = jsonSERV[cont].type;
    //     //Búsqueda de subtemas
    //     if (idParent == idPRoc && type == 'tematica'){
    //       jsonSubtemas = {
    //         "idTematica": parseInt(jsonSERV[cont].id),
    //         "nombreTematica": jsonSERV[cont].text
    //       };
    //       subtemasArr.push(jsonSubtemas);
    //     }
    //     //Búsqueda de capas
    //     else if (idParent == idPRoc && type == 'capa' && parseInt(jsonSERV[cont].id) !== 0) {
    //       jsonCapas = {
    //           "idCapa": parseInt(jsonSERV[cont].id),
    //           "nombreCapa": jsonSERV[cont].text,
    //           "urlCapa": jsonSERV[cont].url
    //       };
    //       capasArr.push(jsonCapas);
    //     }
    //   }
    // }

    /**
      getAtributosCapa => Método para obtener los atributos de una capa conocida y renderizarla en el campo Atributo
      @date 2024-05-24
      @author IGAC - DIP
      @param (Object) capa => Información de capa, desde campo Capa
      @dateUpdated 2024-05-27
      @changes Al cambiar tema, borrar valores campos Atributo y Valor
      @dateUpdated 2024-05-30
      @changes Seteo de la URL asociado al control Capa
      @dateUpdated 2024-06-17
      @changes Limpieza capas mapa, al cambiar tema (sección Inicialización de mapa)
      @dateUpdated 2024-06-19
      @changes Fix seteo valor campo Capa y UrlCapa  (setselCapas(urlCapaJson) => setselCapas(capa.target.value))
      @dateUpdated 2024-06-24
      @changes Movimiento al componente FiltersCS
      @returns (Array) AtrCapaArr => Arreglo con atributos (name, alias)
    */
    // function getAtributosCapa(capa){   }   
    
    /**
     * método getUrlFromCapa => Obtener la URL desde  una capa especificada en el campo Capa
     * @author IGAC - DIP
     * @date 2024-05-24
     * @param idCapa => Identificador capa 
     * @param capasArr => Arreglo de capas en formato JSON, con atributos {idCapa, nombreCapa, urlCapa}
     * @dateUpdated 2024-06-24
     * @changes Movimiento al componente FiltersCS
     * @returns (String) urlCapa => Url asociada a la capa
     */

    // function getUrlFromCapa(idCapa, capasArr){}
    
    /**
      metodo enableValor => Método para habilitar el campo valor, cuando se selecciona un atributo, desde el campo atributo.
      @date 2024-05-27
      @author IGAC - DIP
      @dateUpdated 2024-05-31
      @changes Actualizar estado del control Atributo, para toma del valor del control
      @dateUpdated 2024-06-17
      @changes Limpieza capas mapa, al cambiar tema (sección Inicialización de mapa)
      @dateUpdated 2024-06-24
      @changes Movimiento al componente FiltersCS
      @remarks remover estado ReadOnly
    */
    // function enableValor(evt) {}
    
    /**
      metodo handleChangevalorTxt => Método para cambio de estado, en el campo Valor que permita setear contenido
      @date 2024-05-27
      @author IGAC - DIP
      @param (Object) event => objeto que representa el evento de cambui de valor en el control Valor
      @dateUpdated 2024-06-24
      @changes Movimiento al componente FiltersCS
      @remarks FUENTE => https://www.geeksforgeeks.org/how-to-handle-input-forms-with-usestate-hook-in-react/
    */
    // const handleChangevalorTxt = function (event) {}
    
    /**
      método limpiarCons => Método para remover las opciones de los campos Temna, Subtema, Grupo, Capa, Atributo y Valor
      @date 2024-05-28
      @author IGAC - DIP
      @param (Object) evt => Analizador de eventos asociado al control Limpiar
      @dateUpdated 2024-06-12
      @changes remover capa asociada al filtro widget del mapa actualmente en desarrollo
      @dateUpdated 2024-06-17
      @changes remover capa asociada al filtro widget del mapa
      @dateUpdated 2024-06-24
      @changes Movimiento al componente FiltersCS
      @remarks Deseleccionar item en campo Tema en https://stackoverflow.com/questions/48357787/how-to-deselect-option-on-selecting-option-of-another-select-in-react
    */
    // function limpiarCons(evt){}
    
    /**
     * método limpiarCapaMapa() => quita capa del mapa asociada al filtro consulta simple. Centra el mapa con un nivel de ampliación a 6 unidades
     * @date 2024-06-17
     * @author IGAC - DIP
     * @dateUpdated 2024-06-20
     * @changes remover la capa ampliada, obtenida desde el DataGrid al procesar la consulta del widget
     * @dateUpdated 2024-06-24
     * @changes Movimiento al componente DrawMap
     * @dateUpdated 2024-06-25
     * @changes Copiado al componente FilterCS
     * @returns JimuMapView
     * @remarks En pruebas - 2024-06-25. Pruebas exitosas - 2024-06-26
     */
    // function limpiarCapaMapa() {}
    
    /**
      consultaSimple => método que realiza la consulta, seleccionando la opción Consultar
      @date 2024-05-29
      @author IGAC - DIP
      @param (event) evt
      @dateUpdated 2024-05-31
      @changes Armado de la clausula WHERE en atributo cond
      @dateUpdated 2024-06-04
      @changes Actualización clausula WHERE, adicionando el operador = y encerrando en comillas simples la expresión
      @dateUpdated 2024-06-07
      @changes Actualización parámetros
      @changes Inclusión método para no refrescar la página cuando se remite el formulario con el método submit
      @dateUpdated 2024-06-17
      @changes Fix validación filtro objeto cond
      @dateUpdated 2024-06-19
      @changes Fix parámetro selCapas => urlCapa
      @dateUpdated 2024-06-24
      @changes Movimiento al componente DrawMap
      @dateUpdated 2024-06-25
      @changes Movimiento al componente filtersCS
      @author IGAC - DIP
    */
    // function consultaSimple(evt: { preventDefault: () => void; }){}
    
    /**
     * tstDrawMap => Función prueba capacitación renderizado de información al mapa base
     * @date 2024-05-30
     * @author IGAC - DIP
     * @param urlCapas
     * @param cond
     * @dateUpdated 2024-05-31
     * @changes Actualización Renderización al mapa base
     * @dateUpdated 2024-06-04
     * @changes Actualización atributo url en objeto queryFeatures
     * @dateUpdated 2024-06-05
     * @changes Reingeniería objeto featureLayerTst
     * @changes Reingenieria objeto queryFeatures (https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-Query.html)
     * @dateUpdated 2024-06-11
     * @changes cargue de los features, según parámetros dado por el objeto params
     * @changes Inclusión término async
     * @dateUpdated 2024-06-12
     * @changes Actualización atributos selCapasURL, url y params
     * @changes Implementación validación de acuerdo a los criterios del widget.
     * @changes Uso del componente <Alert>
     * @dateUpdated 2024-06-19
     * @changes Uso del método setAlertDial para visualizar el componente Alert
     * @changes validación cuando el widget tenga parámetros
     * @changes cambio parámetro selCapas => urlCapas
     * @changes cambio objeto selCapasURL => capasURL
     * @dateUpdated 2024-06-20
     * @changes Invocación al componente Modal, por medio de "seteo" de la variable mensModal 
     * @dateUpdated 2024-06-24
     * @changes Movimiento al componente DrawMap
     */
    // async function tstDrawMap(urlCapas, cond){}
   

    /** 
    * Método drawFeaturesOnMap => 
    * @date 2024-06-11
    * @author IGAC - DIP
    * @params (JimuMapView) jmv => Objeto que relaciona el mapa a trabajar
    * @dateUpdated 2024-06-12
    * @changes Remover todas las capas del mapa, cuando el objeto ResponseConsultaSimple sea nulo (valor null)
    * @dateUpdated 2024-06-13
    * @changes Implementar método goTo para extent y zoom de la geometría
    * @changes Incluir el componente dataGrid (en pruebas)
    * @dateUpdated 2024-06-14
    * @changes Actualización operación Extent mediante el método goTo
    * @dateUpdated 2024-06-17
    * @changes Seteo de la geometría en la variable view
    * @changes Corrección validación cuando no se tenga definido el objeto response
    * @dateUpdated 2024-06-18
    * @changes Inclusión geometría Punto (Point), tomando los módulos SimpleMarkerSymbol, SimpleLineSymbol y Point
    * @dateUpdated 2024-06-19
    * @changes Desactivar inclusión geometría Punto, debido a que ya se encuentran incluidos en la sección de importación
    * @dateUpdated 2024-06-21
    * @changes Seteo del objeto spatialReference para visualización del objeto extent
    * @dateUpdated 2024-06-24
    * @changes Movimiento al componente DrawMap
    * 
    */
    // const drawFeaturesOnMap = async (response: InterfaceResponseConsultaSimple) => {}
    
    /**
     * método tablaResultCons() => Componente que representa el DataGrid con la opción Parámetros consulta
     * @date 2024-06-18
     * @author IGAC - DIP
     * @dateUpdated 2024-06-21
     * @changes incluir opción Exportar
     * @dateUpdated 2024-06-25
     * @changes Movimiento al componente TablaResultCS
     * @remarks método obtenido del widget consulta Avanzada (widgets/consulta-avanzada/src/runtime/widget.tsx)
     * @returns HTML
     */
    // const tablaResultCons = function() {}
    
    /**
     * Método retornarFormulario => Visualiza los criterios de selección del widget, estando en el componente DataGrid
     * @date 2024-06-18
     * @author IGAC - DIP
     * @dateUpdated 2024-06-25
     * @changes Movimiento al componente TablaResultCS
     * @remarks método obtenido del widget consulta Avanzada (widgets/consulta-avanzada/src/runtime/widget.tsx)
     */

    // const retornarFormulario = function() {}
    
    /**
     * Método filtrosCons => Interfaz para visualizar los controles del widget consulta simple
     * @date 2024-06-18
     * @author IGAC - DIP
     * @dateUpdated 2024-06-19
     * @changes Inclusión value para los campos Grupo, Capas y Atributos
     * @dateUpdated 2024-06-24
     * @changes Movimiento al componente FiltersCS
     * @returns HTML
     */
    // const filtrosCons = function() {}
    
    /**
     * zoomToDataGridSelected => Método para ampliar la zona del mapa, de acuerdo al registro seleccionado desde el componente DataGrid
     * @date 2024-06-18
     * @author IGAC - DIP
     * @param row => Corresponde a la fila seleccionada del componente DataGrid
     * @dateUpdated 2024-06-20
     * @changes Fix para el procesamiento de cada feature del Data Grid, se resalta la zona del mapa.
     * @dateUpdated 2024-06-21
     * @changes Fix invocación método calculateExtent(), pasando la geometría de la consulta actual     
     * @dateUpdated 2024-06-25
     * @changes Movimiento al componente tablaResultCS
     * @remarks método obtenido del widget consulta Avanzada (widgets/consulta-avanzada/src/runtime/widget.tsx) 
     */
    // const zoomToDataGridSelected = async function (row) {}
    
    /**
     * Método calculateExtent => calcula el Extent de la geometría {punto, polilinea o polígono}
     * @date 2024-06-18
     * @author IGAC - DIP
     * @param (Array) geometry => Estructura de datos con la geometría asociada al Layer
     * @param (Array) LayerSelectedDeployed => Estructura de datos con la capa filtrada actualmente según el DataGrid
     * @dateUpdated 2024-06-21
     * @changes Validación cargue tipo geometría
     * @changes actualización atributo buffer  
     * @dateUpdated 2024-06-25
     * @changes Movimiento al componente tablaResultCS
     * @returns xmin,
                ymin,
                xmax,
                ymax,
                spatialReference                
     * @remarks método obtenido del widget consulta Avanzada (widgets/consulta-avanzada/src/runtime/widget.tsx)
     */
    // const calculateExtent = function (geometry, LayerSelectedDeployed) {}
    
    /**
     * método showDialog => componente Dialog para visualizar en la interfaz
     * @date 2024-06-19
     * @author IGAC - DIP
     * @param msg => Mensaje asociado al alert
     * @dateUpdated 2024-06-26
     * @changes Movimiento al componente DialogsCS
     * @returns Componente <Alert> asociado a la libreria jimu-ui
     */
    // const showDialog = function(msg: string){}
    
    /**
     * Método showModal => componente Modal flotante para visualizar en interfaz
     * @date 2024-06-20
     * @author IGAC - DIP
     * @param (string) msg: Mensaje principal para el modal
     * @dateUpdated 2024-06-26
     * @changes Movimiento al componente DialogsCS     
     * @remarks método traido del API en URL https://developers.arcgis.com/experience-builder/storybook/?path=/docs/components-jimu-ui-index-modal--docs 
     */
    // const showModal = function(msg?: string){}      
    
    /**
     * método createSymbol => Método para gestión de simbolos, según el tipo de geometría {polygon, polyline, point}
     * @date 2024-06-20
     * @author IGAC - DIP    
     * @dateUpdated 2024-06-25
     * @changes Movimiento al componente TablaResultCS  
     * @remarks método obtenido del widget consulta avanzada, componente TablaResultados.tsx
     */

    // const createSymbol = ({ SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol }, geometryType) => {}
    
    /**
     * Método createGeometry => crear la geometría según el tipo
     * @date 2024-06-20
     * @author IGAC - DIP
     * @dateUpdated 2024-06-25
     * @changes Movimiento al componente TablaResultCS    
     * @remarks método obtenido del widget consulta avanzada, componente TablaResultados.tsx
     */

    // const createGeometry = ({ Point }, geometryType, geometryData, spatialReference) => {}
    
    /**
     * Método exportToCSV => Exportar datos desde el componente Data Grid en archivo formato plano CSV
     * @date 2024-06-21
     * @author IGAC - DIP
     * @param data => corresponde a la data para procesar
     * @param fName => corresponde al nombre de archivo
     * @dateUpdated 2024-06-25
     * @changes Movimiento al componente TablaResultCS 
     * @remarks Método obtenido del widget Consulta avanzada
     */
    // const exportToCSV = function (data, fName) {}
    
    /**
     * generarFileStand=> método que genera el archivo con el estándar name+_+anio+_+mes+_+dia+_+hr+_+min+_+seg
     * @date 2024-06-21
     * @author IGAC - DIP
     * @param fName => nombre del archivo
     * @dateUpdated 2024-06-25
     * @changes Movimiento al componente TablaResultCS 
     * @returns fName con estándar name+_+anio+_+mes+_+dia+_+hr+_+min+_+seg
     */

    // const generarFileStand = function(fName:string){}
    
    /**
     *  procesaFechaHora => método para devolver el número del día o mes o el número de minutos o segundos que contienen un solo digito (1-9) con un cero a la izquierda
     * @date 2024-06-21
     * @author IGAC - DIP
     * @dateUpdated 2024-06-25
     * @changes Movimiento al componente TablaResultCS 
     * @returns Número del mes correcto
     */

    // const procesaFechaHora = function(nTime: Number){}
    
    /**
     * Hook para dibujado del mapa, actualizando los objetos jimuMapView y ResponseConsultaSimple     * 
     * @date 2024-06-12
     * @author IGAC - DIP
     * @dateUpdated 2024-06-14
     * @changes Invocación método drawFeaturesOnMap con parámetro asociado ResponseConsultaSimple
     * @dateUpdated 2024-06-24
     * @changes Movimiento al componente DrawMap
     */
    // useEffect(() => {
    //   if (jimuMapView) {        
    //     drawFeaturesOnMap(ResponseConsultaSimple);
    //   }
    // }, [jimuMapView, ResponseConsultaSimple]);

    /**
     * Hook para visualizar el data Grid, con la geometría respectiva al filtro
     * @date 2024-06-17
     * @author IGAC - DIP 
     * @dateUpdated 2024-06-18
     * @changes Mantenimiento cargue información componente DataGrid, especificando un tiempo de 10 ms para visualizar el cambio de estado en la constante controlForms
     */
    useEffect(() => {
      if (!ResponseConsultaSimple)
        return;
      const {features} = ResponseConsultaSimple;
      //Data Grid
      const DgridCol = Object.keys(features[0].attributes).map(key => ({key: key, name: key}));
      const DgridRows= features.map(({ attributes, geometry}) => ({ ...attributes, geometry}));

      //Depuración
      if (utilsModule?.logger()) console.log("Data Grid Cols =>",DgridCol);
      if (utilsModule?.logger()) console.log("Data Grid Rows =>",DgridRows);

      //Seteo de los resultados al DataGrid
      setColumns(DgridCol);
      //Seteo del atributo controlForms, para visualizar el componente DataGrid
      setControlForms(true);
      setRows(DgridRows);
      
      setTimeout(() => {
        setControlForms(true);
      },10);

    },[ResponseConsultaSimple]);
   
    /**
     * Hook inicial para cargue del objeto jsonSERV
     * @date 2024-05-29
     * @author IGAC - DIP
     * @dateUpdated 2024-06-24
     * @changes Movimiento al componente FiltersCS
     * @remarks FUENTE: https://www.pluralsight.com/resources/blog/guides/how-to-get-selected-value-from-a-mapped-select-input-in-react#:~:text=To%20fetch%20the%20selected%20value,state%20to%20pass%20the%20value.
     * @remarks Estructura de las opciones en objeto selOptions = [{label:"Tema_11", value: "11"},{label:"Tema_22", value: "22"},{label:"Tema_3",value:"3"}];    
     */
    
    // useEffect(() =>
    // {}      

    useEffect(() => {
      if (utilsModule?.logger()) console.log("Control asociado al Alert =>",alertDial);
      // if (utilsModule?.logger()) console.log("Control asociado al Modal =>", mensModal.deployed);
      if (utilsModule?.logger()) console.log("controlForms (Filter y DG) =>",controlForms);
      if (utilsModule?.logger()) console.log("Control renderMap =>",renderMap);
      if (utilsModule?.logger()) console.log("Asigna cond desde state =>",cond);
    },[renderMap])

    //https://developers.arcgis.com/experience-builder/guide/add-layers-to-a-map/
    const activeViewChangeHandler = (jmv: JimuMapView) => {
      if (utilsModule?.logger()) console.log("Ingresando al evento objeto JimuMapView...");
      if (jmv) {
        setJimuMapView(jmv);        
      }
    };

    {
      // if (utilsModule?.logger()) console.log("Control asociado al Alert =>",alertDial);
      // // if (utilsModule?.logger()) console.log("Control asociado al Modal =>", mensModal.deployed);
      // if (utilsModule?.logger()) console.log("controlForms (Filter y DG) =>",controlForms);
      // if (utilsModule?.logger()) console.log("Control renderMap =>",renderMap);
    }

    useEffect(() => {
      import('../../../utils/module').then(modulo => setUtilsModule(modulo));
    }, []);
    
    return (
      <div className="w-100 p-3 bg-primary text-white">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
        )}
        {/*Sección diálogo cuando no se cumplan los criterios del widget*/ }
        {alertDial
          //? showDialog("No se cumplen los criterios!")
          ? <DialogsCS
          setAlertDial={setAlertDial}
          mensModal={mensModal}
          setMensModal={setMensModal}
          ></DialogsCS>
          : null
        }
        {/*Si el estado dado en la constante es verdadero (true), invoca método tablaResultCons(), el cual renderiza el componente DataGrid. De lo contrario, invoca método filtrosCons(), el cual renderiza el componente con los filtros del widget */ }
        {controlForms
          && <TablaResultCS
          rows={rows}
          columns={columns}
          view={view}
          setControlForms={setControlForms}
          jimuMapView={jimuMapView}
          setResponseConsultaSimple={setResponseConsultaSimple}
          lastGeometriDeployed={lastGeometriDeployed}
          setLastGeometriDeployed={setLastGeometriDeployed}
          typeGraphMap={typeGraphMap}
          spatialRefer={spatialRefer}
          setAlertDial={setAlertDial}
          setMensModal={setMensModal}
          ></TablaResultCS>
        }
        {!controlForms
         && <FiltersCS
          temas={temas}
          selTema={selTema}
          setselTema={setselTema}
          subtemas={subtemas}
          selSubtema={selSubtema}
          setselSubtema={setselSubtema}
          capas={capas}
          setCapas={setCapas}
          urlCapa={urlCapa}
          setUrlCapa={setUrlCapa}
          grupos={grupos}
          setGrupos={setGrupos} 
          jsonSERV={jsonSERV} 
          setJsonSERV={setJsonSERV} 
          setTemas={setTemas} 
          setSubtemas={setSubtemas} 
          capasAttr={capasAttr} 
          setCapasAttr={setCapasAttr} 
          txtValorState={txtValorState} 
          setValorState={setValorState} 
          txtValor={txtValor} 
          setValor={setValor} 
          selGrupo={selGrupo} 
          setselGrupo={setselGrupo} 
          selCapas={selCapas} 
          setselCapas={setselCapas} 
          selAttr={selAttr} 
          setselAttr={setselAttr}
          ResponseConsultaSimple={ResponseConsultaSimple}
          setResponseConsultaSimple={setResponseConsultaSimple}
          view={view}
          setView={setView}
          jimuMapView={jimuMapView}
          lastGeometriDeployed={lastGeometriDeployed}
          condic={cond}
          setCond={setCond}
          setRenderMap={setRenderMap}
          setAlertDial={setAlertDial}
          mensModal={mensModal}
          setMensModal={setMensModal}
          ></FiltersCS>
        }
        {renderMap &&
        <DrawMap jimuMapView={jimuMapView}
          setJimuMapView={setJimuMapView}
          setAlertDial={setAlertDial}
          ResponseConsultaSimple={ResponseConsultaSimple}
          setResponseConsultaSimple={setResponseConsultaSimple}
          mensModal={mensModal}
          setMensModal={setMensModal}
          typeGraphMap={typeGraphMap}
          setTypeGraphMap={setTypeGraphMap}
          view={view}
          setView={setView}
          spatialRefer={spatialRefer}
          setSpatialRefer={setSpatialRefer}
          txtValor={txtValor}
          txtValorState={txtValorState}
          setValor={setValor}
          urlCapa={urlCapa}
          setUrlCapa={setUrlCapa}
          cond={cond}
          setCond={setCond}
          props={props}          
          ></DrawMap>
        }
      </div>      
    );
  };
  
  export default Widget;
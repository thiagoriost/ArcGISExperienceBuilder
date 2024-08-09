
import { React, AllWidgetProps} from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { Button, Label, Loading, Select, TextArea } from 'jimu-ui'; // import components
import { useEffect, useState } from "react";
import 'react-data-grid/lib/styles.css';

import { Polygon } from "@arcgis/core/geometry";
import { InterfaceResponseConsulta, interfaceFeature } from "../types/interfaceResponseConsultaSimple";
import '../styles/style.css'
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { InterfaceColumns, Row, interfaceMensajeModal, typeMSM } from "../types/interfaces";
import { loadModules } from "esri-loader";
// import ModalComponent from "./components/ModalComponent";
// import { loadEsriModules } from "./components/TablaResultados";
// import InputSelect from "./components/InputSelect";

const Consulta_Avanzada = (props: AllWidgetProps<any>) => {

  const [jsonSERV, setJsonSERV] = useState([]);
  const [temas, setTemas] = useState([]);
  const [subtemas, setSubtemas] = useState([]);
  const [capas, setCapas] = useState([]);
  const [selCapas, setselCapas] = useState(undefined);
  const [capaselected, setCapaselected] = useState();
  const [grupos, setGrupos] = useState([]);
  const [capasAttr, setCapasAttr] = useState([]);
  const [selTema, setselTema] = useState(undefined);
  const [subtemaselected, setSubtemaselected] = useState();
  const [selGrupo, setselGrupo] = useState(undefined);
  const [campo, setCampo] = useState(undefined);
  const [valores, setValores] = useState<string[]>([]);
  const [valorSelected, setValorSelected] = useState();
  const [condicionBusqueda, setCondicionBusqueda] = useState('');
  const [responseConsulta, setResponseConsulta] = useState<any>(null);
  const [graphicsLayerDeployed, setGraphicsLayerDeployed] = useState(null);
  const [featuresLayersDeployed, setFeaturesLayersDeployed] = useState<any[]>([]); // almacena los features y su metadata pintados en el mapa
  const [mostrarResultadoFeaturesConsulta, setMostrarResultadoFeaturesConsulta] = useState(false);
  const [rows, setRows] = useState<Row[]>([])
  const [columns, setColumns] = useState<InterfaceColumns[]>([]);
  const [LayerSelectedDeployed, setLayerSelectedDeployed] = useState(null);
  const [lastGeometriDeployed, setLastGeometriDeployed] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [initialExtent, setInitialExtent] = useState(null);
  const [mensajeModal, setMensajeModal] = useState<interfaceMensajeModal>({
    deployed:false,
    type:typeMSM.info,
    tittle:'',
    body:'',
    subBody:''
  })
  const [widgetModules, setWidgetModules] = useState(null);
  const [utilsModule, setUtilsModule] = useState(null);
  const [servicios, setServicios] = useState(null);

  //To add the layer to the Map, a reference to the Map must be saved into the component state.
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  // const [ResponseConsultaSimple, setResponseConsultaSimple] = useState<InterfaceResponseConsulta>();

  /*
    Cargue del contenido alusivo a las temáticas, subtemáticas, grupos y capas desde el servidor de contenidos
    @date 2024-05-22
    @author IGAC - DIP
    @param (String) urlServicioTOC => URL de acceso al servidor que proporciona la data de temas, subtemas, grupos y capas
    @return (String)
    @remarks FUENTE: https://www.freecodecamp.org/news/how-to-fetch-api-data-in-react/
  */
  const getJSONContenido = async (jsonSERV) => {
    const urlServicioTOC = servicios.urls.tablaContenido;
    var nombreServicio, idTematica, idCapaMapa, idCapaDeServicio, nombreTematica, tituloCapa, urlMetadatoCapa, url: string;
    var idTematicaPadre: any;
    var visible: Boolean;
    var existeTematica: [];
    var newTematica, newCapa: object;

    fetch(urlServicioTOC, {
      method: "GET"
    })
      .then((rows) => rows.json())
      .then((data) => {
        for (var cont = 0; cont < data.length; cont++) {
          nombreServicio = data[cont].DESCRIPCIONSERVICIO;
          idTematica = data[cont].IDTEMATICA + 't';
          idCapaMapa = data[cont].IDCAPA + 'c';
          nombreTematica = data[cont].NOMBRETEMATICA;
          tituloCapa = data[cont].TITULOCAPA;
          idTematicaPadre = data[cont].IDTEMATICAPADRE;
          visible = data[cont].VISIBLE;
          url = data[cont].URL;
          idCapaDeServicio = data[cont].NOMBRECAPA;
          urlMetadatoCapa = data[cont].METADATOCAPA;

          if (!idTematicaPadre) {
            idTematicaPadre = "#";
          } else {
            idTematicaPadre = idTematicaPadre + 't';
          }

          existeTematica = where(jsonSERV, { 'id': idTematica });

          //Cadena JSON de temática
          newTematica = {
            "id": idTematica,
            "text": nombreTematica,
            "type": "tematica",
            "parent": idTematicaPadre
          };

          //Cadena JSON de Capa
          newCapa = {
            "id": idCapaMapa.replace("c", ""),
            "idCapaMapa": idCapaMapa,
            "text": tituloCapa,
            "type": "capa",
            "parent": idTematica,
            "url": url + "/" + idCapaDeServicio,
            "idCapaDeServicio": idCapaDeServicio,
            "urlMetadatoCapa": urlMetadatoCapa
          };
          if (existeTematica.length !== 0) {
            jsonSERV.push(newCapa);
          }
          else {
            jsonSERV.push(newTematica);
            if (data[cont].IDCAPA) {
              jsonSERV.push(newCapa);
            }
          }
        }
        //console.log("Contenido json SERV en petición =>", jsonSERV);

        //Invocación al método para obtener la información sobre el campo Temas
        if (jsonSERV != undefined) {
          setJsonSERV(jsonSERV);
          getTemas(jsonSERV);
        }
      })
  }

  /* Método getTemas()=> obtiene temáticas desde el objeto jsonData
    @date 2024-05-22
    @author IGAC - DIP
    @param (JSON) jsonData: Estructura organizada en formato JSON, desde el servidor que proporciona la data de temas, subtemas, grupos y capas
    @return (Object) setTemas: Estructura de datos correspondiente a los temas desde el arreglo opcArr
  */

  const getTemas = (jsonData) =>{
    var opcArr = [];
    var tipoRegistro, nodoPadre, urlServ, descrip: string;
    var idTema = -1;
    for (var cont = 0; cont < jsonData.length; cont++) {
      tipoRegistro = jsonData[cont].type;
      nodoPadre = jsonData[cont].parent;
      idTema = jsonData[cont].id;
      urlServ = jsonData[cont].url;
      descrip = jsonData[cont].text.toUpperCase();

      //Cargue de los tipos "tematica" con el nodo padre (nodoPadre) identificados con '#'
      if (nodoPadre == '#' && tipoRegistro == 'tematica') {
        opcArr.push({
          "value": idTema,
          "label": descrip
        });
      }
    }
    //console.log("Lista Temas =>", opcArr);      
    setTemas(opcArr);
  }

  /*
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
    @return (Object) setSubtemas: Estructura de datos correspondiente a los subtemas
  */
  const getSubtemas = (temas) =>{
    var idParent: number = -1;
    var type: string = "";
    var jsonSubtemas: any = "";
    var jsonCapas: any = "";
    var subtemasArr: Array<string> = [];
    var capasArr: Array<string> = [];

    const idPRoc = parseInt(temas.target.value);
    console.log("Tema value =>", parseInt(temas.target.value));
    console.log("Array Admin Serv JSON =>", jsonSERV);

    //Inicialización de controles
    setselTema(temas.target.value); //Tema: Seleccionando el item del control
    setSubtemas([]);  //Subtema
    setGrupos([]);    //Grupo
    setCapas([]);     //Capas
    setCapasAttr([]); //Atributo
    setCapaselected(null);
    setSubtemaselected(null);
    setCondicionBusqueda('');
    setValorSelected(null);
    setValores([]);


    for (var cont = 0; cont < jsonSERV.length; cont++) {
      idParent = parseInt(jsonSERV[cont].parent);
      type = jsonSERV[cont].type;
      //Búsqueda de subtemas
      if (idParent == idPRoc && type == 'tematica') {
        jsonSubtemas = {
          // "idTematica": parseInt(jsonSERV[cont].id),
          "value": parseInt(jsonSERV[cont].id),
          // "nombreTematica": jsonSERV[cont].text
          "label": jsonSERV[cont].text
        };
        subtemasArr.push(jsonSubtemas);
      }
      //Búsqueda de capas
      else if (idParent == idPRoc && type == 'capa' && parseInt(jsonSERV[cont].id) !== 0) {
        jsonCapas = {
          // "idCapa": parseInt(jsonSERV[cont].id),
          "value": parseInt(jsonSERV[cont].id),
          // "nombreCapa": jsonSERV[cont].text,
          "label": jsonSERV[cont].text,
          "urlCapa": jsonSERV[cont].url
        };
        capasArr.push(jsonCapas);
      }
    }

    //Cargue de subtemas, cuando se conoce tema
    if (subtemasArr.length >= 0) {
      console.log("Subtemas Array=>", subtemasArr);
      setSubtemas(subtemasArr);
    }
    //Cargue de capas de un tema, cuando éste no tiene subtemas
    if (capasArr.length >= 0) {
      console.log("Capas Array Sin duplic =>", capasArr);
      setselCapas(undefined);
      setCapas(capasArr);
    }

  }
  /*
    Método getGrupoOrCapa => Método para obtener grupo (temáticas de las subtemáticas) y/o capas conocido subtema
    @date 2023-05-23
    @author IGAC - DIP
    @param (Object) subtemas: control Subtema
    @dateUpdated 2024-05-27
    @changes Al cambiar tema, borrar valores campos Atributo y Valor
    @dateUpdated 2024-05-28
    @changes Deseleccionar opciones en campo Grupo
    @changes Deseleccionar opciones en campo Capa
  */
  const getGrupoOrCapa = ({target}) =>{
    
    var idParent: number = -1;
    var type: string = "";
    var jsonSubtemas: any = "";
    var jsonCapas: any = "";
    var subtemasArr: Array<string> = [];
    var capasArr: Array<string> = [];
    
    setSubtemaselected(target.value)
    const idPRoc = parseInt(target.value);

    limpiaCampoCapas();
    setCapasAttr([]);
    setValorSelected(null);
    setValores([])
    setCondicionBusqueda('')

    for (var cont = 0; cont < jsonSERV.length; cont++) {
      idParent = parseInt(jsonSERV[cont].parent);
      type = jsonSERV[cont].type;
      //Búsqueda de subtemas
      if (idParent == idPRoc && type == 'tematica') {
        jsonSubtemas = {
          // "idTematica": parseInt(jsonSERV[cont].id),
          "value": parseInt(jsonSERV[cont].id),
          // "nombreTematica": jsonSERV[cont].text
          "label": jsonSERV[cont].text
        };
        subtemasArr.push(jsonSubtemas);
      }
      //Búsqueda de capas
      else if (idParent == idPRoc && type == 'capa' && parseInt(jsonSERV[cont].id) !== 0) {
        jsonCapas = {
          "value": parseInt(jsonSERV[cont].id),
          "label": jsonSERV[cont].text,
          "urlCapa": jsonSERV[cont].url
        };
        capasArr.push(jsonCapas);
      }
    }

    //Cargue de subtemas, cuando se conoce subtema
    if (subtemasArr.length >= 0) {
      console.log("Subtemas Array=>", subtemasArr);
      setGrupos(subtemasArr);
      setselGrupo(undefined);
    }
    //Cargue de capas de un subtema, cuando éste no tiene grupos
    if (capasArr.length >= 0) {
      console.log("Capas Array Sin duplic =>", capasArr);
      setCapas(capasArr);
      setselCapas(undefined);
    }
  }
  const limpiaCampoCapas = () => {
    setCapas([]); // limpia el campo capas
    setCapaselected(null); // limpia la capa seleccionada
  }
  /*
      Método getCapaByGrupo => Método para obtener capa conocido un grupo
      @date 2023-05-23
      @author IGAC - DIP
      @param (Object)
      @dateUpdated 2024-05-27
      @changes Al cambiar tema, borrar valores campos Atributo y Valor
      @dateUpdated 2024-05-28
      @changes Fix selección item campo Grupo
      @changes Deselección item campo Capa
  */
  const getCapaByGrupo = (grupos) => {
    var idParent: number = -1;
    var type: string = "";
    var jsonSubtemas: any = "";
    var jsonCapas: any = "";
    var subtemasArr: Array<string> = [];
    var capasArr: Array<string> = [];
    const idPRoc = parseInt(grupos.target.value);

    setValorSelected(null);
    setselGrupo(grupos.target.value);

    setCapasAttr([]);

    for (var cont = 0; cont < jsonSERV.length; cont++) {
      idParent = parseInt(jsonSERV[cont].parent);
      type = jsonSERV[cont].type;
      //Búsqueda de subtemas
      if (idParent == idPRoc && type == 'tematica') {
        jsonSubtemas = {
          // "idTematica": parseInt(jsonSERV[cont].id),
          "value": parseInt(jsonSERV[cont].id),
          // "nombreTematica": jsonSERV[cont].text
          "label": jsonSERV[cont].text
        };
        subtemasArr.push(jsonSubtemas);
      }
      //Búsqueda de capas
      else if (idParent == idPRoc && type == 'capa' && parseInt(jsonSERV[cont].id) !== 0) {
        jsonCapas = {
          // "idCapa": parseInt(jsonSERV[cont].id),
          "value": parseInt(jsonSERV[cont].id),
          // "nombreCapa": jsonSERV[cont].text,
          "label": jsonSERV[cont].text,
          "urlCapa": jsonSERV[cont].url
        };
        capasArr.push(jsonCapas);
      }
    }

    //Cargue de capas de un grupo
    if (capasArr.length >= 0) {
      console.log("Capas Array Sin duplic =>", capasArr);
      setCapas(capasArr);
      setselCapas(undefined);
    }
  }
  /*
    getAtributosCapa => Método para obtener los atributos de una capa conocida y renderizarla en el campo Atributo
    @date 2024-05-24
    @author IGAC - DIP
    @param (Object) capa => Información de capa, desde campo Capa
    @dateUpdated 2024-05-27
    @changes Al cambiar tema, borrar valores campos Atributo y Valor
    @dateUpdated 2024-05-30
    @changes Seteo de la URL asociado al control Capa
    @returns (Array) AtrCapaArr => Arreglo con atributos (name, alias)
  */
  const getAtributosCapa = (target) => {
    let urlCapa: string;
    let JsonAtrCapa: any = "";
    let AtrCapaArr: any = [];
    let urlCapaJson: string;

    //Construcción de la URL del servicio, a partir del identificador de capa traido desde el campo Capa
    // urlCapa = getUrlFromCapa(target.value, capas);
    urlCapa = capas.find(capa => capa.value == target.value)?.urlCapa;
    if (!urlCapa){
      console.error("Url no encontrada");
      return
    } 
    removeLayerDeployed(LayerSelectedDeployed);
    dibujaCapasSeleccionadas(urlCapa);
    urlCapaJson = urlCapa + "?f=json";
    console.log("URL capa =>", urlCapaJson);

    setCapasAttr([]);
    setselCapas(urlCapaJson);

    //Realización del consumo remoto, a través de la URL del servicio dado por el atributo urlCapaJson
    fetch(urlCapaJson, {
      method: "GET"
    })
      .then((rows) => rows.json())
      .then((data) => {
        //Rearmado estructura datos de atributos: name, alias          
        for (var cont = 0; cont < data.fields.length; cont++) {
          JsonAtrCapa = {
            "value": data.fields[cont].name,
            "label": data.fields[cont].alias,
            "allData": data
          };
          AtrCapaArr.push(JsonAtrCapa);
        }
        console.log("Obj Attr Capas =>", AtrCapaArr);
        setCapasAttr(AtrCapaArr);
        setTimeout(() => { // para esperar que la capacargue
          setIsLoading(false);          
        }, 6000);
      });
  }

  /*
    limpiarFormulario => Método para remover las opciones de los campos Temna, Subtema, Grupo, Capa, Atributo y Valor
    @date 2024-05-28
    @author IGAC - DIP
    @param (Object) evt => Analizador de eventos asociado al control Limpiar
    @remarks Deseleccionar item en campo Tema en https://stackoverflow.com/questions/48357787/how-to-deselect-option-on-selecting-option-of-another-select-in-react
  */
  const limpiarFormulario = (evt) => {
    console.log("Handle Evt en limpiar =>", evt.target.value);
    setCapas([]);
    setCondicionBusqueda('');
    setValores([]);
    setCapaselected(null)
    setselTema(undefined);
    setSubtemas([]);
    setGrupos([]);
    setCapasAttr([]);
    setSubtemaselected(undefined);
    setCampo(undefined);
    console.log(graphicsLayerDeployed)
    console.log(featuresLayersDeployed)
    removeLayer(LayerSelectedDeployed);
    setLayerSelectedDeployed(null);    
    jimuMapView.view.map.removeAll()
    goToInitialExtent(jimuMapView, initialExtent)

  }

  const removeLayer = (layer: __esri.Layer) => {
    jimuMapView.view.map.remove(layer);
    jimuMapView.view.zoom = jimuMapView.view.zoom -0.00000001;
  }

  //https://developers.arcgis.com/experience-builder/guide/add-layers-to-a-map/
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    console.log("Ingresando al evento objeto JimuMapView...");
    if (jmv) {
      setJimuMapView(jmv);
      setInitialExtent(jmv.view.extent); // Guarda el extent inicial
    }
  };

  const drawFeaturesOnMap = async (response: InterfaceResponseConsulta) => {

    const { features, spatialReference } = response;
    if (!jimuMapView || features.length === 0 || !response) return;


    /* const [
      Graphic, GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Point, Extent, PopupTemplate
    ] = await utilsModule.loadEsriModules(); */

    loadModules([
      'esri/layers/GraphicsLayer', 'esri/PopupTemplate',
      'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/Graphic',
    ]).then(([GraphicsLayer, PopupTemplate, SimpleFillSymbol,
      SimpleLineSymbol, Graphic]) => {
      const graphicsLayer = new GraphicsLayer();
      
      features.forEach((feature: interfaceFeature) => {
  
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
          /* symbol: {
            type: 'simple-fill',
            color: "blue",
            outline: {
              color: "darkblue",
              width: 0.5
            }
          }, */
          symbol: SYMBOL,
          attributes: feature.attributes,
          popupTemplate: popupTemplate
        });
  
        graphicsLayer.add(graphic);
      });
  
      jimuMapView.view.map.add(graphicsLayer);
      setGraphicsLayerDeployed(graphicsLayer);
      
      jimuMapView.view.goTo({
        target: graphicsLayer.graphics.items[0].geometry,
        zoom: 10 
      });
      setIsLoading(false);
      
    })


  };

  /**
     * Metodo que dibuja en el mapa la capa chequeada y actualiza el state FeaturesLayersDeployed
     * @param capasToRender 
     * @param varJimuMapView 
     */
  const dibujaCapasSeleccionadas = (url) => {
    
      const layer = new FeatureLayer({url});
      jimuMapView.view.map.add(layer);
      setFeaturesLayersDeployed(features => [...features, layer]);
      layer.when(() => {
        setLayerSelectedDeployed(layer)
        jimuMapView.view.goTo(layer.fullExtent).catch(error => {
          console.error("Error while zooming to layer extent:", error);
        });
      }).catch(error => {
        console.error("Error loading the feature layer:", error);
      });
  }

  const removeLayerDeployed = (featureLayer) => {
    if (featureLayer && jimuMapView) {
      jimuMapView.view.map.remove(featureLayer);
    } else {
      console.error("FeatureLayer no encontrado.");
    }
  }

  const consultarValores = async () => {
    console.log("consultarValores")
    setIsLoading(true);
    const url = selCapas.replace("?f=json", "") + "/query"
    let where = "1=1", getGeometry = false;    
    const response = await realizarConsulta(campo, url, getGeometry, where);
    console.log(response)
    if (response) {
      if (response.error) {
        console.error(`${response.error.code} - ${response.error.message}`);
        setMensajeModal({
          deployed:true,
          type: typeMSM.error,
          tittle:'Sin valores',
          body: `${response.error.code} - ${response.error.message}`
        });
      }else{
        const ordenarDatos: string[] = getOrdenarDatos(response, campo);
        if (ordenarDatos[0]==null) {
          setValores([])

          setMensajeModal({
            deployed:true,
            type: typeMSM.info,
            tittle:'Sin valores',
            body: `El campo ${campo} no tiene valores para mostrar, intenta con un campo diferente`}
          )
          setIsLoading(false);
          return
        }
        setValores(ordenarDatos)
      }
    }
    setIsLoading(false);
  }

  const handleCampos = ({ target }): void => {
    console.log(target.value)
    //State del control Atributo
    // setValores([])
    const campo = target.value;
    setCampo(campo);
    const adicionSimbolo = `${condicionBusqueda} ${campo}`
    setCondicionBusqueda(adicionSimbolo);
    setValorSelected(null);
  }

  const asignarSimbolCondicionBusqueda = (simbolo: string): void => {
    const adicionSimbolo = `${condicionBusqueda} ${simbolo}`
    setCondicionBusqueda(adicionSimbolo);
  }

  const handleValor = ({ target }) => {
    const adicionValor = `${condicionBusqueda} ${typeof(target.value)=='number'? target.value:`'${target.value}'`}`
    setValorSelected(target.value);
    setCondicionBusqueda(adicionValor);
  }

  const _RealizarConsulta = async() => {
    console.log("RealizarConsulta");
    setIsLoading(true);
    console.log(condicionBusqueda)
    const where = condicionBusqueda;
    const url = selCapas.replace("?f=json", "") + "/query"
    const response: InterfaceResponseConsulta = await realizarConsulta("*", url, true, where);
    console.log(response)
    if (response.error) {
      console.error(`${response.error.code} - ${response.error.message}`);
      setMensajeModal({
        deployed:true,
        type: typeMSM.error,
        tittle:'Error en la consulta',
        body: `${response.error.code} - ${response.error.message}`,
        subBody:`Puede ser que la condición de busqueda no quedó bien estructurada`
      });
      setIsLoading(false);
    }else{
      if (response.features.length>0) {      
        setResponseConsulta(response);
        drawFeaturesOnMap(response);
      } else {
        setMensajeModal({
          deployed:true,
          type: typeMSM.error,
          tittle:'Sin resultados para esta consulta',
          body: "Intenta con otros parámetros"
        });
      }
      setIsLoading(false);
    }
  }

  const limpiarCamposValores = () => {
    setCapasAttr([]);
    setValores([]);
    setCampo(null)
  }

  const onChangeCapa = ({target}) => {    
    console.log(target.value)
    setIsLoading(true);
    if(graphicsLayerDeployed?.graphics.items.length > 0){
      jimuMapView.view.map.removeAll()
    }
    getAtributosCapa(target);
    setCapaselected(target.value);
    limpiarCamposValores()
    setCondicionBusqueda('');

  }

  const handleChangeTextArea = ({target}) =>  setCondicionBusqueda(target.value);
  

  const formularioConsulta = () => {
    return (
      <div className="overflow-auto">          
          
        {
          widgetModules?.INPUTSELECT(temas, getSubtemas, selTema, "Tema")
        }
        {
          subtemas.length > 0 &&  
            widgetModules?.INPUTSELECT(subtemas, getGrupoOrCapa, subtemaselected, "Subtema")          
        }
        {
          grupos.length > 0 &&
            widgetModules?.INPUTSELECT(grupos, getCapaByGrupo, selGrupo, "Grupo")
        }
        {
          capas.length > 0 &&
            widgetModules?.INPUTSELECT(capas, onChangeCapa, capaselected, "Capa")
        }
        {
          capasAttr.length > 0 &&
            widgetModules?.INPUTSELECT(capasAttr, handleCampos, campo, "Campos")
        }
         
        {
          (valores.length > 0) &&
            widgetModules?.INPUTSELECT(valores, handleValor, valorSelected, "Valores")
        }
        {
          campo &&
          <div className="align-items-center mt-1">            
            {widgetModules?.INPUT_TEXTAREA(condicionBusqueda, handleChangeTextArea, "Condición de búsqueda")}
            <div className="w-100 text-center">
              <Button
                // size="sm"
                type="primary"
                onClick={() => setCondicionBusqueda('')}
                className="mb-4"
              >
                Borrar condición de busqueda
              </Button>
            </div>
          </div>

        }
        {
          campo &&
          <div className="condition-buttons text-center bg-dark pt-1">
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('=')}>=</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('BETWEEN')}>{"<>"}</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('>')}>&gt;</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('<')}>&lt;</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('>=')}>&gt;=</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('<=')}>&lt;=</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('LIKE')}>LIKE</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('AND')}>AND</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('OR')}>OR</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('NOT')}>NOT</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('IS')}>IS</Button>
            <Button type="primary" size="sm" className="mr-1 mb-1 color-deep-purple-100" onClick={() => asignarSimbolCondicionBusqueda('NULL')}>NULL</Button>
          </div>

        }
        {
          (condicionBusqueda && valores.length > 0) &&
          <div className="fila">
            <Button
              htmlType="button"
              size="sm"
              type="primary"
              onClick={_RealizarConsulta}
            >
              Consultar
            </Button>
            <Button
              htmlType="button"
              onClick={limpiarFormulario}
              size="sm"
              type="primary"
            >
              Limpiar
            </Button>
          </div>
        }
      </div>
    )
  }
  
  /**
   * Toma la respuesta de la consulta y ajusta la data para poder ser renderizada la tabla de resultados.
   * Forma el objeto de columnas y filas
   */
  useEffect(() => {    
    console.log("effect responseConsulta")
    if(!responseConsulta)return
    const {features} = responseConsulta;
    const dataGridColumns = Object.keys(features[0].attributes).map(key => ({ key: key, name: key }));
    const filas = features.map(({ attributes, geometry }) => ({ ...attributes, geometry }));    
    console.log(dataGridColumns)
    console.log(filas)
    setColumns(dataGridColumns)
    setRows(filas);    
    setTimeout(() => {
      setMostrarResultadoFeaturesConsulta(true)      
    }, 10);
  }, [responseConsulta])
  
  /**
   * Despues de modificar el valor del campo, realiza la consulta
   */
  useEffect(() => {
    if(campo)consultarValores();
    return () => {}
  }, [campo])

  /**
   * cuando "servicios" ya tiene data, realiza la consulta de la tabla de contenido y con esto
   * llena los campos select
   */
  useEffect(() => {
    servicios && getJSONContenido(jsonSERV);  
    return () => {}
  }, [servicios])
  

  useEffect(() => {
    // setResponseConsulta(dataPruebaResponse);    
      import('../../../commonWidgets/widgetsModule').then(modulo => setWidgetModules(modulo));
      import('../../../utils/module').then(modulo => setUtilsModule(modulo));
      import('../../../api/servicios').then(modulo => setServicios(modulo));   
      return () => {
        // Acción a realizar cuando el widget se cierra.
        console.log('El widget se cerrará');
      };
  }, []);

  return (
    <div className="w-100 p-3 bg-primary">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}
      {
        mostrarResultadoFeaturesConsulta
        ? widgetModules.TABLARESULTADOS({
          rows,
          columns,
          jimuMapView,
          lastGeometriDeployed,
          LayerSelectedDeployed,
          graphicsLayerDeployed,
          setLastGeometriDeployed,
          setMostrarResultadoFeaturesConsulta
        })
        : formularioConsulta()
      }
      {
        isLoading && <Loading />
      }
      {
        widgetModules?.MODAL(mensajeModal, setMensajeModal)
      }        
    </div>
  );
};

export default Consulta_Avanzada;


const realizarConsulta = async (campo: string, url: string, returnGeometry: boolean, where: string) => {

  const controller = new AbortController();
  const fixUrl = `${url}?where=${where}&geometryType=esriGeometryEnvelope&outFields=${campo}&returnGeometry=${returnGeometry}&f=pjson`
  // "https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/Ambiental_T_Ajustado/MapServer/14/query?where=1=1&geometryType=esriGeometryEnvelope&outFields=VEREDA&returnGeometry=false&f=pjson"
  try {
    const response = await fetch(fixUrl,
      {
        method: "GET",
        signal: controller.signal,
        redirect: "follow"
      });
    console.log({ response })
    const _responseConsulta = await response.text();
    console.log(JSON.parse(_responseConsulta))
    return JSON.parse(_responseConsulta);
  } catch (error) {
    console.error({ error });
  }


}

const getOrdenarDatos = (response: InterfaceResponseConsulta, campo: string) => {
  console.log("getOrdenarDatos")
  const { features } = response;
  const justDatos = []
  features.forEach(feature => {
    justDatos.push(feature.attributes[campo])
  });

 // Eliminar duplicados usando un Set
 const uniqueArray = Array.from(new Set(justDatos));
 // Eliminar strings vacíos
 const filteredArray = uniqueArray.filter(item => (item !== "" && item !== " "));
 if(filteredArray.length == 0 )return [];
 // Ordenar el arreglo
 const sortedArray = filteredArray.sort((a, b) => {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b; // Ordenar números en orden ascendente
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b); // Ordenar strings alfabéticamente
  } else {
    return 0; // En caso de mezclar tipos, no hacer nada
  }
});
console.log(sortedArray)
const sortedArrayObjet = []
sortedArray.forEach(e => sortedArrayObjet.push({value:e,label:e}))
return sortedArrayObjet;

}

/* Implementación de la función alterna _.where
  @date 2024-05-22
  @author IGAC - DIP
  @param (Array) array: Array de búsqueda
  @param (Object) object: Criterio para ser buscado como un objeto
  @returns (Array) Elemento del array que se busca
  @remarks método obtenido de Internet (https://stackoverflow.com/questions/58823625/underscore-where-es6-typescript-alternative)
*/
const where = (array, object) => {
  let keys = Object.keys(object);
  return array.filter(item => keys.every(key => item[key] === object[key]));
}

const goToInitialExtent = (jimuMapView: JimuMapView, initialExtent: any) => {
  if (jimuMapView && initialExtent) {
    jimuMapView.view.goTo(initialExtent, { duration: 1000 });
  }
};


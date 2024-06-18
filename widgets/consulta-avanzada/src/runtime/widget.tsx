
import { React, AllWidgetProps, esri } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { Button, Label, Select, TextArea } from 'jimu-ui'; // import components
import { useEffect, useState } from "react";
import 'react-data-grid/lib/styles.css';
import DataGrid, { CellClickArgs } from 'react-data-grid';

import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
// import PopupTemplate from "@arcgis/core/layers/PopupTemplate";

// import './style.css';
import { Polygon } from "@arcgis/core/geometry";
import { loadModules } from 'esri-loader';
import { InterfaceResponseConsulta, interfaceFeature } from "../types/interfaceResponseConsultaSimple";
import '../styles/style.css'
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { InterfaceColumns, Row } from "../types/interfaces";
import Extent from "@arcgis/core/geometry/Extent";

const Consulta_Avanzada = (props: AllWidgetProps<any>) => {

  console.log("Iniciando Widget...");
  const [jsonSERV, setJsonSERV] = useState([]);
  const [temas, setTemas] = useState([]);
  const [subtemas, setSubtemas] = useState([]);
  const [capas, setCapas] = useState([]);
  const [selCapas, setselCapas] = useState(undefined);
  const [capaselected, setCapaselected] = useState();
  const [grupos, setGrupos] = useState([]);
  const [capasAttr, setCapasAttr] = useState([]);
  // const [txtValorState, setValorState] = useState(true);
  // const [txtValor, setValor] = useState("");
  const [selTema, setselTema] = useState(undefined);
  const [selSubtema, setselSubtema] = useState(undefined);
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
  const [lastGeometriDeployed, setLastGeometriDeployed] = useState()



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
    const urlServicioTOC = "https://sigquindio.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public";
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

  function getTemas(jsonData) {
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
  function getSubtemas(temas) {
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
    setCapas([]);     //Capa
    setCapasAttr([]); //Atributo
    // setValor("");     //Valor
    // setValorState(true);//Valor al actualizarlo el usuario            

    for (var cont = 0; cont < jsonSERV.length; cont++) {
      idParent = parseInt(jsonSERV[cont].parent);
      type = jsonSERV[cont].type;
      //Búsqueda de subtemas
      if (idParent == idPRoc && type == 'tematica') {
        jsonSubtemas = {
          "idTematica": parseInt(jsonSERV[cont].id),
          "nombreTematica": jsonSERV[cont].text
        };
        subtemasArr.push(jsonSubtemas);
      }
      //Búsqueda de capas
      else if (idParent == idPRoc && type == 'capa' && parseInt(jsonSERV[cont].id) !== 0) {
        jsonCapas = {
          "idCapa": parseInt(jsonSERV[cont].id),
          "nombreCapa": jsonSERV[cont].text,
          "urlCapa": jsonSERV[cont].url
        };
        capasArr.push(jsonCapas);
      }
    }

    //Cargue de subtemas, cuando se conoce tema
    if (subtemasArr.length >= 0) {
      console.log("Subtemas Array=>", subtemasArr);
      setselSubtema(undefined);
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
    console.log("Subtema asociado =>", idPRoc);

    limpiaCampoCapas();

    setCapasAttr([]);
    setValores([])

    for (var cont = 0; cont < jsonSERV.length; cont++) {
      idParent = parseInt(jsonSERV[cont].parent);
      type = jsonSERV[cont].type;
      //Búsqueda de subtemas
      if (idParent == idPRoc && type == 'tematica') {
        jsonSubtemas = {
          "idTematica": parseInt(jsonSERV[cont].id),
          "nombreTematica": jsonSERV[cont].text
        };
        subtemasArr.push(jsonSubtemas);
      }
      //Búsqueda de capas
      else if (idParent == idPRoc && type == 'capa' && parseInt(jsonSERV[cont].id) !== 0) {
        jsonCapas = {
          "idCapa": parseInt(jsonSERV[cont].id),
          "nombreCapa": jsonSERV[cont].text,
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

    console.log("Grupo asociado =>", idPRoc);

    setselGrupo(grupos.target.value);

    setCapasAttr([]);
    // setValor("");
    // setValorState(true);

    for (var cont = 0; cont < jsonSERV.length; cont++) {
      idParent = parseInt(jsonSERV[cont].parent);
      type = jsonSERV[cont].type;
      //Búsqueda de subtemas
      if (idParent == idPRoc && type == 'tematica') {
        jsonSubtemas = {
          "idTematica": parseInt(jsonSERV[cont].id),
          "nombreTematica": jsonSERV[cont].text
        };
        subtemasArr.push(jsonSubtemas);
      }
      //Búsqueda de capas
      else if (idParent == idPRoc && type == 'capa' && parseInt(jsonSERV[cont].id) !== 0) {
        jsonCapas = {
          "idCapa": parseInt(jsonSERV[cont].id),
          "nombreCapa": jsonSERV[cont].text,
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
  //Por revisar - Optimización
  //@date 2024-05-23
  const procesaData = (idPRoc) => {
    var idParent: number = -1;
    var type: string = "";
    var jsonSubtemas: any = "";
    var jsonCapas: any = "";
    var subtemasArr: Array<string> = [];
    var capasArr: Array<string> = [];
    for (var cont = 0; cont < jsonSERV.length; cont++) {
      idParent = parseInt(jsonSERV[cont].parent);
      type = jsonSERV[cont].type;
      //Búsqueda de subtemas
      if (idParent == idPRoc && type == 'tematica') {
        jsonSubtemas = {
          "idTematica": parseInt(jsonSERV[cont].id),
          "nombreTematica": jsonSERV[cont].text
        };
        subtemasArr.push(jsonSubtemas);
      }
      //Búsqueda de capas
      else if (idParent == idPRoc && type == 'capa' && parseInt(jsonSERV[cont].id) !== 0) {
        jsonCapas = {
          "idCapa": parseInt(jsonSERV[cont].id),
          "nombreCapa": jsonSERV[cont].text,
          "urlCapa": jsonSERV[cont].url
        };
        capasArr.push(jsonCapas);
      }
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
  const getAtributosCapa = (capa: { target: { value: string; }; }) => {
    let urlCapa: string;
    let JsonAtrCapa: any = "";
    let AtrCapaArr: any = [];
    let urlCapaJson: string;

    //Construcción de la URL del servicio, a partir del identificador de capa traido desde el campo Capa
    urlCapa = getUrlFromCapa(capa.target.value, capas);
    removeLayerDeployed(LayerSelectedDeployed);
    dibujaCapasSeleccionadas(urlCapa);
    urlCapaJson = urlCapa + "?f=json";
    console.log("URL capa =>", urlCapaJson);

    setCapasAttr([]);
    // setValor("");
    // setValorState(true);

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
            "name": data.fields[cont].name,
            "alias": data.fields[cont].alias,
            "allData": data
          };
          AtrCapaArr.push(JsonAtrCapa);
        }
        console.log("Obj Attr Capas =>", AtrCapaArr);
        setCapasAttr(AtrCapaArr);
      });
  }

  /**
   * método getUrlFromCapa => Obtener la URL desde  una capa especificada en el campo Capa
   * @author IGAC - DIP
   * @date 2024-05-24
   * @param idCapa => Identificador capa 
   * @param capasArr => Arreglo de capas en formato JSON, con atributos {idCapa, nombreCapa, urlCapa}
   * @returns (String) urlCapa => Url asociada a la capa
   */

  const getUrlFromCapa =(idCapa, capasArr) =>{
    //Recorrido por el array
    for (var cont = 0; cont < capasArr.length; cont++) {
      if (parseInt(capasArr[cont].idCapa) == parseInt(idCapa)) {
        return capasArr[cont].urlCapa;
      }
    }
    return -1;
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
    setselSubtema(undefined)
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

  }

  const removeLayer = (layer) => {
    jimuMapView.view.map.remove(layer);
    jimuMapView.view.zoom = jimuMapView.view.zoom -0.00000001;
  }

  //https://developers.arcgis.com/experience-builder/guide/add-layers-to-a-map/
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    console.log("Ingresando al evento objeto JimuMapView...");
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  const drawFeaturesOnMap = async (response: InterfaceResponseConsulta) => {

    const { features, spatialReference } = response;
    if (!jimuMapView || features.length === 0 || !response) return;


    const [PopupTemplate,SimpleLineSymbol,SimpleFillSymbol] = await loadModules([
      'esri/PopupTemplate','esri/symbols/SimpleLineSymbol','esri/symbols/SimpleFillSymbol']);

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
    
    // jimuMapView.view.zoom = jimuMapView.view.zoom -0.0001;
    jimuMapView.view.goTo({
      target: graphicsLayer.graphics.items[0].geometry,
      zoom: 10 
    });
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
    const url = selCapas.replace("?f=json", "") + "/query"
    let where = "1=1", getGeometry = false;
    const response = await realizarConsulta(campo, url, getGeometry, where);
    console.log(response)
    if (response) {
      if (response.error) {
        console.error(`${response.error.code} - ${response.error.message}`);
      }else{
      const ordenarDatos: string[] = getOrdenarDatos(response, campo);
      if (ordenarDatos[0]==null) {
        setValores([])
        alert(`El campo ${campo} no tiene valores para mostrar, intenta con un campo diferente`)
        return
      }
      setValores(ordenarDatos)
    }
    } else {
      console.error(response);
    }

  }

  const handleCampos = ({ target }): void => {
    console.log(target.value)
    //State del control Atributo
    // setValores([])
    const campo = target.value;
    setCampo(campo);
    const adicionSimbolo = `${condicionBusqueda} ${campo}`
    setCondicionBusqueda(adicionSimbolo);
    consultarValores();
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

  const resetCondicionBusqueda = () => {
    setCondicionBusqueda('');
    // setCampo(undefined);
    // setValores([])
  }

  const RealizarConsulta = async() => {
    console.log("RealizarConsulta");
    console.log(condicionBusqueda)
    const where = condicionBusqueda;
    const url = selCapas.replace("?f=json", "") + "/query"
    const response: InterfaceResponseConsulta = await realizarConsulta("*", url, true, where);
    console.log(response)
    if (response.error) {
      console.error(`${response.error.code} - ${response.error.message}`);
    }else{
      if (response.features.length>0) {      
        setResponseConsulta(response);
        drawFeaturesOnMap(response);
      } else {
        alert("La consulta no retorno resultados")
      }
    }
  }

  const limpiarCamposValores = () => {
    setCapasAttr([]);
    setValores([]);
    setCampo(null)
  }

  const formularioConsulta = () => {
    return (
      <>
          <div className="mb-1">
            <Label size="default"> Tema </Label>
            <Select
              onChange={(e) => {
                console.log(e)
                getSubtemas(e)
              }}
              placeholder="Seleccione tema..."
              value={selTema}
            >
              {temas.map(
                (option) => (
                  <option value={option.value}>{option.label}</option>
                )
              )}
            </Select>
          </div>
          {
            subtemas.length > 0 &&
            <div className="mb-1">
              <Label size="default"> Subtema </Label>
              <Select
                onChange={getGrupoOrCapa}
                placeholder="Seleccione subtema..."
                value={subtemaselected}
              >
                {
                  subtemas.map(
                    (option) => (
                      <option value={option.idTematica}>{option.nombreTematica}</option>
                    )
                  )
                }

              </Select>
            </div>
          }
          {
            grupos.length > 0 &&
            <div className="mb-1">
              <Label size="default"> Grupo </Label>
              <Select
                onChange={getCapaByGrupo}
                placeholder="Seleccione grupo..."
                value={selGrupo}
              >
                {
                  grupos.map(
                    (option) =>
                      <option value={option.idTematica}>{option.nombreTematica}</option>
                  )
                }
              </Select>
            </div>

          }
          {
            capas.length > 0 &&
            <div className="mb-1">
              <Label size="default"> Capa </Label>
              <Select
                onChange={(e)=>{
                  getAtributosCapa(e);
                  console.log(e.target.value)
                  setCapaselected(e.target.value);
                  limpiarCamposValores()
                }}
                placeholder="Seleccione una capa:"
                value={capaselected}
              >
                {
                  capas.map(
                    (option) =>
                      <option value={option.idCapa}>{option.nombreCapa}</option>
                  )
                }
              </Select>
            </div>
          }
          {
            capasAttr.length > 0 &&
            <div className="mb-1">
              <Label size="default"> Campos </Label>
              <Select
                onChange={handleCampos}
                placeholder="Seleccione un atributo:"
                value={campo}
              >
                {
                  capasAttr.map(
                    (option) =>
                      <option value={option.name}>{option.name}</option>
                  )
                }
              </Select>
            </div>

          }
          {
            (valores.length > 0) &&
            <div className="fila">
              <div className="mb-1 w-100">
                <label style={{marginRight:'10px'}}> Valores: </label>
               {/*  <Button
                  size="sm"
                  type="primary"
                  onClick={consultarValores}
                >
                  Obtener valores
                </Button> */}
                <Select
                  onChange={handleValor}
                  placeholder="Seleccione un valor:"
                  value={valorSelected}
                >
                  {
                    valores.map(
                      (valor) =>
                        <option value={valor}>{valor}</option>
                    )
                  }
                </Select>
              </div>

            </div>
          }
          {
            campo &&
            <div className="d-flex align-items-center mt-1">
              {/* <label style={{marginRight:'10px'}}>  Condición de búsqueda: </label> */}
              <Label size="default"> Condición de búsqueda</Label>
              <div className="overflow-hidden flex-grow-1   mr-1">                
                <TextArea
                  className="mb-4"
                  required
                  onChange={({ target }) => { setCondicionBusqueda(target.value) }}
                  value={condicionBusqueda}
                />
                {/* </label> */}
              </div>
              <Button
                size="sm"
                type="primary"
                onClick={() => resetCondicionBusqueda()}
              >
                Borrar
              </Button>
            </div>

          }
          {
            campo &&
            <div className="condition-buttons text-center">
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('=')}>=</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('BETWEEN')}>{"<>"}</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('>')}>&gt;</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('<')}>&lt;</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('>=')}>&gt;=</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('<=')}>&lt;=</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('LIKE')}>LIKE</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('AND')}>AND</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('OR')}>OR</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('NOT')}>NOT</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('IS')}>IS</Button>
              <Button type="primary" size="sm" className="mr-1 mb-1" onClick={() => asignarSimbolCondicionBusqueda('NULL')}>NULL</Button>
            </div>

          }
          {
            (condicionBusqueda && valores.length > 0) &&
            <div className="fila">
              <Button
                htmlType="button"
                size="sm"
                type="primary"
                onClick={RealizarConsulta}
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
      </>
    )
  }

  const zoomToFeatureSelected = async (row): Promise<void> =>{
    console.log(row);
    console.log(lastGeometriDeployed);
    if(lastGeometriDeployed)jimuMapView.view.map.remove(lastGeometriDeployed)
    const [Graphic, GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,Point] = await loadModules([
      'esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol',
      'esri/symbols/SimpleMarkerSymbol', 'esri/geometry/Point',
    ]);
    
    const geometryType = LayerSelectedDeployed.geometryType;
    let simbolo, geometria;
    const SR = graphicsLayerDeployed.graphics.items.find(e => e.attributes.OBJECTID == row.row.OBJECTID).geometry.spatialReference;
    switch (geometryType) {
      case 'polygon':
        // Crear un símbolo de relleno simple para resaltar la geometría de polígono        
        simbolo = new SimpleFillSymbol({
          color: [255, 255, 0, 0.25], // Amarillo con transparencia
          outline: new SimpleLineSymbol({
            color: [255, 0, 0], // Rojo
            width: 2
          })
        });
        geometria = {
          type: geometryType,
          rings: row.row.geometry.rings,
          spatialReference: SR
        };
        break;
      
      case 'polyline':
        // Crear un símbolo de línea simple para resaltar la geometría de polilínea
        simbolo = new SimpleLineSymbol({
          color: [255, 0, 0], // Rojo
          width: 2
        });
        geometria = {
          type: geometryType,
          paths: row.row.geometry.paths,
          spatialReference: SR
        };
        break;
  
      case 'point':
        // Crear un símbolo de marcador simple para resaltar la geometría de punto
        simbolo = new SimpleMarkerSymbol({
          color: [255, 0, 0], // Rojo
          outline: new SimpleLineSymbol({
            color: [255, 255, 0], // Amarillo
            width: 1
          }),
          size: '8px'
        });   
        geometria = new Point({
          type: geometryType,
          x: row.row.geometry.x,
          y: row.row.geometry.y,
          spatialReference: SR
        });    
        break;
  
      default:
        console.error('Tipo de geometría no soportado');
        return;
    }

    const graphic = new Graphic({
      geometry: geometria,
      symbol: simbolo
    });
    
    const graphicsLayer = new GraphicsLayer();
    
    graphicsLayer.add(graphic);
    jimuMapView.view.map.add(graphicsLayer);
    if (geometryType == 'point') {
      const EXTEND = calculateExtent(row.row.geometry, LayerSelectedDeployed);
      const EXTENDend = new Extent(EXTEND);
      jimuMapView.view.goTo(EXTENDend, { duration: 1000 });
    } else {
      jimuMapView.view.goTo(graphic.geometry.extent.expand(1.5), { duration: 1000 });
    }
    setLastGeometriDeployed(graphicsLayer)
  }

  const retornarFormulario = () => {
    if(lastGeometriDeployed){
      jimuMapView.view.map.remove(lastGeometriDeployed)
      setLastGeometriDeployed(null);
      jimuMapView.view.goTo({
        target: graphicsLayerDeployed.graphics.items[0].geometry,
        zoom: 10 
      });
    }

    setMostrarResultadoFeaturesConsulta(false)
  }

  const tablaResultadoConsulta = () => {
    return (
      <>
        <Button size="sm" className="mb-1" type="primary" onClick={retornarFormulario}>
          Parámetros consulta
        </Button>
        <DataGrid columns={columns} rows={rows} onCellClick={zoomToFeatureSelected}/>
      </>
    )
  }

  useEffect(() => {    
    console.log("effect responseConsulta")
    if(!responseConsulta)return
    const {features} = responseConsulta;
    const dataGridColumns = Object.keys(features[0].attributes).map(key => ({ key: key, name: key }));
    const filas = features.map(({ attributes, geometry }) => ({ ...attributes, geometry }));
    /* const filas = [];
    features.forEach(({attributes, geometry}) =>  filas.push({ ...attributes, geometry })); */
    console.log(dataGridColumns)
    console.log(filas)
    setColumns(dataGridColumns)
    setMostrarResultadoFeaturesConsulta(true)      
    setRows(filas);
    setTimeout(() => {
      setMostrarResultadoFeaturesConsulta(true)      
    }, 10);
  }, [responseConsulta])
  

  useEffect(() => {
    getJSONContenido(jsonSERV);
    // setResponseConsulta(dataPruebaResponse);
    /* alert(`
      ToDO:
        - revisar extend ambiental, cuenca rio la vieja, clima, mapa de lluvias, objectID, 7
        - Construir mensaje tipo toast
        - ajustar tamnio widget
        - ajustar overflow widget
        - Ejecutar Limpiar
        - limpiar campo valores cuando se cambia el campos y temas
        -  limpiar condicion de busqueda al cambiar los campos superiores
      `) */
  }, []);

  return (
    <div className="w-100 p-3 bg-primary text-white">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}
        { mostrarResultadoFeaturesConsulta
        ? tablaResultadoConsulta()
        : formularioConsulta()}      

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
return sortedArray;

}


// Función para calcular el Extent del polígono
const calculateExtent = (geometry, LayerSelectedDeployed) => {
  const {fullExtent, geometryType}=LayerSelectedDeployed
  
  let xmin = Infinity; let ymin = Infinity; let xmax = -Infinity; let ymax = -Infinity;

  if (geometryType == 'point') {
    const buffer = 100; // Tamaño del buffer alrededor del punto
    return {
      xmin: geometry.x - buffer,
      ymin: geometry.y - buffer,
      xmax: geometry.x + buffer,
      ymax: geometry.y + buffer,
      spatialReference:fullExtent.spatialReference
    };
  } else if(geometryType == 'polygon' || geometryType == 'polyline'){
    const geometries = geometryType == 'polygon' ? geometry.rings : geometry.paths;
    geometries.forEach(ring => {
      ring.forEach(([x, y]) => {
        if (x < xmin) xmin = x;
        if (y < ymin) ymin = y;
        if (x > xmax) xmax = x;
        if (y > ymax) ymax = y;
      });
    });
  
    return {
      xmin,
      ymin,
      xmax,
      ymax,
      spatialReference:fullExtent.spatialReference
    };    
  }else {
    return null
  }

};

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
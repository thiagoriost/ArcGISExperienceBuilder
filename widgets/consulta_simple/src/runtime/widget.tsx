/*
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
*/
import { React, AllWidgetProps, esri } from "jimu-core";
import { StarFilled } from 'jimu-icons/filled/application/star'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { Button, Label, Select, TextInput } from 'jimu-ui'; // import components
import { useEffect, useRef } from "react";

//Objetos desde arcgis
import Query from "@arcgis/core/rest/support/Query"; 
//import { queryFeatures } from "@arcgis/core/rest/query/executeQuery";
import { queryFeatures } from '@esri/arcgis-rest-feature-layer';

import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Extent from "@arcgis/core/geometry/Extent"; 
import geometryService from "@arcgis/core/rest/geometryService";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from '@arcgis/core/Graphic';
import esriConfig from '@arcgis/core/config';
//Prueba importación 2024-06-06
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
// import PopupTemplate from "@arcgis/core/layers/PopupTemplate";

import './style.css';
import _ from "lodash";
import path from "node:path/win32";
import { InterfaceResponseConsultaSimple } from "../types/interfaceResponseConsultaSimple";
import { Polygon } from "@arcgis/core/geometry";
import { loadModules } from 'esri-loader';
// import { loadModules } from "jimu-core/lib/module-loader";
// import { PopupTemplate } from "@arcgis/core/geometry";

// import { loadModules } from "jimu-core/lib/module-loader";
// import { loadModules } from 'esri-loader';

const { useState } = React
const iconNode = <StarFilled />;

/*
  Sección procesamiento widget => Módulo Widget Consulta Simple
  @date: 2024-05-22
  @author IGAC - DIP
  @dateUpdated 2024-05-24
  @changes Incluir campo Valor
  @changes Cambio campo Atributo / Capa => Capa.
  @changes Cambio campo valor => Atributo
  @dateUpdated 2024-05-31
  @changes Actualizar atributo activeViewChangeHandler
  @remarks Procesamiento Widget Principal
*/
const Widget = (props: AllWidgetProps<any>) => {  
    /* 
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
    @dateUpdated: 2024-05-31
    @changes mover objeto mapDiv, para ser visto como global
    @changes Adicionar objeto jimuMapView
  */
  console.log("Iniciando Widget...");
    const [jsonSERV, setJsonSERV]     = useState ([]);
    const [temas, setTemas]           = useState ([]);
    const [subtemas, setSubtemas]     = useState ([]);
    const [capas, setCapas]           = useState ([]);
    const [grupos, setGrupos]         = useState ([]);
    const [capasAttr, setCapasAttr]   = useState ([]);
    const [txtValorState, setValorState]=useState(true);
    const [txtValor, setValor]        = useState("");
    const [selTema, setselTema]       = useState(undefined);
    const [selSubtema, setselSubtema] = useState(undefined);
    const [selGrupo, setselGrupo]     = useState(undefined);
    const [selCapas, setselCapas]     = useState(undefined);
    const [selAttr, setselAttr]       = useState(undefined);
    
    //To add the layer to the Map, a reference to the Map must be saved into the component state.
    const [jimuMapView, setJimuMapView] = useState<JimuMapView>(); 
    const [ResponseConsultaSimple, setResponseConsultaSimple] = useState<InterfaceResponseConsultaSimple>();

    const mapDiv = useRef(null);
  /*
    Cargue del contenido alusivo a las temáticas, subtemáticas, grupos y capas desde el servidor de contenidos
    @date 2024-05-22
    @author IGAC - DIP
    @param (String) urlServicioTOC => URL de acceso al servidor que proporciona la data de temas, subtemas, grupos y capas
    @return (String)
    @remarks FUENTE: https://www.freecodecamp.org/news/how-to-fetch-api-data-in-react/
  */
    async function getJSONContenido(jsonSERV)
    {
      const urlServicioTOC = "https://sigquindio.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public";
      var nombreServicio, idTematica, idCapaMapa, idCapaDeServicio, nombreTematica, tituloCapa, urlMetadatoCapa, url: string;
      var idTematicaPadre: any;
      var visible: Boolean;
      var existeTematica: [];
      var newTematica, newCapa: object;
      
      fetch(urlServicioTOC,{
        method:"GET"
      })
      .then((rows) => rows.json())
      .then((data) => {
        for (var cont = 0; cont < data.length; cont++)
        {
          nombreServicio= data[cont].DESCRIPCIONSERVICIO;
          idTematica    = data[cont].IDTEMATICA + 't';
          idCapaMapa    = data[cont].IDCAPA + 'c';
          nombreTematica= data[cont].NOMBRETEMATICA;
          tituloCapa    = data[cont].TITULOCAPA;
          idTematicaPadre= data[cont].IDTEMATICAPADRE;
          visible        = data[cont].VISIBLE;
          url            = data[cont].URL;
          idCapaDeServicio= data[cont].NOMBRECAPA;
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


    
  /* Implementación de la función alterna _.where
    @date 2024-05-22
    @author IGAC - DIP
    @param (Array) array: Array de búsqueda
    @param (Object) object: Criterio para ser buscado como un objeto
    @returns (Array) Elemento del array que se busca
    @remarks método obtenido de Internet (https://stackoverflow.com/questions/58823625/underscore-where-es6-typescript-alternative)
  */
  function where(array, object) {
    let keys = Object.keys(object);
    return array.filter(item => keys.every(key => item[key] === object[key]));
  }

  /* Método getTemas()=> obtiene temáticas desde el objeto jsonData
    @date 2024-05-22
    @author IGAC - DIP
    @param (JSON) jsonData: Estructura organizada en formato JSON, desde el servidor que proporciona la data de temas, subtemas, grupos y capas
    @return (Object) setTemas: Estructura de datos correspondiente a los temas desde el arreglo opcArr
  */

  function getTemas(jsonData)
  {
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
    function getSubtemas(temas)
    {
      var idParent: number= -1;
      var type: string    = "";
      var jsonSubtemas: any = "";
      var jsonCapas: any = "";
      var subtemasArr: Array<string> = [];
      var capasArr: Array<string> = []; 

      const idPRoc    = parseInt(temas.target.value);
      console.log("Tema value =>", parseInt(temas.target.value));
      console.log("Array Admin Serv JSON =>",jsonSERV);

      //Inicialización de controles
      setselTema(temas.target.value); //Tema: Seleccionando el item del control
      
      setSubtemas([]);  //Subtema
      setGrupos([]);    //Grupo
      setCapas([]);     //Capa
      setCapasAttr([]); //Atributo
      setValor("");     //Valor
      setValorState(true);//Valor al actualizarlo el usuario            
      
      for (var cont = 0; cont < jsonSERV.length; cont++) {
        idParent  = parseInt(jsonSERV[cont].parent);
        type      = jsonSERV[cont].type;
        //Búsqueda de subtemas
        if (idParent == idPRoc && type == 'tematica'){
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
      if (subtemasArr.length >= 0)
      {
        console.log("Subtemas Array=>", subtemasArr);        
        setselSubtema(undefined);
        setSubtemas(subtemasArr);
      }
      //Cargue de capas de un tema, cuando éste no tiene subtemas
      if (capasArr.length >= 0)
      {        
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
    function getGrupoOrCapa(subtemas){
      
      var idParent: number= -1;
      var type: string    = "";
      var jsonSubtemas: any = "";
      var jsonCapas: any = "";
      var subtemasArr: Array<string> = [];
      var capasArr: Array<string> = []; 

      const idPRoc    = parseInt(subtemas.target.value);

      console.log("Subtema asociado =>",idPRoc);

      //setselSubtema(subtemas.target.value);
      setCapasAttr([]);
      setValor("");
      setValorState(true);
            
      for (var cont = 0; cont < jsonSERV.length; cont++) {
        idParent  = parseInt(jsonSERV[cont].parent);
        type      = jsonSERV[cont].type;
        //Búsqueda de subtemas
        if (idParent == idPRoc && type == 'tematica'){
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
      if (subtemasArr.length >= 0)
      {
        console.log("Subtemas Array=>", subtemasArr);
        setGrupos(subtemasArr);
        setselGrupo(undefined);
      }
      //Cargue de capas de un subtema, cuando éste no tiene grupos
      if (capasArr.length >= 0)
      {
        console.log("Capas Array Sin duplic =>", capasArr);
        setCapas(capasArr);
        setselCapas(undefined);
      }
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
    function getCapaByGrupo(grupos)
    {
      var idParent: number= -1;
      var type: string    = "";
      var jsonSubtemas: any = "";
      var jsonCapas: any = "";
      var subtemasArr: Array<string> = [];
      var capasArr: Array<string> = []; 
      const idPRoc    = parseInt(grupos.target.value);

      console.log("Grupo asociado =>",idPRoc);

      setselGrupo(grupos.target.value);

      setCapasAttr([]);
      setValor("");
      setValorState(true);

      for (var cont = 0; cont < jsonSERV.length; cont++) {
        idParent  = parseInt(jsonSERV[cont].parent);
        type      = jsonSERV[cont].type;
        //Búsqueda de subtemas
        if (idParent == idPRoc && type == 'tematica'){
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
      if (capasArr.length >= 0)
      {
        console.log("Capas Array Sin duplic =>", capasArr);
        setCapas(capasArr);
        setselCapas(undefined);
      }
    }
    //Por revisar - Optimización
    //@date 2024-05-23
    function procesaData(idPRoc)
    {
      var idParent: number= -1;
      var type: string    = "";
      var jsonSubtemas: any = "";
      var jsonCapas: any = "";
      var subtemasArr: Array<string> = [];
      var capasArr: Array<string> = []; 
      for (var cont = 0; cont < jsonSERV.length; cont++) {
        idParent  = parseInt(jsonSERV[cont].parent);
        type      = jsonSERV[cont].type;
        //Búsqueda de subtemas
        if (idParent == idPRoc && type == 'tematica'){
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
    function getAtributosCapa(capa)
    {      
      let urlCapa: string;
      let JsonAtrCapa: any =  "";
      let AtrCapaArr: any     = []; 
      let urlCapaJson: string;
      
      //Construcción de la URL del servicio, a partir del identificador de capa traido desde el campo Capa
      urlCapa     = getUrlFromCapa(capa.target.value, capas);
      urlCapaJson = urlCapa+"?f=json";
      console.log("URL capa =>",urlCapaJson);

      setCapasAttr([]);
      setValor("");
      setValorState(true);

      setselCapas(urlCapaJson);
            
      //Realización del consumo remoto, a través de la URL del servicio dado por el atributo urlCapaJson
        fetch(urlCapaJson, {
          method:"GET"
        })
        .then((rows) => rows.json())
        .then((data) => {
          //Rearmado estructura datos de atributos: name, alias          
          for (var cont = 0; cont < data.fields.length; cont++){            
            JsonAtrCapa = {
              "name":data.fields[cont].name,
              "alias":data.fields[cont].alias
            };
            AtrCapaArr.push(JsonAtrCapa);
          }
          console.log("Obj Attr Capas =>",AtrCapaArr);
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

    function getUrlFromCapa(idCapa, capasArr){
      //Recorrido por el array
      for (var cont = 0; cont < capasArr.length; cont++) {
        if (parseInt(capasArr[cont].idCapa) == parseInt(idCapa)) {
            return capasArr[cont].urlCapa;
        }
    }
      return -1;
    }

    /*
      enableValor => Método para habilitar el campo valor, cuando se selecciona un atributo, desde el campo atributo.
      @date 2024-05-27
      @author IGAC - DIP
      @dateUpdated 2024-05-31
      @changes Actualizar estado del control Atributo, para toma del valor del control
      @remarks remover estado ReadOnly
    */
    function enableValor(evt)
    {
      //State del control Valor
      setValorState(false);

      //State del control Atributo
      setselAttr(evt.target.value);
    }

    /*
      handleChangevalorTxt => Método para cambio de estado, en el campo Valor que permita setear contenido
      @date 2024-05-27
      @author IGAC - DIP
      @param (Object) event => objeto que representa el evento de cambui de valor en el control Valor
      @remarks FUENTE => https://www.geeksforgeeks.org/how-to-handle-input-forms-with-usestate-hook-in-react/
    */
    const handleChangevalorTxt = function (event) {
      //console.log("Estado actual =>",txtValorState);
      setValor(event.target.value);
    }
    /*
      limpiarCons => Método para remover las opciones de los campos Temna, Subtema, Grupo, Capa, Atributo y Valor
      @date 2024-05-28
      @author IGAC - DIP
      @param (Object) evt => Analizador de eventos asociado al control Limpiar
      @remarks Deseleccionar item en campo Tema en https://stackoverflow.com/questions/48357787/how-to-deselect-option-on-selecting-option-of-another-select-in-react
    */
    function limpiarCons(evt){
      //State del control Tema
      console.log("Handle Evt en limpiar =>",evt.target.value);
      setselTema({selected:evt.target.value});
      setTemas(temas);
      setSubtemas([]);
      setGrupos([]);
      setCapas([]);
      setCapasAttr([]);
      setValor("");
      setValorState(true);
    }
    
    /*
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
      @author IGAC - DIP
    */
    function consultaSimple(evt: { preventDefault: () => void; }){
      console.log("En implementación...");
      evt.preventDefault();
     
      const cond = selAttr + "=" +"'"+txtValor+"'";
      return tstDrawMap(selCapas, cond);
    }

    /**
     * Función prueba capacitación
     * @date 2024-05-30
     * @dateUpdated 2024-05-31
     * @changes Actualización Renderización al mapa base
     * @dateUpdated 2024-06-04
     * @changes Actualización atributo url en objeto queryFeatures
     * @dateUpdated 2024-06-05
     * @changes Reingeniería objeto featureLayerTst
     * @changes Reingenieria objeto queryFeatures (https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-Query.html)
     */
    async function tstDrawMap(selCapas, cond){
      
        //Gestión URL servicio de mapas
        // const selCapasURL = selCapas.replace("?f=json","");
        // console.log("URL para query =>",selCapasURL);
        console.log("Formulacion WHERE => ",cond);

        const url = 'https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/Ambiental_T_Ajustado/MapServer/14/query';
        const params = new URLSearchParams({
          where: "MUNICIPIO='Riosucio'",
          outFields: '*',
          f: 'json',
          returnGeometry: 'true'  // Importante para obtener la geometría
        });

        try {
          const response = await fetch(`${url}?${params.toString()}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const _responseConsultaSimple = await response.json();
          console.log({_responseConsultaSimple})
          setResponseConsultaSimple(_responseConsultaSimple || {});
        } catch (error) {

        }

    }


    
    //https://developers.arcgis.com/experience-builder/guide/add-layers-to-a-map/
    const activeViewChangeHandler = (jmv: JimuMapView) => {
      console.log("Ingresando al evento objeto JimuMapView...");
      if (jmv) {
        setJimuMapView(jmv);
      }
    };

    const drawFeaturesOnMap = async (jmv: JimuMapView) => {

      if(!ResponseConsultaSimple) return
      const {features, spatialReference} = ResponseConsultaSimple;
      if (!jmv || features.length === 0) return;
  

      const [/* GraphicsLayer, Graphic, Polygon, */ PopupTemplate] = await loadModules([
        // 'esri/layers/GraphicsLayer',
        // 'esri/Graphic',
        // 'esri/geometry/Polygon',
        'esri/PopupTemplate'
      ]);
  
      const graphicsLayer = new GraphicsLayer();
  
      features.forEach(feature => {

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

        const graphic = new Graphic({
          geometry: polygon,
          symbol: {
            type: 'simple-fill',
            color: "blue",
            outline: {
              color: "darkblue",
              width: 0.5
            }
          },
          attributes: feature.attributes,
          popupTemplate: popupTemplate
        });
  
        graphicsLayer.add(graphic);
      });
  
      jmv.view.map.add(graphicsLayer);
    };

    useEffect(() => {
      if (jimuMapView) {
        drawFeaturesOnMap(jimuMapView);
      }
    }, [jimuMapView, ResponseConsultaSimple]);
  

    //FUENTE: https://www.pluralsight.com/resources/blog/guides/how-to-get-selected-value-from-a-mapped-select-input-in-react#:~:text=To%20fetch%20the%20selected%20value,state%20to%20pass%20the%20value.
    //const selOptions = [{label:"Tema_11", value: "11"},{label:"Tema_22", value: "22"},{label:"Tema_3",value:"3"}];    
    useEffect(() =>
    {
      getJSONContenido(jsonSERV);      
    }, []);
    
    //console.log("=>",jsonSERV);
    //console.log("Temas =>",temas);

    //console.log("Array JSON SERV =>",jsonSERV);  
    //Evento sobre opción Consultar => onClick={consultaSimple}  
    
    return (
      <div  className="w-100 p-3 bg-primary text-white">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
        )}
        <form onSubmit={consultaSimple}>        
          <div className="mb-1">
            <Label size="default"> Tema </Label>
            <Select
                onChange={(e)=>{
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
          <div className="mb-1">
          <Label size="default"> Subtema </Label>
          <Select
            onChange={getGrupoOrCapa}
            placeholder="Seleccione subtema...">
            value={selSubtema}
            {
              subtemas.map(
                (option) => (
                  <option value={option.idTematica}>{option.nombreTematica}</option>
                )
              )
            }    

          </Select>
          </div>
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
          <div className="mb-1">
            <Label size="default"> Capa </Label>
            <Select
              onChange={getAtributosCapa}
              placeholder="Seleccione una capa:"
              >
              {
                capas.map(
                  (option) => 
                  <option value={option.idCapa}>{option.nombreCapa}</option>
                )
              } 
            </Select>
          </div>
          <div className="mb-1">
            <Label size="default"> Atributo </Label>
            <Select
              onChange={enableValor}
              placeholder="Seleccione un atributo:"            
            >
              {
                capasAttr.map(
                  (option) =>
                    <option value={option.alias}>{option.name}</option>
                )
              }
            </Select>
          </div>
          <div className="mb-1">
            <Label size="default"> Valor</Label>
            <TextInput placeholder="Escriba patrón de búsqueda" 
            onAcceptValue={function noRefCheck(){}}
            type="search" className="mb-4" required readOnly={txtValorState}
            value={txtValor} onChange={handleChangevalorTxt}></TextInput>
          </div>
          <div className="btns">
            <Button
              htmlType="submit"              
              size="default"
              type="default"              
            >
              Consultar
            </Button>
            <Button
              htmlType="button"
              onClick={limpiarCons}
              size="default"
              type="default"
            >
              Limpiar
            </Button>
          </div>
        </form>
        <div style={{ height: '100vh' }} ref={mapDiv}></div>
      </div>
    );
  };
  
  export default Widget;
/** 
    Componente para definición de filtros asociados a la búsqueda de firmas espectrales
    @date 2025-04-01
    @author IGAC - DIP
    @dateUpdated 2025-05-05
    @changes Inclusión componente GraphicsLayer
    @changes Inclusión componente Sketch
    @dateUpdated 2025-05-08
    @changes Movimiento de la clase Point desde componente ppal (widget)
    @dateUpdated 2025-05-23
    @changes Inclusión componente codDeptoDivip, para uso código divipola casos especiales
    @remarks Sección de importación
*/

import React, { useEffect } from 'react';
import { Button, Input, Label, Radio, Select, TextInput } from 'jimu-ui'; // import components

//Importación interfaces
import { typeMSM } from '../../types/InterfaceResponseBusquedaFirmas';

//Importación API
import { urls } from '../../../../api/servicios'; 

import { appActions } from 'jimu-core';

//Componente GraphicsLayer - 2025-05-05
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
//Componente Sketch - 2025-05-05
import Sketch  from "@arcgis/core/widgets/Sketch";

//Clase punto - 2025-04-02
import Point from "esri/geometry/Point";

//Importaciones varias
import { url } from 'inspector';
import { sync } from 'glob';
import { codDeptoDivip } from '../../types/dataDG';

/**
 * Componente FiltersSrcSIEC
 * Definición de filtros asociados a búsqueda de firmas
 * @date 2025-04-01
 * @author IGAC - DIP
 * @param jsonSERV
 * @param setJsonSERV
 * @param selCoberVal
 * @param setCoberState
 * @param radValueNav
 * @param setValueNav
 * @param txtValorLat
 * @param setValorLatState
 * @param txtValorLon
 * @param setValorLonState
 * @param selProyVal
 * @param setProyState
 * @param selCampaVal
 * @param setCampaState 
 * @param ResponseBusquedaFirma (NU)
 * @param setResponseBusquedaFirma
 * @param view
 * @param setView (NU)
 * @param jimuMapView
 * @param setAlertDial
 * @param mensModal (NU)
 * @param setMensModal (NU)  
 * @param drawing
 * @param setDrawing
 * @param setControlForms
 * @param controlForms 
 * @param props
 * @param coberLst
 * @param setCoberLst
 * @param proyLst
 * @param setProyLst
 * @param campaLst
 * @param setCampaLst
 * @param sketchWeb
 * @param txtValorLatSuIz 
 * @param lonPto
 * @param setLonPtoState
 * @param latPto
 * @param setLatRectState
 * @param lonSuIz
 * @param setLonSuIzState
 * @param latSuIz
 * @param setLatSuIzState
 * @param lonInDe
 * @param setLonInDeState
 * @param latInDe
 * @param setLatInDeState
 * @param initialExtent
 * @param jsonDpto
 * @param setJsonDptoState
 * @param jsonMpio
 * @param setJsonMpioState
 * @dateUpdated 2025-04-03
 * @changes Adicionar las opciones excluyentes "Seleccionar Area" y "Navegar" como radio buttons
 * @dateUpdated 2025-04-07
 * @changes Adicionar atributos selectedLayerId, drawing, setDrawing que controlan el dibujo del rectángulo sobre el mapa
 * @dateUpdated 2025-04-08
 * @changes Adicionar atributos selCoberVal, setCober, selProyVal, setProyState, selCampaVal, setCampaState
 * @dateUpdated 2025-04-09
 * @changes Adicionar atributos setControlForms, para el metodo consultaCatal
 * @dateUpdated 2025-04-14
 * @changes Incluir opción Cerrar Widget. 
 * @changes Cargue parámetro props.
 * @dateUpdated 2025-04-22
 * @changes Cargue parámetro coberLst
 * @changes Cargue parámetro setCoberLst
 * @changes Cargue parámetro proyLst
 * @changes Cargue parámetro setProyLst
 * @changes Cargue parámetro campaLst
 * @changes Cargue parámetro setCampaLst
 * @dateUpdated 2025-05-02
 * @changes Cargue parámetro sketchWeb
 * @changes Cargue parámetro txtValorLatSuIz
 * @changes Cargue parámetro setValorLatSuIzState
 * @changes Cargue parámetro txtValorLatInDe
 * @changes Cargue parámetro setValorLatInDeState
 * @changes Cargue parámetro txtValorLonSuIz
 * @changes Cargue parámetro setValorLonSuIzState
 * @changes Cargue parámetro txtValorLonInDe
 * @changes Cargue parámetro setValorLonInDeState
 * @dateUpdated 2025-05-05
 * @changes Supresión parámetro drawing
 * @changes Supresión parámetro setDrawing
 * @dateUpdated 2025-05-07
 * @changes Mapeo control proyecto donde opción corresponde al proyecto que se visualiza
 * @dateUpdated 2025-05-08
 * @changes Especificación coordenadas geográficas basado en un punto sobre el mapa, bajo opción Navegar
 * @changes Cargue parámetro rows, asociado al data Grid
 * @changes Cargue parámetro setRows, asociado al state parámetro rows (setter)
 * @dateUpdated 2025-05-09
 * @changes Cargue parámetro lonRect
 * @changes Cargue parámetro setLonRectState
 * @changes Cargue parámetro latRect
 * @changes Cargue parámetro setLatRectState
 * @changes Cargue parámetro lonRectSuIz
 * @changes Cargue parámetro setLonRectSuIzState
 * @changes Cargue parámetro latRectSuIz
 * @changes Cargue parámetro setLatRectSuIzState
 * @changes Cargue parámetro lonRectInDe
 * @changes Cargue parámetro setLonRectInDeState
 * @changes Cargue parámetro latRectInDe
 * @changes Cargue parámetro setLatRectInDeState
 * @dateUpdated 2025-05-12
 * @changes Fix validación coordenadas en modo Seleccionar Area o Navegar
 * @dateUpdated 2025-05-13
 * @changes Actualización atributo width en controles latitud, longitud a 7 posiciones
 * @dateUpdated 2025-05-14
 * @changes Cargue parámetro initialExtent
 * @changes Actualización parámetro lonRect => lonPto
 * @changes Actualización parámetro setLonRectState => setLonPtoState
 * @changes Actualización parámetro latRect => latPto
 * @changes Actualización parámetro setLatRectState => setLatPtoState
 * @changes Actualización parámetro lonRectSuIz => lonSuIz
 * @changes Actualización parámetro setLonRectSuIzState => setLonSuIzState
 * @changes Actualización parámetro latRectSuIz => latSuIz
 * @changes Actualización parámetro setLatRectSuIzState => setLatSuIzState
 * @changes Actualización parámetro lonRectInDe => lonInDe
 * @changes Actualización parámetro setLonRectInDeState => setLonInDeState
 * @changes Actualización parámetro latRectInDe => latInDe
 * @changes Actualización parámetro setLatRectInDeState => setLatInDeState
 * @changes Incluir opción "Limpiar filtro / mapa", basado en requerimiento del 2025-04-14
 * @dateUpdated 2025-05-19
 * @changes Cambio término opción Limpiar filtro / mapa => Limpiar
 * @dateUpdated 2025-05-22 
 * @changes Cargue parámetro jsonDpto
 * @changes Cargue parámetro setJsonDptoState
 * @changes Cargue parámetro jsonMpio
 * @changes Cargue parámetro setJsonMpioState
 * @remarks Fuente consulta https://mui.com/material-ui/react-radio-button
 * @returns (HTML)
 */
const FiltersSrcSIEC = function({jsonSERV, setJsonSERV, selCoberVal, setCoberState, coberLst, setCoberLst, radValueNav, setValueNav, txtValorLat, setValorLatState, txtValorLatSuIz, setValorLatSuIzState, txtValorLatInDe, setValorLatInDeState, txtValorLon, setValorLonState, txtValorLonSuIz, setValorLonSuIzState, txtValorLonInDe, setValorLonInDeState, lonPto, setLonPtoState, latPto, setLatPtoState, lonSuIz, setLonSuIzState, latSuIz, setLatSuIzState, lonInDe, setLonInDeState, latInDe, setLatInDeState,selProyVal, setProyState, proyLst, setProyLst, selCampaVal, setCampaState, campaLst, setCampaLst, ResponseBusquedaFirma, setResponseBusquedaFirma, view, setView, jimuMapView, setAlertDial, mensModal, setMensModal, setControlForms, controlForms, props, sketchWeb, setRows, initialExtent, jsonDpto, setJsonDptoState, jsonMpio, setJsonMpioState}){
  /*console.log("Verif valor state latitud =>", txtValorLat);
  console.log("Verif valor state longitud =>",txtValorLon);*/
  console.log("Verif Radio opc =>",radValueNav);
  if (radValueNav === 'selArea' && (txtValorLatSuIz && txtValorLonSuIz && txtValorLatInDe && txtValorLonInDe))
  {
    console.log("Verif coordenada lat Sup Izq =>", txtValorLatSuIz);

    console.log("Verif coordenada long Sup Izq =>", txtValorLonSuIz);

    console.log("Verif coordenada lat Inf Der =>", txtValorLatInDe);

    console.log("Verif coordenada long Inf Der =>", txtValorLonInDe);
  }
  if (radValueNav === 'navMap' && (txtValorLat && txtValorLon))
  {
    console.log("Verif coordenada lat pto =>", txtValorLat);
    console.log("Verif coordenada long pto =>", txtValorLon);
  }

  /**
   * Método ciclo vida componentDidUpdate => implementación de cierre del widget Buscar Firma, incluyendo la operación "reset" en cada uno de los controles del filtro.
   * @date 2025-04-15
   * @author IGAC - DIP
   * @dateUpdated 2025-05-02
   * @changes Invocar cierre del widget Sketch al cerrar
   * @dateUpdated 2025-05-05
   * @changes Recrear objeto asociado al widget Sketch, cuando éste no existe
   * @changes Actualizar atributo visible, asociado al objeto widget Sketch
   * @changes Borrar todos los polígonos de selección al cerrar widget
   * @dateUpdated 2025-05-06
   * @changes Implementar opciones radio "Navegar" o "Seleccionar Area"
   * @dateUpdated 2025-05-13
   * @changes Implementar borrado de markers en mapa, al cerrar widget
   * @dateUpdated 2025-05-14
   * @changes Uso del parámetro initialExtent, a través del método goToInitialExtent()
   * @remarks  
   */
  
  function componentDidUpdate ()
  {
      if (props.state === 'CLOSED'){
        console.log("Cerrado...");
        props.dispatch(appActions.closeWidget(props.widgetId));
        
        //Limpieza controles
        LimpiarControles();
        
        //Cierre widget Sketch
        if (typeof sketchWeb !== "undefined")
        {
          sketchWeb.visible = false;        
        }
        if (jimuMapView){
          jimuMapView.view.ui.remove(sketchWeb);
          jimuMapView.view.map.removeAll();
        }

        //Borrar todos los polígonos de selección
        if (typeof sketchWeb !== "undefined")
        {
          console.log("Sketch Web =>",sketchWeb);
          sketchWeb.layer.removeAll();
        }        

        //Fijar extent original
        goToInitialExtent(jimuMapView, initialExtent);
      }
      else
      {
        console.log("En pruebas widget abierto...");
        console.log("Estado del sketch =>",sketchWeb);
        console.log("Valor radio =>",radValueNav);

        //Validación para recrear objeto asociado al widget Sketch, cuando se selecciona opción "Seleccionar Area"
        if (radValueNav === 'selArea')
        {
          if (typeof sketchWeb === 'undefined')
          {
            //Creación capa gráficos
            const layerWeb = new GraphicsLayer();
            
            //Instanciación objeto sketch
            const sketchWeb = new Sketch({
              layer: layerWeb,                    
              creationMode: "update",
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
            console.log("Layer Web Graphics length =>",layerWeb.graphics.length);
          }
          //Validación widget Sketch existente y en memoria
          else
          {
            console.log("Visibilidad widget =>",sketchWeb.visible);
            if (!sketchWeb.visible){
              //Widget Sketch al mapa estando oculto el mismo
              jimuMapView.view.ui.add(sketchWeb, "bottom-right");
              //Actualización estado objeto sketch
              sketchWeb.visible = true;
              console.log("Componente sketch adicionado! =>",sketchWeb.visible);
            }
          }
        }
        else if (radValueNav === 'navMap')
        {
            console.log("Especificar punto del mapa!");
            if (jimuMapView) {
              jimuMapView.view.on('click', (evt) => {
                const pointMap: Point = jimuMapView.view.toMap({
                  x: evt.x,
                  y: evt.y
                })
                //Coordenadas decimales
                console.log("Verif coordenada lat =>",pointMap.latitude);
                console.log("Verif coordenada lon =>",pointMap.longitude);
                console.log("Verif coordenada lat filtro =>",pointMap.latitude.toFixed(3));
                console.log("Verif coordenada lon filtro =>",pointMap.longitude.toFixed(3));
                //Seteo en las variables de estado setValorLat y setValorLon las coordenadas latitud, longitud
                //setValorLatState(pointMap.latitude.toFixed(3)); 
                setValorLatState(pointMap.latitude.toString());
                setLatPtoState(pointMap.latitude.toFixed(3));
                //setValorLonState(pointMap.longitude.toFixed(3));
                setValorLonState(pointMap.longitude.toString());
                setLonPtoState(pointMap.longitude.toFixed(3));

                //Coordenadas rectangulares
                console.log("Verif coordenada lon (X) =>",pointMap.x);
                console.log("Verif coordenada lat (Y) =>",pointMap.y);
                
              });
            }
            //Actualización estado objeto sketch
            if (typeof sketchWeb !== 'undefined')
            {
              sketchWeb.visible = false;
              console.log("Componente sketch oculto! =>",sketchWeb.visible);
            }
        }
      }
    }

    /**
      getJSONData => método para cargue inicial del contenido en  servidor remoto
      @date 2025-04-08
      @author IGAC - DIP
      @param (String) jsonSERV => Variable que guarda la data traida del servidor
      @dateUpdated 2025-04-23
      @changes Implementar control de errores en la lógica de solicitud petición al servidor remoto.
      @dateUpdated 2025-04-29
      @changes Actualizar función en modo asincrónico en la operación fetch
      @return (String)
      @remarks FUENTE: https://www.freecodecamp.org/news/how-to-fetch-api-data-in-react/
      @remarks URL principal https://pruebassig.igac.gov.co/server/rest/services/FE_Edicion/MapServer/0/query?where=divipoladepto%3D%2717%27&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Kilometer&relationParam=&outFields=*&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson
  */
    async function getJSONData()
    {       
      const urlServicioSIEC = await getWhere('*', urls.firmasEsp, false,
        '1=1', '', '');
      try{
        await fetch(urlServicioSIEC,{
          method:"GET"
        })
        .then((rows) => {
          if (!rows.ok)
          {
            throw new Error(`HTTP error! status: ${rows.status}`);
          }
          return rows.json();
        })
        .then((data) => {
          
          console.log("Contenido json desde petición =>", data);
          console.log("Contenido longitud =>",data.features.length);
          //Seteo de los datos asociados desde el consumo del Web service
          setJsonSERV(data.features);

          //Cargue lista de municipios
          //OJO
        })
      }
      catch (error)
      {
        console.log("Error cargando data del server =>", error);
        throw error;
      }
    }

    /**
     * getJSONProyectos => método para cargue del contenido alusivo al listado de proyectos desde el servidor de contenidos
      @date 2025-04-08
      @author IGAC - DIP
      @param (String) jsonSERV => Data traida desde el consumo del servicio
      @dateUpdated 2025-04-22
      @changes Asignación listado de proyectos al state lista proyectos      
      @dateUpdated 2025-04-29
      @changes Adición opción [Todos] a la lista de proyectos
      @return (String)
      @remarks Adición de elementos a un array JSON en https://medium.com/@navneetskahlon/manipulating-immutable-json-arrays-in-javascript-insertion-update-and-deletion-728740af1693
     */

      async function getJSONProyectos()
      {
        var jsonSIEC: any;
        var proyectos = [];          
        console.log("Ingresando a proyectos data...=>",jsonSERV);
        
        //Obtener listado de proyectos
        for (var cont = 0; cont < jsonSERV.length; cont++)
        {
          //console.log("Contenido data.features"+" "+cont+" ",jsonSERV[cont].attributes);
            /*proyectos = data.features[cont].projectname;
            console.log("Proyecto "+cont+" =>",proyectos);*/           
            if (jsonSERV[cont].attributes.projectname != null)
            {
              jsonSIEC = {
                "objectid": jsonSERV[cont].attributes.objectid,
                "codigofirma": jsonSERV[cont].attributes.codigofirma,
                "projectname": jsonSERV[cont].attributes.projectname
              }
              proyectos.push(jsonSIEC);
              
            }
        }
        //Adicionar item [Todos]
        cont = 0;
        while (cont < proyectos.length)
        {
            jsonSIEC = {
              "objectid": "*",
              "codigofirma": "*",
              "projectname": "[Todos]"
            };
            proyectos.unshift(jsonSIEC);
            break;
        }        
        proyectos = procesaDuplic (proyectos, 'prj');

        //console.log("Lista proyectos incluyendo todos =>",proyArr);

        //Adicionar item         
        console.log("Lista proyectos FINAL=>",proyectos);
        
        //Seteo sobre el state asociado al listado de proyectos
        setProyLst(proyectos);
        
      }

    /**
     * Método getJSONCober => Obtener listado de coberturas
     * @date 2025-04-22
     * @author IGAC- DIP     
     * @returns (String) Listado de cobertura en formato JSON
     * @remarks asociado al método getJSONProyectos
     */
    function getJSONCober()
    {
        var jsonSIEC: any;
        var coberturaArr = [];
        //console.log("Ingresando a cobertura data...=>",jsonSERV);
        //Obtener listado de coberturas
        for (var cont = 0; cont < jsonSERV.length; cont++)
        {
          //console.log("Contenido data.features"+" "+cont+" ",jsonSERV[cont].attributes);
            /*proyectos = data.features[cont].projectname;
            console.log("Proyecto "+cont+" =>",proyectos);*/
            if (jsonSERV[cont].attributes.projectname != null && jsonSERV[cont].attributes.covertype != null)
            {
              jsonSIEC = {
                "objectid": jsonSERV[cont].attributes.objectid,
                "codigofirma": jsonSERV[cont].attributes.codigofirma,
                "covertype": jsonSERV[cont].attributes.covertype
              }
              coberturaArr.push(jsonSIEC);
            }
        }
        coberturaArr = procesaDuplic (coberturaArr, 'cov');
        //console.log("Lista coberturas =>",coberturaArr);
        //Actualización sobre el objeto coberLst
        setCoberLst(coberturaArr);
    }

    /**
     * getJSONDeptoLst => método para proporcionar Lista de departamentos proporcionado por el servicio dado en Departamentos
     * @date 2025-05-22
     * @author IGAC - DIP
     * @returns (String) Salida en formato JSON con el código y nombre del departamento resultado del consumo al servicio
     * @remarks Se desactiva llamado desde hook, por uso del servicio de municipios (https://pruebassig.igac.gov.co/server/rest/services/Indicadores_municipios/MapServer/0/)
     */
    const getJSONDeptoLst = async function ()
    {
      //Cargue lista de departamentos
      const urlDivipolaDptos = await getWhere('decodigo,denombre', urls.Departamentos, false, '1=1', '', '', '', '', '', '', ''); 
      console.log("URL consumo divipola Deptos =>",urlDivipolaDptos);
      try{
        await fetch(urlDivipolaDptos,{
          method:"GET"
        })
        .then((rows) => {
          if (!rows.ok)
          {
            throw new Error(`HTTP error! status: ${rows.status}`);
          }
          console.log("data JSON del servicio =>",rows);
          return rows.json();
        })
        .then((data) => {
          
          console.log("Contenido dptos json desde petición =>", data.features);
          console.log("Contenido longitud =>",data.features.length);
          
          //Seteo al State de departamentos
          setJsonDptoState(data.features);
        }) 
      }
      catch (error)
      {
        console.log("Error cargando data del server =>", error);
        throw error;
      } 
    }

    /**
     * getJSONMpioLst => método para proporcionar listado de municipios según Divipola
     * @date 2025-05-22
     * @author IGAC - DIP
     * @param codDpto
     * @dateUpdated 2025-05-23
     * @changes Optimizar cargue municipio, dado por parámetro codDpto
     * @returns (String) Salida en formato JSON con el código y nombre del municipio resultado del consumo al servicio
     * @remarks se desactiva llamado desde método generateRowsDG y se unifica
     */
    const getJSONMpioLst = async function (codDpto) {
      const urlDivipolaMpios = await getWhere('mpcodigo,mpnombre,decodigo,depto',urls.Municipios, false, "decodigo='"+codDpto+"'", '', '', '', '', '', '', '');
      console.log("URL consumo divipola mpios =>",urlDivipolaMpios);
      try{
        await fetch(urlDivipolaMpios,{
          method:"GET"
        })
        .then((rows) => {
          if (!rows.ok)
          {
            throw new Error(`HTTP error! status: ${rows.status}`);
          }
          console.log("data JSON del servicio =>",rows);
          const jsonData = rows.json();
          return jsonData;
        })
        .then((data) => {
          
          console.log("Contenido mpios json desde petición =>", data.features);
          console.log("Contenido longitud =>",data.features.length);
          
          //Seteo al State de municipios -- https://medium.com/@minduladilthushan/resolving-the-state-not-updating-immediately-issue-in-react-js-febf5959c0cf
          /* setJsonMpioState(() => {
            return data.features;
          });
          return data.features; */
          setJsonMpioState(data.features);
        })
        .catch (errFetch => {
          console.log("Error en fetch =>",errFetch);
        }) 
      }
      catch (error)
      {
        console.log("Error cargando data del server =>", error);
        throw error;
      } 
    }
    /**
     * getCampaByProj => Método para obtener listado de campañas asociado a un proyecto del filtro Proyecto (parámetro proy)
     * @date 2025-04-22
     * @author IGAC - DIP
     * @param proyId
     * @param proy
     * @dateUpdated 2025-04-29
     * @changes Inclusión de la opción [Todas] al control campañas, al seleccionar un proyecto, o al seleccionar todos en control Proyectos
     * @dateUpdated 2025-04-30
     * @changes Cuando se selecciona la opción "[Todos]" en control proyectos, desplegar todas las campañas
     * @dateUpdated 2025-05-07
     * @changes Fix Lista campañas, al seleccionar del control Proyecto, la opción [Todos], se visualizan todas las campañas
     * @remarks asociado al método getJSONProyectos
     */
    function getCampaByProj (proyId, proy)
    {
      console.log("ID proyecto asociado =>",proyId);
      console.log("Proy =>",proy);

      var jsonSIEC: any;
      var campaArr = [];
      
      //console.log("Ingresando a cobertura data...=>",jsonSERV);
      console.log("Longitud campaña Lst =>",campaLst.length);
      if (campaLst.length >= 0)
      {
        setCampaLst([]);  
      } 
      //Procesar el id del proyecto, cuando la opción es [Todos]
      if (proyId === '[Todos]')
      {
        proyId = proyId.replace('[Todos]','*');
      }
      //Obtener listado de campañas asociado al proyecto
      for (var cont = 0; cont < jsonSERV.length; cont++)
      {
        //console.log("Contenido data.features"+" "+cont+" ",jsonSERV[cont].attributes);
        /*proyectos = data.features[cont].projectname;
        console.log("Proyecto "+cont+" =>",proyectos);*/
        if ((jsonSERV[cont].attributes.projectname != null && 
            (jsonSERV[cont].attributes.projectname === proy || proyId === "*")
            ) && jsonSERV[cont].attributes.campananame != null)
        {
          jsonSIEC = {
            "objectid": jsonSERV[cont].attributes.objectid,
            "codigofirma": jsonSERV[cont].attributes.codigofirma,
            "projectname": jsonSERV[cont].attributes.projectname,
            "campananame": jsonSERV[cont].attributes.campananame
          }
          campaArr.push(jsonSIEC);
        }
      }
      campaArr = procesaDuplic (campaArr, 'cam');
      
      //Incluir la opción Todas
      //{"objectid": "*","codigofirma": null, "projectname": null, "campananame": "[Todas]"}
      jsonSIEC = {
        "objectid": "*",
        "codigofirma": "*",
        "projectname": null,
        "campananame": "[Todas]"
      };
      campaArr.unshift(jsonSIEC); 
      console.log("Lista campañas =>",campaArr);
      
      //Set al state de campañas
      setCampaLst(campaArr);
    }
    /**
     * Método para construcción de la cláusula WHERE asociado al servicio de firmas espectrales.
     * @date 2025-04-16
     * @author IGAC - DIP
     * @param OutFields = '*'
     * @param url
     * @param returnGeometry = false
     * @param where = '1=1'
     * @param inputGeometry
     * @param geometryType
     * @param insr
     * @param spatialRel
     * @dateUpdated 2025-05-08
     * @changes Inclusión parametro inputGeometry para registro de coordenadas latitud, longitud
     * @changes Inclusión parametro geometryType para registro de coordenadas latitud, longitud
     * @changes Inclusión parametro insr para registro de coordenadas latitud, longitud
     * @changes Inclusión parametro spatialRel para registro de coordenadas latitud, longitud
     * @dateUpdated 2025-05-09
     * @changes Corrección parámetro base inputGeometry => geometry
     * @changes Corrección parámetro where '1=1' => ''
     * @dateUpdated 2025-05-12
     * @changes Adición parámetro outSR
     * @remarks módulo obtenido del proyecto REFA, fuente module.ts 
     */
    const getWhere = 
      async function(
        OutFields='*',
        url,
        returnGeometry=false,
        where='',
        outStatistics ='',
        groupByFieldsForStatistics='',
        inputGeometry='',
        geometryType='',
        insr='',
        spatialRel='',
        outSR='' 
      ) {
        //console.log("Ingreso...");
        var finalUrl: string;
        const controller= new AbortController();    
        try {
          // Construcción de parámetros base
          const baseParams = new URLSearchParams({
            where: where,
            returnGeometry: returnGeometry.toString(),
            f: 'pjson'
          });
          
          // Adición parámetros adicionales según el tipo de consulta
          if (inputGeometry && inputGeometry.length > 0){
            baseParams.append('geometry', inputGeometry.toString());
          }
          if (geometryType && geometryType.length > 0){
            baseParams.append('geometryType', geometryType.toString());
          }
          if (insr && insr.length > 0){
            baseParams.append('inSR', insr.toString());
          }
          if (spatialRel && spatialRel.length > 0){
            baseParams.append('spatialRel', spatialRel.toString());
          }
          if (outSR && outSR.length > 0)
          {
            baseParams.append('outSR',outSR.toString()); 
          }
          
          // Agregar parámetros específicos según el tipo de consulta
          if (outStatistics && outStatistics.length > 0) {
            baseParams.append('groupByFieldsForStatistics', groupByFieldsForStatistics);
            baseParams.append('outStatistics', outStatistics);
          }
          else if (OutFields) {
            baseParams.append('outFields', OutFields);
          }          
          else {
            throw new Error('Debe proporcionar OutFields o outStatistics o inputGeometry o Input Spatial Reference o Spatial Relationship');
          }
          // Construir URL final
          finalUrl = `${url}/query?${baseParams.toString()}`;
          //console.log("=>",finalUrl);
          return finalUrl.toString();
        }
        catch (error)
        {
          console.error('Error en realizarConsulta:', error);
          throw error;
        }
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

    
    
    
    /**
     * método procesaDuplic => Verifica unicidad de elementos en un array tipo JSON
     * @param (Array) arrResult => Array con items duplicados
     * @param (String) opc => opción para filtrado.
     * @date 2024-06-27
     * @author IGAC - DIP
     * @dateUpdated 2025-04-16
     * @changes Adicionar parametro opc, correspondiente al objeto que se filtra
     * @dateUpdated 2025-04-22
     * @changes Adicionar opción 'cov', correspondiente a la cobertura
     * @dateUpdated 2025-05-07
     * @changes Caso 'cam' => Actualización filtro campañas unicas (t.campananame === obj.campananame && t.projectname === obj.projectname => t.campananame === obj.campananame)
     * @returns (Array) Array JSON sin items duplicados
     * @remarks método obtenido desde URL https://www.geeksforgeeks.org/how-to-remove-duplicates-in-json-array-javascript/
     */
    
    function procesaDuplic(arrResult, opc){
      let newArrResult = [];
      switch (opc)
      {
        case 'prj':
        {
          newArrResult = arrResult.filter((obj, index, self) =>
            index === self.findIndex((t) => (
              t.projectname === obj.projectname
            )));
          return newArrResult;           
        }
        case 'cam':
        {
          newArrResult = arrResult.filter((obj, index, self) =>
            index === self.findIndex((t) => (              
              t.campananame === obj.campananame
            )));
          return newArrResult; 
        }
        case 'cov':
        {
          newArrResult = arrResult.filter((obj, index, self) =>
      index === self.findIndex((t) => (
          t.covertype === obj.covertype
      )));
          return newArrResult; 
        }
        default:
        {
          newArrResult = arrResult.filter((obj, index, self) =>
            index === self.findIndex((t) => (
              t.objectid === obj.objectid && t.projectname === obj.projectname && t.campananame === obj.campananame
            )));
          return newArrResult; 
        }
      }
      
  }
   
    /** 
      handleTxtChangevalor => Método para cambio de estado, en el campo Latitud que permita setear contenido
      @date 2025-04-02
      @author IGAC - DIP
      @param (Object) event => objeto que representa el evento de cambio de valor en el control Valor
      @dateUpdated 2025-05-02
      @changes Borrado del polígono asociado al mapa, al traer coordenadas en los controles
      @remarks FUENTE => https://www.geeksforgeeks.org/how-to-handle-input-forms-with-usestate-hook-in-react/
    */
      const handleTxtChangevalor = function (event) {
        //console.log("Estado actual =>",txtValorState);
        setValorLatState(event.target.value);
        //Borrar polígono de selección - En curso
        //jimuMapView.view.ui.delete(sketchWeb);
      }
    /**
     * handleTxtChangevalorLon => Método para cambio de estado, en el campo Longitud que permita setear contenido
      @date 2025-04-02
      @author IGAC - DIP
      @param (Object) event => objeto que representa el evento de cambui de valor en el control Valor
      @remarks FUENTE => https://www.geeksforgeeks.org/how-to-handle-input-forms-with-usestate-hook-in-react/
     */
    const handleTxtChangevalorLon = function (event) {
      //console.log("Estado actual =>",txtValorState);
      setValorLonState (event.target.value);
    }

    /**
     * handleChkChange => Método para cambio de estado, en las opciones "Seleccionar Area" y "Navegar"
     * @date 2025-04-03
     * @author IGAC - DIP
     * @param event
     * @dateUpdated 2025-04-07
     * @changes Asignar valor del state, cuando no es vacío.
     * @remarks Valor del evento asociado event.target.value
     */
    const handleChkChange = function (event) {       
      if (event.target.value != ''){
        setValueNav(event.target.value);
      }
      //console.log("Valor del state =>",radValueNav);
    }

    /**
    * Método toggleDrawing => Opción Radio asociada al control Seleccionar Area o Navegar
    * @date 2025-04-07
    * @author IGAC - DIP
    * @remarks Tomado del widget Selección Espacial (SelectWidget)
    */
  /* const toggleDrawing = function(event) {
    //Pruebas vars
    //Seteo del valor
    handleChkChange(event);
  } */
    /**
      consultaCatal => método que realiza la consulta, seleccionando la opción Buscar en catálogo
      @date 2025-04-08
      @author IGAC - DIP
      @param (event) evt
      @dateUpdated 2025-04-09
      @changes Inclusión validación campos requeridos
      @dateUpdated 2025-05-05
      @changes Fix validación campos requeridos, excluyendo las opciones Seleccionar Area o Navegar, por estar selecciona Seleccionar Area por defecto
      @dateUpdated 2025-05-06
      @changes Fix validación campos requeridos, coordenadas latitud y longitud asociado a las esquinas Sup Der e Inf Izq
      @dateUpdated 2025-05-07
      @changes Invocación método getJSONFilter()
      @dateUpdated 2025-05-08
      @changes Fix validación campos requeridos, coordenadas latitud y longitud asociado a un punto (modo Navegar)
      @dateUpdated 2025-05-14
      @changes Borrado de markers anteriores, al procesar la opción Buscar en catálogo
      @dateUpdated 2025-05-16
      @changes Llamado método borradoMarkers() para borrado de markers anteriores
    */
      function consultaCatal(evt: { preventDefault: () => void; }){
        //console.log("En pruebas...");
        evt.preventDefault();
        //var cond = "";
       
        //Cargue valores filtros
         //Cobertura
       /*  console.log("Cobertura =>",selCoberVal);
        //Opc
        console.log("Modo coordenadas =>",radValueNav);
        //Coord Lat - Sup Izq
        console.log("Latitud Esq Sup Izq =>",txtValorLatSuIz);
        //Coord Lon - Sup Izq
        console.log("Longitud Esq Sup Izq  =>",txtValorLonSuIz);
        //Coord Lat - Inf Der
        console.log("Latitud Esq Inf Der =>",txtValorLatInDe);
        //Coord Lon - Inf Der
        console.log("Longitud Esq Inf Der  =>",txtValorLonInDe);
        //Proyecto
        console.log("Proyecto asociado =>",selProyVal);   
        //Campaña
        console.log("Campaña asociada =>",selCampaVal); */
  
        //Inclusión validación para campos requeridos (al menos 1 es requerido)
        if (typeof selCoberVal === "undefined" && (txtValorLatSuIz.trim() === "" && txtValorLatInDe.trim() === "") && ((txtValorLonSuIz.trim() === "" && txtValorLonInDe.trim() === "") && (txtValorLat.trim() === "" && txtValorLon.trim() === "")) &&  typeof selProyVal === "undefined" && typeof selCampaVal === "undefined")
        {
          console.log("Error, campos requeridos...");
          setAlertDial(true);
          
          setMensModal({
            deployed: true,
            type: typeMSM.error,
            tittle: 'Campos requeridos no diligenciados',
            body: 'Se requiere diligenciar los campos del filtro!'
          });
          return;
        }   
        //Borrado markers anteriores
        borradoMarkers(jimuMapView);
        
        //Actualización estado que asocia la renderización del data grid
        setControlForms(true);
        console.log("Datos correctos...");
        console.log("Estado DG =>",controlForms);
        //Invocación generación data con base al filtro especificado
        getJSONFilter();
      }

      /**
         * método getJSONFilter() => obtener data del servicio, con base al filtro especificado
         * @date 2025-05-07
         * @author IGAC - DIP
         * @dateUpdated 2025-05-08
         * @changes Implementación geometria dada por las coordenadas Latitud, longitud
         * @dateUpdated 2025-05-09
         * @changes Actualización geometria dada por las coordenadas espaciales rectángulares (X, Y)
         * @changes Definición tipo de geometría (Polígono o Punto)
         * @changes Actualizar campos de salida en consulta al servicio
         * @dateUpdated 2025-05-12
         * @changes Actualizar parámetro Output Spatial Reference, al llamado del método getWhere()
         * @changes Actualizar parámetro Input Spatial Reference, al llamado del método getWhere()
         * @dateUpdated 2025-05-14
         * @changes Realizar borrado del objeto rows, que maneja el dataGrid, antes de obtener la data del servicio
         * @changes Fix validación, para coordenadas geográficas se valide cuando se especifican las mismas. De lo contrario, no se adiciona parámetro de selección de coordenadas
         * @dateUpdated 2025-05-15
         * @changes Bug procesamiento sentencia tGeometry
         * @changes Fix selección para caso Proyectos, Campañas
         * @dateUpdated 2025-05-19
         * @changes Fix selección para caso Proyectos, Campañas (proyecto y campaña)
         * @dateUpdated 2025-05-20
         * @changes Fix selección para caso Proyectos, Campañas (proyecto todos y campaña)
         * @dateUpdated 2025-05-22
         * @changes invocación método getSelectedDataFilter() para optimizar consumo sobre data grid
         * @returns (String)
         */
      const getJSONFilter = async function(){
        var where:string;
        var geomCoords:string;
        var tGeometry:string;
        geomCoords = "";
        where     = "";
        tGeometry = "";
        console.log("Datos correctos =>");
        //Cobertura
        console.log("Cobertura =>",selCoberVal);
        //Opc
        console.log("Modo coordenadas =>",radValueNav);
        
        //Proyecto
        console.log("Proyecto asociado =>",selProyVal);   
        //Campaña
        console.log("Campaña asociada =>",selCampaVal);

        //Procesamiento del where
        //Cobertura
        if (typeof selCoberVal !== 'undefined')
        {
          where = "covertype='"+selCoberVal+"'";
        }
        //Coordenadas Geográficas
        //Punto Modo coordenadas opción  Navegar
        //Latitud y Longitud
        //parametro Input Geometry
        if (radValueNav === 'navMap')
        {
          console.log("Latitud pto =>", txtValorLat);
          console.log("Longitud pto =>", txtValorLon);
          /* console.log("Pto Longitud (X) =>", lonRect);
          console.log("Pto Latitud (Y) =>", latRect); */
          if ((typeof txtValorLat !== 'undefined' && txtValorLat !== '') && (typeof txtValorLon !== 'undefined' && txtValorLon !== ''))
          {            
            geomCoords = txtValorLon+","+txtValorLat;
            tGeometry = 'esriGeometryPoint';
          }
        }
        //Coordenadas Geográficas
        //Polígono Modo coordenadas opción Seleccionar Area
        //Latitud y Longitud
        //parametro Input Geometry     
        else if (radValueNav === 'selArea')
        {
          //Coord Lat - Sup Izq
          console.log("Latitud Esq Sup Izq =>",txtValorLatSuIz);
          //Coord Lon - Sup Izq
          console.log("Longitud Esq Sup Izq  =>",txtValorLonSuIz);
          //Coord Lat - Inf Der
          console.log("Latitud Esq Inf Der =>",txtValorLatInDe);
          //Coord Lon - Inf Der
          console.log("Longitud Esq Inf Der  =>",txtValorLonInDe);
          
          //Coord Lat (Y) - Sup Izq
          /* console.log("Latitud (Y) Esq Sup Izq =>",latRectSuIz);
          //Coord Lon (X) - Sup Izq
          console.log("Longitud Esq Sup Izq  =>",lonRectSuIz);
          //Coord Lat (Y) - Inf Der
          console.log("Latitud Esq Inf Der =>",latRectInDe);
          //Coord Lon (X)- Inf Der
          console.log("Longitud Esq Inf Der  =>",lonRectInDe); */
          if (((typeof txtValorLatSuIz !== 'undefined' && txtValorLatSuIz !== '') && (typeof txtValorLatInDe !== 'undefined' && txtValorLatInDe !== '')) && ((typeof txtValorLonSuIz !== 'undefined' && txtValorLonSuIz !== '') && (typeof txtValorLonInDe !== 'undefined' && txtValorLonInDe !== '')))
          {            
            geomCoords = txtValorLonSuIz+","+txtValorLatSuIz+","+txtValorLonInDe+","+txtValorLatInDe;
            tGeometry = 'esriGeometryEnvelope';
          }
        }
        //Proyecto
        if (typeof selProyVal !== 'undefined')
        {
          if (selProyVal === '[Todos]')
          {            
            selProyVal = selProyVal.replace('[Todos]','*');
            setProyState (selProyVal.replace('[Todos]','*'));
          }
          if (typeof where !== 'undefined')
          {
            if (where.length > 0 && selProyVal !== '*')
            {
              where = where + " "+ "AND" + " " + "projectname='"
            +selProyVal+"'";
            }
            else if (selProyVal !== '*')
            {
              where = "projectname='"+selProyVal+"'";
            }
           /*  else
            {
              where = "projectname='"+selProyVal+"'";
            } */
          }
          else if (selProyVal !== '*')
          {
            where = "projectname='"+selProyVal+"'";
          }
        }
        //Campaña
        if (typeof selCampaVal !== 'undefined')
        {
          if (selCampaVal === '[Todas]')
          {            
            selCampaVal = selCampaVal.replace('[Todas]','*');
            setCampaState (selCampaVal.replace('[Todas]','*'));
          }
          //Filtro por campaña
          //campaña y proyecto
          if (selCampaVal !== '*' && selProyVal !== '*')
          {
           /* console.log("Proyecto y campaña!");
             console.log("PRoyecto =>",selProyVal);
            console.log("Campaña =>",selCampaVal);  */
            if (typeof where !== 'undefined')
            {
              if (where.length > 0)
              {
                where = where + " " + "AND" + " " + "campananame='"+selCampaVal+"'";
              }
            }
            //Campaña
            else
            {
              where = "campananame='"+selCampaVal+"'";
            }
          }
          //Filtro por campaña con todos los proyectos
          else if (selProyVal === '*' && selCampaVal !== '*')
          {
            if (typeof where !== 'undefined') 
            {
              if (where.length > 0)
              {
                where = where + " "+ "AND" + " " + "campananame='"+selCampaVal+"'";
              }
              else
              {
                where = "campananame='"+selCampaVal+"'";
              }
            }
            else
            {
              where = "campananame='"+selCampaVal+"'";
            }
          }
          //Filtro para todos proyectos y todas campañas y cobertura no definida => todos los registros del sistema 
          else if (selCampaVal === '*' && selProyVal === '*' && typeof selCoberVal === 'undefined')
          {
            where = "1=1";
          }
        }
        console.log("Criterio where =>",where);
        console.log("Criterio Input Geometry =>",geomCoords);

        //Se usa la petición para paso de parámetros
        const urlServicioSIEC = await getWhere('objectid,codigofirma,projectname,campananame,covertype,divipoladepto,divipolamunicipio,sealevelaltitude,instrumentname,photosignature,spectralintegrity', urls.firmasEsp, true, where, '', '', geomCoords, tGeometry, '4326', 'esriSpatialRelIntersects', '3857');
        
        console.log("URL consumo =>", urlServicioSIEC);
        
        //Limpieza del data Grid antes de obtener la información del servicio
        setRows([]);

        //Consumo del servicio
        getSelectedDataFilter(urlServicioSIEC);
      }

    /**
     * getSelectedDataFilter => método para traer los registros sobre el componente Data Grid
     * @date 2025-05-22
     * @author IGAC - DIP
     * @remarks Optimización sobre el método getJSONFilter()
     */
    const getSelectedDataFilter = async function(urlServicioSIEC){
      try{
        await fetch(urlServicioSIEC,{
          method:"GET"
        })
        .then((dataRows) => {
          if (!dataRows.ok)
          {
            throw new Error(`HTTP error! status: ${dataRows.status}`);
          }
          return dataRows.json();
        })
        .then((dataJSON) => {
          console.log("Data traida desde remoto...",dataJSON);
         
          //PRocesar generación filas data grid
          generateRowsDG(dataJSON.features);

        });
      }
      catch (error){
        console.log("Error generado =>",error);
      }
    }
    /**
     * generateRowsDG => método para generar las filas del DataGrid
     * @date 2025-05-08
     * @author IGAC - DIP
     * @param dataJSON => features asociados a la data del server
     * @param geomDataJSON => Geometria asociados a los features desde server
     * @dateUpdated 2025-05-09
     * @changes Incluir columna código firma (codigofirma)
     * @changes Incluir columna instrumento (instrumentname)
     * @changes Incluir columna Altura snm (sealevelaltitude)
     * @changes Incluir columna foto firma (archivo) (photosignature)
     * @changes Incluir columna % pureza (spectralintegrity)
     * @changes Incluir columna Proyecto (projectname)
     * @changes Incluir columna Campaña (campananame)
     * @dateUpdated 2025-05-12
     * @changes Procesar geometria dadas en la localización del array geometry (coordenadas X e Y)
     * @dateUpdated 2025-05-15
     * @changes Fix validación parámetro dataJSON, el cual debe estar definido.
     * @changes Fix armado estructura JSON para registros con geometría existente
     * @changes Inclusión validación para filtrar departamentos y municipios válidos (cuando no son nulos)
     * @changes Actualización objeto rows, asociado al componente tablaResultSrcSIEC
     * @dateUpdated 2025-05-22
     * @changes Búsqueda departamento, para obtener el nombre correspondiente
     * @dateUpdated 2025-05-23
     * @changes Búsqueda municipio, para obtener el nombre correspondiente
     * @changes Búsqueda departamento código 11 (Bogotá)
     * @changes Invocación listado de municipios con código departamento
     * @dateUpdated 2025-05-26
     * @changes Separación con espacio el municipio y su correspondiente departamento
     */
    
      const generateRowsDG = async function (dataJSON){
      var jsonArr = [];
      var jsonStr, urlDivipolaMpios: any;
      var codDptoDivipola, codMpioDivipola: string;
      var deptoJSON = [];
      
      console.log("Contenido dptos json traidos al state =>",jsonDpto);
      if (typeof dataJSON !== 'undefined' && dataJSON.length > 0)
      {
        for (var cont = 0; cont < dataJSON.length; cont++){
          if (dataJSON[cont].attributes.divipolamunicipio !== null && dataJSON[cont].attributes.divipoladepto !== null){
            //Copia del código Dpto
            codDptoDivipola = dataJSON[cont].attributes.divipoladepto;
            //Copia del código Mpio
            codMpioDivipola = dataJSON[cont].attributes.divipolamunicipio;

            //Búsqueda del departamento
            console.log("Depto Src =>",codDptoDivipola);
            //Recorrido de deptos excluido código 11
            for (var contDpto = 0; contDpto < jsonDpto.length; contDpto++)
            {
              if (jsonDpto[contDpto].attributes.decodigo === codDptoDivipola)
              {
                // console.log("Depto asociado =>",jsonDpto[contDpto].attributes.denombre);
                //Asignación nombre departamento por su codigo
                dataJSON[cont].attributes.divipoladepto = jsonDpto[contDpto].attributes.denombre;
              }
            }
            //Procesamiento municipios
            //Búsqueda del Municipio por el código del departamento
            //Caso especial, búsqueda departamento con código 11 asociado Bogotá
            if (codDptoDivipola === codDeptoDivip.codDepto)
            {
              urlDivipolaMpios = await getWhere('mpcodigo,mpnombre,decodigo,depto',urls.Municipios, false, "mpcodigo='"+codDptoDivipola+codMpioDivipola+"'", '', '', '', '', '', '', '');  
            }
            else
            {
              urlDivipolaMpios = await getWhere('mpcodigo,mpnombre,decodigo,depto',urls.Municipios, false, "decodigo='"+codDptoDivipola+"'", '', '', '', '', '', '', '');
            } 
            console.log("URL consumo divipola mpios =>",urlDivipolaMpios);
            try{
              await fetch(urlDivipolaMpios,{
                method:"GET"
              })
              .then((rows) => {
                if (!rows.ok)
                {
                  throw new Error(`HTTP error! status: ${rows.status}`);
                }
                console.log("data JSON del servicio =>",rows);
                const jsonData = rows.json();
                return jsonData;
              })
              .then((data) => {
                
                console.log("Contenido mpios json desde petición =>", data.features);
                console.log("Contenido longitud =>",data.features.length);
                
                setJsonMpioState(data.features);
                
                console.log("Array Mpios obtenido del depto"+" ",codDptoDivipola+"=>",data.features);

                //Recorrido para búsqueda de municipio desde servicio municipios
                for (var contMpio = 0; contMpio < data.features.length; contMpio++)
                {
                  console.log("Revisión Mpio =>",dataJSON[cont].attributes.divipoladepto);
                  //Caso especial, búsqueda departamento con código 11 asociado Bogotá
                  if (codDptoDivipola === codDeptoDivip.codDepto && data.features[contMpio].attributes.mpcodigo === codDptoDivipola + codMpioDivipola)
                  {
                    dataJSON[cont].attributes.divipoladepto = data.features[contMpio].attributes.mpnombre;
                    dataJSON[cont].attributes.divipolamunicipio = data.features[contMpio].attributes.mpnombre;
                  }
                  //Municipios
                  else if (data.features[contMpio].attributes.decodigo === codDptoDivipola && data.features[contMpio].attributes.mpcodigo === codDptoDivipola + codMpioDivipola)
                  {
                    //Asignación nombre municipio por su código
                    dataJSON[cont].attributes.divipolamunicipio = data.features[contMpio].attributes.mpnombre;
                  }
                }
              })
              .catch (errFetch => {
                console.log("Error en fetch =>",errFetch);
              }) 
            }
            catch (error)
            {
              console.log("Error cargando data del server =>", error);
              throw error;
            }
            
            //Validación geometría desde el servicio
            if (typeof dataJSON[cont].geometry !== 'undefined'){
              //Búsqueda del departamento
              for (var contDpto = 0; contDpto < jsonDpto.length; contDpto++)
              {
                if (dataJSON[cont].attributes.divipoladepto === jsonDpto[cont].attributes.decodigo)
                {
                  //Asignación nombre departamento por su codigo
                  dataJSON[cont].attributes.divipoladepto = jsonDpto[cont].attributes.denombre;
                }
              }
              jsonStr = {
                "id": dataJSON[cont].attributes.objectid,
                "type": dataJSON[cont].attributes.covertype,
                "codSig": dataJSON[cont].attributes.codigofirma,
                "ins": dataJSON[cont].attributes.instrumentname,
                "alsnm": dataJSON[cont].attributes.sealevelaltitude,
                "proj": dataJSON[cont].attributes.projectname,
                "camp": dataJSON[cont].attributes.campananame,
                "locat": dataJSON[cont].attributes.divipolamunicipio + " " + "("+dataJSON[cont].attributes.divipoladepto + ")",
                "phSig": dataJSON[cont].attributes.photosignature,
                "speInteg": dataJSON[cont].attributes.spectralintegrity,
                "pointX": dataJSON[cont].geometry.x,
                "pointY": dataJSON[cont].geometry.y
              }
            }
            //No existe geometría asociada al registro del DG
            else
            {
              jsonStr = {
                "id": dataJSON[cont].attributes.objectid,
                "type": dataJSON[cont].attributes.covertype,
                "codSig": dataJSON[cont].attributes.codigofirma,
                "ins": dataJSON[cont].attributes.instrumentname,
                "alsnm": dataJSON[cont].attributes.sealevelaltitude,
                "proj": dataJSON[cont].attributes.projectname,
                "camp": dataJSON[cont].attributes.campananame,
                "locat": dataJSON[cont].attributes.divipolamunicipio + " " + "("+dataJSON[cont].attributes.divipoladepto + ")",
                "phSig": dataJSON[cont].attributes.photosignature,
                "speInteg": dataJSON[cont].attributes.spectralintegrity
              }
            }
            jsonArr.push(jsonStr);
          }
        }
        console.log("Array resultante data =>",jsonArr);
        //Seteo al state asociado a las filas del Data Grid
        setRows(jsonArr);

        //Ubicar markers según consulta
        /* console.log("Candidato marker X =>",jsonArr[0].pointX);
        console.log("Candidato marker Y =>",jsonArr[0].pointY); */
      }
    }
    
    /**
     * Método handleSelCoberChange => Método para procesar el dato asociado al campo Cobertura
     * @date 2025-04-08
     * @author IGAC - DIP
     * @param evt => Evento del control asociado
     * @remarks Establecimiento del campo Cobertura con su state
     */
    const handleSelCoberChange = function(evt){      
      setCoberState (evt.target.value);
    }

    /**
     * Método handleSelProyChange => Método para procesar el dato asociado al control Proyecto
     * @date 2025-04-08
     * @author IGAC - DIP
     * @param evt => Evento del control asociado
     * @dateUpdated 2025-04-22
     * @changes Llamado al método getCampaByProj, para obtener campañas asociadas, con código proyecto conocido
     * @remarks Establecimiento del campo Proyecto con su state
     * @remarks Consulta control proyectos, opción text en https://stackoverflow.com/questions/30306486/get-selected-option-text-using-react-js
     */
    const handleSelProyChange = function(evt){
      var idProy = evt.target.value;
      var proyTxt = evt.nativeEvent.target.textContent;
      setProyState (idProy);
      
      //Carga de campaña asociado el proyecto
      getCampaByProj(idProy, proyTxt);
    }

    /**
     * Método handleSelCampaChange => Método para procesar el dato asociado al control Campaña
     * @date 2025-04-08
     * @author IGAC - DIP
     * @param evt => Evento del control asociado
     * @remarks Establecimiento del campo Campaña con su state
     * 
     */    
    const handleSelCampaChange = function(evt){
      setCampaState(evt.target.value);
    }

    /**
     * Método closeWidget => Cierra el widget, destruyendo los objetos asociados al mismo
     * @date 2025-04-14
     * @author IGAC - DIP
     * @param evt
     * @dateUpdated 2025-05-16
     * @changes Desactivación método por no uso en el widget
     * @remarks Fuente de consulta en: https://community.esri.com/t5/arcgis-web-appbuilder-questions/close-destroy-widget-a-from-widget-b-on-clear/m-p/1206707#M22459
     */

    /* const closeWidgetEvt = function(evt: { preventDefault: () => void; }){
      evt.preventDefault();
      console.log("Cerrando...", props);
      props.dispatch(appActions.closeWidget(props.widgetId));
      //Limpieza controles
      LimpiarControles();
    } */

    /**
     * Método limpiarControlesFilter => Borrado de controles asociado al componente FiltersSrcSIEC
     * @date 2025-05-16
     * @author IGAC - DIP
     * @param evt  
     * @dateUpdated 2025-05-19
     * @changes Ejecución extent inicial, al seleccionar la opción limpiar filtro / mapa
     * @remarks Basado en método closeWidgetEvt()
     */
    const limpiarControlesFilter = function(evt: { preventDefault: () => void; })
    {
      evt.preventDefault();
      //Limpieza controles
      LimpiarControles();
      //Borrado markers anteriores      
      borradoMarkers(jimuMapView);
      //Ejecutar extent inicial
      goToInitialExtent(jimuMapView, initialExtent);
    }

    /**
     * Método LimpiarControles() => Realiza la operación de "reset" (estado inicial) de los controles según tipo: 1.Combo => Deselecciona valor; 2.Radio => Deselecciona valor; 3.Text => Borra campo
     * @date 2025-04-14
     * @author IGAC - DIP
     * @dateUpdated 2025-04-28
     * @changes Limpiar campaña al cerrar widget, para no dejar listado de campañas en la sesión anterior
     * @dateUpdated 2025-05-02
     * @changes Inicializar valor radio en Seleccionar Area por defecto
     * @dateUpdated 2025-05-05
     * @changes Inicializar coordenadas Esquina Sup Izq e Inf Der en vacío
     * @dateUpdated 2025-05-14
     * @changes Inicializar coordenadas Esquina Sup Izq e Inf Der en vacío
     * @returns Estado inicial controles filtros
     */
    const LimpiarControles = function(){
      //Tipo Combo (Select)
      setCoberState(undefined);
      setProyState(undefined);
      setCampaState(undefined);
      campaLst.length = 0;
      //Tipo Radio
      setValueNav("selArea");
      //Tipo Texto
      setValorLatState("");
      setLatPtoState("");
      setValorLatSuIzState("");
      setLatSuIzState("");
      setValorLatInDeState("");
      setLatInDeState("");
      setValorLonState("");
      setLonPtoState("");
      setValorLonSuIzState("");
      setLonSuIzState("");
      setValorLonInDeState("");
      setLonInDeState("");
    }

    /**
     * goToInitialExtent() => Método para obtener el extent inicial del país Colombia
     * @author IGAC - DIP
     * @date 2025-05-14
     * @param jimuMapView 
     * @param initialExtent 
     * @remarks DRA asociado al Widget Consulta Avanzada
     */
    const goToInitialExtent = (jimuMapView, initialExtent: any) => {
      if (jimuMapView && initialExtent) {
        jimuMapView.view.goTo(initialExtent, { duration: 1000 })
      }
    }
    /**
     * borradoMarkers => método para borrar los markers del mapa.
     * @date 2025-05-16
     * @author IGAC - DIP
     * @param jimuMapView
     */
    const borradoMarkers = function (jimuMapView)
    {
      if (jimuMapView){
        jimuMapView.view.map.removeAll();
      }
    }
    

    /**
     * Hook inicial para cargue del objeto jsonSERV, el cual contiene la data del servidor remoto (a través de acceso a Web Service de ArcGIS Map)
     * @date 2024-05-29
     * @author IGAC - DIP
     * @dateUpdated 2025-04-29
     * @changes Actualización estado sobre objeto jsonSERV
     * @changes Validación de cargue inicial, cuando el objeto jsonSERV sea vacío
     * @remarks Método obtenido del proyecto REFA
     */
    
    useEffect(() =>
    {
      if (jsonSERV.length == 0)
      {
        getJSONData();      
      }
      
    }, [jsonSERV]);

    
    /**
     * Hook para realizar carga del listado de proyectos, asociado al state del objeto proyLst
     * @date 2025-04-22
     * @author IGAC - DIP
     */
    useEffect(() =>
    {
      if (proyLst.length == 0)
      {
        getJSONProyectos();
      }
      return;
    }, [proyLst]);

    /**
     * Hook para realizar carga del listado de cobertura, asociado al state del objeto coberLst
     * @date 2025-04-22
     * @author IGAC - DIP
     */
    useEffect(() => {
      if (coberLst.length == 0){
        getJSONCober();
      }
      return;
    }, [coberLst])
    
    /**
     * 
     */


    /**
     * Hook para realizar carga del método componentDidUpdate()
     * @date 2025-05-13
     * @author IGAC - DIP
     */
    /* useEffect(() => {
      componentDidUpdate();
    },[props.state]) */
    componentDidUpdate();
    
    /**
     * Hook para realizar carga del método getJSONDeptoLst()
     * @date 2025-05-22
     * @author IGAC - DIP
     * @remarks estado de cargue de la lista de departamentos, al realizar la apertura del widget Búsqueda Firmas
     * @remarks se desactiva llamado del hook
     */

    useEffect(() => {      
      getJSONDeptoLst();
    }, [])

    /**
     * Hook para realizar carga del método getJSONMpioLst
     * @date 2025-05-22
     * @author IGAC - DIP
     * @remarks estado de cargue de la lista de municipios, al realizar la apertura del widget Búsqueda Firmas 
     * @remarks Se desactiva por rendimiento del cargue de información.
     */
    /* useEffect(() => {  
      getJSONMpioLst(25)
    }, [dataJSON]) */

    //Verificación de asignación estados    
    // console.log("Data asociada =>",jsonSERV);
        
    // console.log("Lista proyectos asignados al state =>",proyLst);
    // console.log("Listado coberturas asignados al state =>",coberLst);
    // console.log("Lista campañas asignados al state =>", campaLst);
    
    return (        
          <form onSubmit={consultaCatal}>
            <div className="mb-1">
              <Label size="default">Cobertura</Label>
            </div>
            <div className="mb-1">
            <Select
               placeholder="Seleccione cobertura..."
               onChange={handleSelCoberChange}
               value={selCoberVal}
            >
              {
                coberLst.map((option) => 
                  <option value={option.covertype}>{option.covertype}</option>
                )
              }
            </Select>
            </div>
            <div role='radiogroup' className='alignRad'>
              <Label className='d-flex alignLab' >
                <Radio 
                  checked={radValueNav === 'selArea'}      
                  value='selArea'
                  name="rbtn-coordGeo"       
                  onChange={handleChkChange}
                  >                
                </Radio>
                &nbsp;Seleccionar Area
              </Label>
              <Label className='d-flex alignLab2'>
                <Radio
                  checked={radValueNav === 'navMap'} 
                  name="rbtn-coordGeo" 
                  value='navMap'                  
                  onChange={handleChkChange}
                  >                  
                </Radio>
                &nbsp;Navegar
              </Label>
            </div>
            <div className="mb-1">
              <Label size="default"> Coordenadas geográficas (en grados decimales)  </Label>
            </div>
            <div className="mb-1">
                <Label size="default">Esquina superior izquierda</Label><br></br>
                <TextInput                  
                  placeholder="Latitud"                  
                  className="mb-4 latit_txt"
                  value={txtValorLat == '' ? latSuIz : latPto}
                  onChange={handleTxtChangevalor}
                  readOnly
                  maxLength={7}
                > 
                </TextInput><Label>&nbsp;</Label>
                <TextInput                  
                  placeholder="Longitud"
                  className="mb-4 latit_txt"
                  value={txtValorLon == '' ? lonSuIz: lonPto}                  
                  onChange={handleTxtChangevalorLon}
                  readOnly
                  maxLength={7}
                  >
                </TextInput>                
              </div>
              <div className="alignCoordInfDer">
                <Label size="default">Esquina inferior derecha</Label><br></br>
                <TextInput                  
                  placeholder="Latitud"                  
                  className="mb-4 latit_txt"
                  value={txtValorLat == '' ? latInDe : latPto}
                  onChange={handleTxtChangevalor}
                  readOnly
                  maxLength={7}
                > 
                </TextInput>
                <Label>&nbsp;</Label>
                <TextInput                  
                  placeholder="Longitud"
                  className="mb-4 latit_txt"
                  value={txtValorLon == '' ? lonInDe : lonPto}
                  onChange={handleTxtChangevalorLon}
                  readOnly
                  maxLength={7}
                  >
                </TextInput>
              </div>
              <div className="mb-1">
                <Label size="default">Proyecto</Label>
                <Select
                    placeholder="Especifique proyecto..."
                    onChange={handleSelProyChange}
                    value={selProyVal}
                  >
                  {
                    proyLst.length > 0 && proyLst.map(
                      (option) => (
                        <option value={option.projectname}>{option.projectname}</option>
                        )
                      )
                    }
                </Select>
              </div>
              <div className="mb-1">
                <Label size="default"> Campaña </Label>
                <Select                
                  placeholder="Especifique campaña..."
                  onChange={handleSelCampaChange}
                  value={selCampaVal}
                  >
                  {
                     campaLst.length > 0 && campaLst.map(
                      (option)=>(
                        <option value={option.campananame}>{option.campananame}</option>
                    ))
                  }
                </Select>
              </div>
              <div className="btns">
                <Button
                  htmlType="submit"              
                  size="default"
                  type="default"              
                >
                  Buscar en catálogo
                </Button>
                <Button
                   size="default"
                   type="default"
                   onClick={limpiarControlesFilter} 
                >Limpiar</Button>
              </div>
            </form>        
    );
}
export default FiltersSrcSIEC;
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
import { codDeptoDivip, outFieldsService } from '../../types/dataDG';

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
 * @param isLoad
 * @param setIsLoadState
 * @param setWidgetModules
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
 * @dateUpdated 2025-05-29
 * @changes Cargue parámetro isLoad
 * @changes Cargue parámetro setIsLoadState
 * @changes Cargue parámetro setWidgetModules
 * @remarks Fuente consulta https://mui.com/material-ui/react-radio-button
 * @returns (HTML)
 */
const FiltersSrcSIEC = function({jsonSERV, setJsonSERV, selCoberVal, setCoberState, coberLst, setCoberLst, radValueNav, setValueNav, txtValorLat, setValorLatState, txtValorLatSuIz, setValorLatSuIzState, txtValorLatInDe, setValorLatInDeState, txtValorLon, setValorLonState, txtValorLonSuIz, setValorLonSuIzState, txtValorLonInDe, setValorLonInDeState, lonPto, setLonPtoState, latPto, setLatPtoState, lonSuIz, setLonSuIzState, latSuIz, setLatSuIzState, lonInDe, setLonInDeState, latInDe, setLatInDeState,selProyVal, setProyState, proyLst, setProyLst, selCampaVal, setCampaState, campaLst, setCampaLst, ResponseBusquedaFirma, setResponseBusquedaFirma, view, setView, jimuMapView, setAlertDial, mensModal, setMensModal, setControlForms, controlForms, props, sketchWeb, setRows, initialExtent, jsonDpto, setJsonDptoState, jsonMpio, setJsonMpioState, isLoad, setIsLoadState, setWidgetModules}){
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
        //Establecer atributo cargando en falso
        setIsLoadState(false);

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
          //Desactivar estado cargando
          setIsLoadState(false);

          console.log("Contenido json desde petición =>", data);
          console.log("Contenido longitud =>",data.features.length);
          //Seteo de los datos asociados desde el consumo del Web service
          setJsonSERV(data.features);
        })
      }
      catch (error)
      {
        console.log("Error cargando data del server =>", error);
        throw error;
      }
    }

  
    function getJSONProyectos()
      {
        var jsonSIEC: any           = "";
        var proyectos: Array<string>= [];          
        console.log("Ingresando a proyectos data...=>",jsonSERV);
        
        //Obtener listado de proyectos
        for (var cont = 0; cont < jsonSERV.length; cont++)
        {
          //console.log("Contenido data.features"+" "+cont+" ",jsonSERV[cont].attributes);
            /*proyectos = data.features[cont].projectname;
            console.log("Proyecto "+cont+" =>",proyectos);*/
            //Adicionar item [Todos]
            if (cont === 0)
            {
              jsonSIEC = {
                "objectid": "*",
                "codigofirma": "*",
                "projectname": "[Todos]"
              };
              proyectos.push(jsonSIEC);
            }

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
        /* cont = 0;
        while (cont < proyectos.length)
        {
            jsonSIEC = {
              "objectid": "*",
              "codigofirma": "*",
              "projectname": "[Todos]"
            };
            proyectos.unshift(jsonSIEC);
            break;
        }   */      
        proyectos = procesaDuplic (proyectos, 'prj');

        //console.log("Lista proyectos incluyendo todos =>",proyArr);

        //Adicionar item         
        console.log("Lista proyectos FINAL=>",proyectos);
        
        //Seteo sobre el state asociado al listado de proyectos
        setProyLst(proyectos);
        
      }

   
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
        
        
        const sonArreglosIguales = (arr1, arr2) => {
          console.log({arr1, arr2})
          if (arr1.length != arr2.length) return true;
          
          // Comparar cada elemento en orden
          for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return true;
          }
          
          return false;
        }
        
        // if (sonArreglosIguales(coberturaArr, coberLst)) {
          setCoberLst(coberturaArr);          
        // }
    }

    

   
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
          //Desactivar modo cargando
          setIsLoadState(false);
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
        //Incluir la opción Todas
        //{"objectid": "*","codigofirma": null, "projectname": null, "campananame": "[Todas]"}
        if (cont === 0)
        {
          jsonSIEC = {
            "objectid": "*",
            "codigofirma": "*",
            "projectname": null,
            "campananame": "[Todas]"
          };
          campaArr.push(jsonSIEC);
        }
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
      
      console.log("Lista campañas =>",campaArr);
      
      //Set al state de campañas
      setCampaLst(campaArr);
    }
   
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
   
  const handleTxtChangevalor = function (event) {
        //console.log("Estado actual =>",txtValorState);
        setValorLatState(event.target.value);
        //Borrar polígono de selección - En curso
        //jimuMapView.view.ui.delete(sketchWeb);
      }
 
      const handleTxtChangevalorLon = function (event) {
      //console.log("Estado actual =>",txtValorState);
      setValorLonState (event.target.value);
    }

    const handleChkChange = function (event) {       
      if (event.target.value != ''){
        setValueNav(event.target.value);
      }
      //console.log("Valor del state =>",radValueNav);
    }

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
          /*console.log("Latitud pto =>", txtValorLat);
          console.log("Longitud pto =>", txtValorLon);
           console.log("Pto Longitud (X) =>", lonRect);
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
          /* //Coord Lat - Sup Izq
          console.log("Latitud Esq Sup Izq =>",txtValorLatSuIz);
          //Coord Lon - Sup Izq
          console.log("Longitud Esq Sup Izq  =>",txtValorLonSuIz);
          //Coord Lat - Inf Der
          console.log("Latitud Esq Inf Der =>",txtValorLatInDe);
          //Coord Lon - Inf Der
          console.log("Longitud Esq Inf Der  =>",txtValorLonInDe); */
          
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
        //const urlServicioSIEC = await getWhere('objectid,codigofirma,projectname,campananame,covertype,divipoladepto,divipolamunicipio,sealevelaltitude,instrumentname,photosignature,spectralintegrity', urls.firmasEsp, true, where, '', '', geomCoords, tGeometry, '4326', 'esriSpatialRelIntersects', '3857');//
        const urlServicioSIEC = await getWhere(outFieldsService.fieldsOut, urls.firmasEsp, true, where, '', '', geomCoords, tGeometry, '4326', 'esriSpatialRelIntersects', '3857');
        
        console.log("URL consumo =>", urlServicioSIEC);
        
        //Limpieza del data Grid antes de obtener la información del servicio
        setRows([]);

        //Estado cargando
        console.log("Activando cargando al Buscar en catálogo...");
        setIsLoadState(true);
        //Consumo del servicio
        getSelectedDataFilter(urlServicioSIEC);
      }

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
          //Desactivar cargando
          setIsLoadState(false);
          //Procesar generación filas data grid
          generateRowsDG(dataJSON.features);

        });
      }
      catch (error){
        console.log("Error generado =>",error);
      }
    }
    
    const generateRowsDG = async function (dataJSON){
        var jsonArr: Array<string> = [];
        var jsonStr, urlDivipolaMpios: any = "";
        var codDptoDivipola, codMpioDivipola, critSeleccDpto: string = "";
        
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
                critSeleccDpto = "mpcodigo='"+codDptoDivipola+codMpioDivipola+"'";
              }
              //Los demás departamentos de Colombia
              else
              {
                critSeleccDpto = "decodigo='"+codDptoDivipola+"'";
              } 
              urlDivipolaMpios = await getWhere(outFieldsService.fieldOutDivipola,urls.Municipios, false, critSeleccDpto, '', '', '', '', '', '', '');
              console.log("URL consumo divipola mpios =>",urlDivipolaMpios);
              
              //Activar modo cargando
              console.log("Activando cargando Divipola...");
              setIsLoadState(true);
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
                  //Desactivar modo cargando
                  setIsLoadState(false);

                  console.log("Contenido mpios json desde petición =>", data.features);
                  console.log("Contenido longitud =>",data.features.length);
                  
                  setJsonMpioState(data.features);
                  
                  console.log("Array Mpios obtenido del depto"+" ",codDptoDivipola+"=>",data.features);
                  console.log("Revisión Mpio =>",codDptoDivipola);
                  //codDptoDivipola = dataJSON[cont].attributes.divipoladepto;
                  //Recorrido para búsqueda de municipio desde servicio municipios
                  for (var contMpio = 0; contMpio < data.features.length; contMpio++)
                  {
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

    const handleSelProyChange = function(evt){
      var idProy = evt.target.value;
      var proyTxt = evt.nativeEvent.target.textContent;
      setProyState (idProy);
      
      //Carga de campaña asociado el proyecto
      getCampaByProj(idProy, proyTxt);
    }

    const handleSelCampaChange = function(evt){
      setCampaState(evt.target.value);
    }

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

    
    const goToInitialExtent = (jimuMapView, initialExtent: any) => {
      if (jimuMapView && initialExtent) {
        jimuMapView.view.goTo(initialExtent, { duration: 1000 })
      }
    }
    
    const borradoMarkers = function (jimuMapView)
    {
      if (jimuMapView){
        jimuMapView.view.map.removeAll();
      }
    }
    

    useEffect(() =>
    {
      if (jsonSERV.length == 0)
      {
        setIsLoadState(true);
        getJSONData();      
      }
      
    }, [jsonSERV]);

    
    useEffect(() =>
    {
      if (proyLst.length == 0 && jsonSERV.length > 0)
      { 
        getJSONProyectos();
      }
    }, [jsonSERV]);

    useEffect(() => {
      if (coberLst.length == 0){
        getJSONCober();
      }
      return;
    }, [coberLst])
    
    useEffect(() => {
      console.log(4444)

      componentDidUpdate();
      //Importación componente ourLoading
      import('../../../../commonWidgets/widgetsModule').then(modulo => { setWidgetModules(modulo) })

    },[props.state])
    
    useEffect(() => {
      console.log(5555)
      componentDidUpdate();
    },[radValueNav])

    useEffect(() => {
      console.log(77777)
      console.log("Activando cargando en hook cargue Lista Deptos");
      setIsLoadState(true);
      getJSONDeptoLst();
    }, [])

    
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
import React, { useEffect, useState } from 'react'
import { Button, Loading } from 'jimu-ui'
import { appActions } from 'jimu-core';
import './style.css'
import { DATA_Fuente_Indicadores } from './dataFormularioIndicadores';

const widgetID_Indicadores = 'widget_48'; // se genera al ingresar al widget objetivo y generarlo en el effect de inicio con props.id
const constantesTabIndicadores = {
  "decodigo":"decodigo",
  "mpcodigo":"mpcodigo"
}
/* 
const legendItems = [
  { color: 'rgb(52, 152, 219, 0.8)', range: '1 - 2' },
  { color: 'rgb(22, 160, 133, 0.8)', range: '3 - 6' },
  { color: 'rgb(46, 204, 112, 0.8)', range: '7 - 14' },
  { color: 'rgb(242, 156, 18, 0.8)', range: '15 - 37' },
  { color: 'rgb(211, 84, 0, 0.8)', range: '38 - 1868' },
]; */

const initLastLayerDeployed = {graphics:[],graphicsLayers:[]}

const TabIndicadores: React.FC<any> = ({dispatch, departamentos, jimuMapView}) => {

  const [constantes, setConstantes] = useState<InterfaceConstantes>(undefined);
  const [widgetModules, setWidgetModules] = useState(null);
  const [servicios, setServicios] = useState(null);
  const [utilsModule, setUtilsModule] = useState(undefined);
  const [lastLayerDeployed, setLastLayerDeployed] = useState(initLastLayerDeployed);
  const [mensajeModal, setMensajeModal] = useState({
    deployed:false,
    type:typeMSM.info,
    tittle:'',
    body:'',
    subBody:''
  })
  const [isLoading, setIsLoading] = useState(false);
  const [clickHandler, setClickHandler] = useState(null); // Estado para almacenar el manejador del evento click y capturar las geometrias seleccionadas con un click
  const [poligonoSeleccionado, setPoligonoSeleccionado] = useState(undefined);
  // const [dataCoropletico, setDataCoropletico] = useState<InterfaceDataCoropletico[]>([])
  const [geometriaMunicipios, setGeometriaMunicipios] = useState(undefined);


  const [subsitemas, setSubsitemas] = useState(DATA_Fuente_Indicadores);
  const [selectSubSistema, setSelectSubSistema] = useState(undefined)

  const [apuestaEstrategica, setApuestaEstrategica] = useState(null);
  const [selectApuestaEstategica, setSelectApuestaEstategica] = useState(undefined);

  const [categoriaTematica, setCategoriaTematica] = useState(null);
  const [selectCategoriaTematica, setSelectCategoriaTematica] = useState(undefined);

  const [indicadores, setIndicadores] = useState(null);
  const [selectIndicadores, setSelectIndicadores] = useState(undefined);
  const [responseIndicadores, setResponseIndicadores] = useState(undefined);

  const [departmentSelect, setDepartmentSelect] = useState(undefined);
  
  const [municipios, setMunicipios] = useState([]);
  const [municipioSelect, setMunicipioSelect] = useState(undefined);

  const [rangosLeyenda, setRangosLeyenda] = useState([]);
  const [esriModules, setEsriModules] = useState(undefined);
  const [dataTempQueryNal, setDataTempQueryNal] = useState([]);

  const cancelClickEvent = () => {
    if (clickHandler) {
      clickHandler.remove();
      setClickHandler(null); // Limpiar el estado del manejador del evento
    }
  };

  const handleSubsistemaSelected = ({target}) => {
    setSelectApuestaEstategica(undefined);
    setSelectCategoriaTematica(undefined)
    setSelectIndicadores(undefined)
    if (utilsModule.logger()) console.log(subsitemas.find(e => e.value == target.value))
    setApuestaEstrategica(subsitemas.find(e => e.value == target.value));
    setSelectSubSistema(subsitemas.find(e => e.value == target.value));
    setCategoriaTematica(null)
    setIndicadores(null)
    setMunicipios([]);
    setRangosLeyenda([]);
  };
  const handleApuestaEstrategicaSelected = ({target}) => {
    if (utilsModule?.logger()) console.log(target.value)
    setSelectCategoriaTematica(undefined);
    setSelectIndicadores(undefined);
    setRangosLeyenda([]);
    if (utilsModule?.logger()) console.log("APUESTA_ESTRATEGICA")
    if (utilsModule?.logger()) console.log(apuestaEstrategica.APUESTA_ESTRATEGICA.find(e => e.value == target.value))
    setSelectApuestaEstategica(apuestaEstrategica.APUESTA_ESTRATEGICA.find(e => e.value == target.value))
    setCategoriaTematica(apuestaEstrategica.APUESTA_ESTRATEGICA.find(e => e.value == target.value))
    setIndicadores(null);
    setMunicipios([]);

  };
  const handleCategoriaTematicaSelected = ({target}) => {
    setSelectIndicadores(undefined)
    setRangosLeyenda([]);
    setIndicadores(categoriaTematica.CATEGORIA_TEMATICA.find(e => e.value == target.value));
    setSelectCategoriaTematica(categoriaTematica.CATEGORIA_TEMATICA.find(e => e.value == target.value));
    if (utilsModule.logger()) console.log({value:target.value, CATEGORIA_TEMATICA: categoriaTematica.CATEGORIA_TEMATICA.find(e => e.value == target.value)});
    setMunicipios([]);
    setIsLoading(false)
  };
  const handleIndicadorSelected_Continua = async ({indiSelected, target}) => {
    const {FeatureLayer, SimpleFillSymbol, Polygon, Graphic, GraphicsLayer} = esriModules;

    let url = servicios.urls.indicadoresNaci[indiSelected.urlNal];
    let responseIndicadorNacional;
    let layer;
    if(!url){
      setIsLoading(false);
      setMensajeModal({
        deployed: true,
        type: typeMSM.warning,
        tittle: 'Info',
        body: "El indicador seleccionado no presenta servicio",        
        subBody:''
      });
      setSelectIndicadores(undefined)
      return
    }
    url = `${url}/query`;
    const existeQuery = dataTempQueryNal.find(d => (d.id == indiSelected.label && d.url == url));
    if (existeQuery) {
      responseIndicadorNacional = existeQuery.responseIndicadorNacional;
      layer = existeQuery.layer;
    }else{
      responseIndicadorNacional = await utilsModule.realizarConsulta("*", url, false, `1=1`);    
      if(!responseIndicadorNacional.features){
        if (utilsModule.logger()) console.error("Sin data en el responseIndicadorNacional => ", {responseIndicadorNacional});
        setMensajeModal({
          deployed: true,
          type: typeMSM.warning,
          tittle: 'Info',
          body: "Sin información nacional para el indicador seleccionado",        
          subBody:''
        });
        setIsLoading(false);
        return
      }
      // obtiene las geometrias para cada feature de las geometrias municipios previamente cargadas
      responseIndicadorNacional = responseIndicadorNacional.features.map(RIN=>{
        const geome = geometriaMunicipios.features.find(GM => GM.attributes.mpcodigo == RIN.attributes.cod_municipio)
        return {attributes: {...RIN.attributes, ...geome.attributes}, geometry:geome.geometry}
      })
      layer = new FeatureLayer({ url:`${servicios.urls.indicadoresNaci[indiSelected.urlNal]}` });
      const guardarConsultaIndicadorNacional = {url, responseIndicadorNacional, layer, id:indiSelected.label};
      setDataTempQueryNal([...dataTempQueryNal, guardarConsultaIndicadorNacional]);
    }

    // Datos para configurar los rangos del coropletico
    const fieldValueToSetRangeCoropletico=indiSelected.fieldValue;
    // const {minValue, maxValue, interval} = utilsModule.rangosCoropleticos(responseIndicadorNacional, fieldValueToSetRangeCoropletico);

    // dibujar Municipios en coropletico   
    utilsModule.dibujarPoligono({features:responseIndicadorNacional, minValue:0, maxValue:0, jimuMapView, setPoligonoSeleccionado,
      setClickHandler, fieldValueToSetRangeCoropletico, setLastLayerDeployed, lastLayerDeployed,
       interval:0, setRangosLeyenda, Polygon, Graphic, GraphicsLayer, SimpleFillSymbol
    });     
    // const layer = new FeatureLayer({ url:`https://pruebassig.igac.gov.co/server/rest/services/Indicadores_nacionales_municipales/MapServer/0` });
    if (utilsModule.logger()) console.log({"INDICADOR":target.value,indiSelected, url, responseIndicadorNacional,fieldValueToSetRangeCoropletico
      ,layer, dataTempQueryNal})

    await layer.load();
    // layer.when();
    setTimeout(() => {
      jimuMapView.view.goTo(layer.fullExtent);      
      setIsLoading(false)
    }, 500);

  }
  const handleIndicadorSelected = ({target}) => {
    setIsLoading(true);
    clearGraphigs(); // Elimina las geometrias dibujadas previamente
    setDepartmentSelect(undefined)
    setRangosLeyenda([]);
    const indiSelected = indicadores.INDICADOR.find(e => e.value == target.value);
    setSelectIndicadores(indiSelected)
    setMunicipios([]);
    setTimeout(() => {
      handleIndicadorSelected_Continua({indiSelected, target})
    }, 1000);

    
  };
  /**
   * En este metodo se selecciona el departamento al que se va realizar la consulta de indicadores
   * y genera la consulta
   * @param param0 
   */
  const handleDepartamentoSelected = async ({target}) => {
    setIsLoading(true)
    clearGraphigs(); // Elimina las geometrias dibujadas previamente
    const targetDepartment = target.value;
    const itemSelected = departamentos.find(departamento => departamento.value == targetDepartment);
    setDepartmentSelect(itemSelected) // se utiliza para sacar el label en la grafica, widget indicadores
    const response = await utilsModule.realizarConsulta("*", `${servicios.urls.indicadores[selectIndicadores.url]}/query`, false, `cod_departamento='${itemSelected.decodigo}'`);
    setResponseIndicadores(response);
    if (utilsModule.logger()) console.log({value: target.value,itemSelected, response, selectIndicadores});    
    if(!response || response?.features.length<1){
      if (utilsModule.logger()) console.error("query don't get features to render");
      setMensajeModal({
        deployed: true,
        type: typeMSM.warning,
        tittle: 'Info',
        body: "Sin información aun para el departamento seleccionado",        
        subBody:''
      });
      setRangosLeyenda([])
      setIsLoading(false)
    }else{
      /* Selecciona los responseIndicadores que coinciden con el departamento, para luego filtrar por municipio */
      const _dataCoropletico = response.features;    
      if (utilsModule.logger()) console.log({itemSelected, lastLayerDeployed, _dataCoropletico})
      /* if (lastLayerDeployed.graphicsLayers) {
        jimuMapView.view.map.remove(lastLayerDeployed)
        setLastLayerDeployed(undefined)
      } */
      // en esta consulta trae solo los municipios del departamento objetivo
      // se direge al metodo ubicado en utils/module.ts
      const {FeatureLayer,Graphic,GraphicsLayer,SimpleFillSymbol,SimpleMarkerSymbol,SimpleLineSymbol} = esriModules;
      await utilsModule.pintarFeatureLayer({
        _dataCoropletico,
        definitionExpression:`${constantesTabIndicadores.decodigo}='${targetDepartment}'`,
        doZoom:true,
        fieldValueToSetRangeCoropletico:selectIndicadores.fieldValue,//para calcular los colores del coropletico
        geometryType:"polygon",
        getAttributes:false,
        identificadorMixData:constantesTabIndicadores.mpcodigo,
        jimuMapView,
        lastLayerDeployed,
        pintarFeature:true,
        returnGeometry:true,
        url:servicios.urls.Municipios,
        FeatureLayer,Graphic,GraphicsLayer,SimpleFillSymbol, SimpleMarkerSymbol,SimpleLineSymbol,
        setClickHandler,
        setLastLayerDeployed,
        setPoligonoSeleccionado,
        setIsLoading,
        setMunicipios,
        setRangosLeyenda,
      });
    }
  }

  const handleMunicipioSelected = ({target}) => {
    const itemSelected = municipios.find(municipio => municipio.value == target.value);
    setMunicipioSelect(itemSelected)
    if (utilsModule.logger()) console.log({municipios:itemSelected});
    utilsModule.goToOneExtentAndZoom({jimuMapView, extent:itemSelected.value.geometry.extent, duration:1000})
    const graphicMunicipioSlected = lastLayerDeployed.graphics.find(e=>e.attributes.mpcodigo == itemSelected.mpcodigo);
    // setPoligonoSeleccionado(graphicMunicipioSlected);
    utilsModule.dibujarPoligonoToResaltar({rings:graphicMunicipioSlected.geometry.rings,
      wkid:graphicMunicipioSlected.geometry.spatialReference.wkid,
      attributes:graphicMunicipioSlected.attributes, jimuMapView, times:3, borrar:true})
    // jimuMapView.view.goTo(itemSelected.value.geometry.extent);
    const temp_poligonoSeleccionado = {
      geometry:itemSelected.value.geometry, symbol:{}, attributes:itemSelected, popupTemplate:{}
    }
    const dataToRender = JSON.stringify({poligonoSeleccionado:temp_poligonoSeleccionado, departmentSelect, selectIndicadores})
    dispatch(appActions.widgetStatePropChange(widgetID_Indicadores, "poligonoSeleccionado", dataToRender))
    
  }

  // Elimina las geometrias dibujadas previamente
  const clearGraphigs = () => {
    if (utilsModule.logger()) console.log("clearGraphigs")
    // if(lastLayerDeployed.length > 0) utilsModule.removeLayer(jimuMapView, lastLayerDeployed);    
    if(lastLayerDeployed.graphicsLayers.length > 0) utilsModule.removeLayer(jimuMapView, lastLayerDeployed.graphicsLayers);
    setTimeout(() => {
      // setLastLayerDeployed(initLastLayerDeployed);
    }, 2000);
    // jimuMapView.view.
  }
 
  const consultar = () =>{
    setIsLoading(true)
    if (utilsModule?.logger()) console.log(
      {
        departamentos,
        subsitemas,
        apuestaEstrategica,
        categoriaTematica,
        indicadores,
        selectSubSistema,
        selectApuestaEstategica,
        selectCategoriaTematica,
        selectIndicadores,
        responseIndicadores,
        departmentSelect,
        municipios,
        municipioSelect,
      }
    )
    setIsLoading(false)
  }

  
  const formularioIndicadores = () => {    
    return (
      <>
        { widgetModules?.INPUTSELECT(subsitemas, handleSubsistemaSelected, selectSubSistema?.value, "Sub Sistema") }

        { (apuestaEstrategica && widgetModules) &&
            widgetModules.INPUTSELECT(apuestaEstrategica, handleApuestaEstrategicaSelected, selectApuestaEstategica?.value, "Apuesta Estrategica","APUESTA_ESTRATEGICA")
        }
        { (categoriaTematica && widgetModules)&&
            widgetModules.INPUTSELECT(categoriaTematica, handleCategoriaTematicaSelected, selectCategoriaTematica?.value, "Categoría Temática","CATEGORIA_TEMATICA")
        }
        { (indicadores && widgetModules)&&
            widgetModules.INPUTSELECT(indicadores, handleIndicadorSelected, selectIndicadores?.value, "Indicador","INDICADOR")
        }
        { (selectIndicadores && widgetModules)&&
            widgetModules.INPUTSELECT(departamentos, handleDepartamentoSelected, departmentSelect?.value, "Departamento","")
        }
        { municipios.length>0 &&
            widgetModules.INPUTSELECT(municipios, handleMunicipioSelected, municipioSelect?.value, "Municipio","")
        }
         

        <Button
          size="sm"
          type="default"
          onClick={()=>{
            setSelectSubSistema(undefined);
            setApuestaEstrategica(undefined)
            setCategoriaTematica(undefined)
            setDepartmentSelect(undefined);
            setSelectIndicadores(undefined);
            setIndicadores(undefined);
            setMunicipios([]);
            clearGraphigs();
            setRangosLeyenda([]);
          }}
          className="mb-4"
        >
          Limpiar
        </Button>
        
       {/*  <Button
          size="sm"
          type="default"
          onClick={consultar}
          className="mb-4"
        >
          Consultar
        </Button> */}

        {
         ( rangosLeyenda.length>0 && constantes) &&
            <div className="legend">
              <h3>{/* { indicadores.label  } por  */}{selectIndicadores.label} {selectIndicadores.fieldValue == "total_area_ha"?"(ha)":""}</h3>
              <ul>
                {constantes.coloresMapaCoropletico.map((item, index) => (
                  <li key={index}>
                    <span style={{ backgroundColor: item.colorRgb }}></span> {`${rangosLeyenda[index][0]} - ${rangosLeyenda[index][1]}`}
                  </li>
                ))}
              </ul>              
              </div>
        }
      </>
    )
  }
  const getGeometriasMunicipios = async (url: string) => {
    setIsLoading(true)
    const municipiosResponse = await utilsModule.queryAttributesLayer({url:url+"/query", definitionExpression:"1=1", returnGeometry:true,outFields:"*"});   
    const resumenMunicipios = {
      features:municipiosResponse.features,
      fields:municipiosResponse.fields,
      geometryType:municipiosResponse.geometryType,
      spatialReference:municipiosResponse.spatialReference
    }
    // const departAjustadosToRender = utilsModule.ajustarDataToRender(dataResponse,"decodigo","denombre");
    if (utilsModule.logger()) console.log({municipiosResponse, resumenMunicipios})
    setGeometriaMunicipios(resumenMunicipios);
    setIsLoading(false)
  }

  const cargarModulosEsri = async() => {
    const modulosEsri = await utilsModule.loadEsriModules();
    setEsriModules(modulosEsri)
  }

  useEffect(() => {
    if (utilsModule) {
      setTimeout(() => {
        getGeometriasMunicipios(servicios.urls.Municipios) 
      }, 2000);
    }
  
    return () => {}
  }, [jimuMapView])

  useEffect(() => {
    if (utilsModule?.logger()) console.log({geometriaMunicipios})  
    return () => {}
  }, [geometriaMunicipios])
  
  /**
   * Ajusta campos de municipios
   */
  useEffect(() => {

    if (utilsModule?.logger()) console.log(municipios)
    
  }, [municipios])
  
  /**
   * con este effect limpia el ultimo grafico estadistico selecionado 
   */
  useEffect(() => {
    if (utilsModule?.logger()) console.log({where:"Effect selectSubSistema", widgetID_Indicadores})
    const dataToWidgetIndicadores = JSON.stringify({clear:true});
    dispatch(appActions.widgetStatePropChange(widgetID_Indicadores, "poligonoSeleccionado", dataToWidgetIndicadores))
    return () => {}
  }, [selectSubSistema, categoriaTematica, selectCategoriaTematica, selectIndicadores, departmentSelect])

  /**
   * al dar un click en uno de los municipios, captura el poligono seleccionado y lo envia al widget indicadores
   * con la data correspondiente para renderizar la grafica de barras estadistica
   */
  useEffect(() => {
    if(!poligonoSeleccionado) return
    poligonoSeleccionado.departmentSelect=departmentSelect;
    poligonoSeleccionado.selectIndicadores=selectIndicadores;
    const dataToRender = JSON.stringify({poligonoSeleccionado, departmentSelect, selectIndicadores})
    dispatch(appActions.widgetStatePropChange(widgetID_Indicadores, "poligonoSeleccionado", dataToRender))
    let selectedMunic;
    if (municipios.length > 0) {
      selectedMunic = municipios.find(e=>e.mpcodigo == poligonoSeleccionado.attributes.mpcodigo);      
    } else {
      selectedMunic = poligonoSeleccionado.attributes;
    }
    setMunicipioSelect(selectedMunic);
    if (utilsModule.logger()) console.log({poligonoSeleccionado, selectedMunic, dataToRender})
    return () => {}
  }, [poligonoSeleccionado])
    
useEffect(() => {

  if(!utilsModule)return
  cargarModulosEsri();
  

  return () => {}
}, [utilsModule])


  /**
   * Carga los modulos necesarios a emplear en el widget
   */
  useEffect(() => {
    
    import('../widgetsModule').then(modulo => setWidgetModules(modulo));
    import('../../utils/module').then(modulo => setUtilsModule(modulo));
    import('../../api/servicios').then(modulo => setServicios(modulo));
    import('../../utils/constantes').then(modulo => setConstantes(modulo));   
    
    
  }, []);

  return (
    <div className="">
        {
          formularioIndicadores()
        }
        {
          widgetModules?.MODAL(mensajeModal, setMensajeModal)
        }
        {
          isLoading && <div style={{backgroundColor:'gray'}}>
            <Loading />
            </div>
        } 
    </div>
  )
}

export default TabIndicadores

enum typeMSM {
  success = "success",
  info    = "info",
  error   = "error",
  warning = "warning",
}

export interface InterfaceConstantes {
  coloresMapaCoropletico: ColoresMapaCoropletico[];
  diccionario:            Diccionario;
}

export interface ColoresMapaCoropletico {
  colorRgb: string;
  value:    number[];
}

export interface Diccionario {
  indicadores: Indicadores;
}

export interface Indicadores {
  decodigo:         string;
  cantidad_predios: string;
  mpcodigo:         string;
}

export interface InterfaceDataCoropletico {
  attributes: Attributes;
}

export interface Attributes {
  cod_departamento: string;
  cod_municipio:    string;
  mpnombre:         string;
  anio:             number;
  tipo_predio:      TipoPredio;
  cantidad_predios: number;
  total_area_ha:    number;
  ESRI_OID:         number;
}

export enum TipoPredio {
  Baldio = "Baldio",
  BaldioReservado = "Baldio Reservado",
  FiscalPatrimonial = "Fiscal Patrimonial",
}
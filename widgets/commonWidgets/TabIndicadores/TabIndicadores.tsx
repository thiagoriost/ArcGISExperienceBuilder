import React, { useEffect, useState } from 'react'
import { Button, Loading } from 'jimu-ui'
import { appActions } from 'jimu-core';
import './style.css'
import { DATA_Fuente_Indicadores } from './dataFormularioIndicadores';

const widgetID_Indicadores = 'widget_48'; // se genera al ingresar al widget objetivo y generarlo en el effect de inicio con props.id

const TabIndicadores: React.FC<any> = ({dispatch, departamentos, jimuMapView}) => {

  const [constantes, setConstantes] = useState<InterfaceConstantes>(undefined);
  const [widgetModules, setWidgetModules] = useState(null);
  const [servicios, setServicios] = useState(null);
  const [utilsModule, setUtilsModule] = useState(null);
  const [lastLayerDeployed, setLastLayerDeployed] = useState([]);
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
  const [dataCoropletico, setDataCoropletico] = useState<InterfaceDataCoropletico[]>([])


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
  };
  const handleApuestaEstrategicaSelected = ({target}) => {
    if (utilsModule?.logger()) console.log(target.value)
    setSelectCategoriaTematica(undefined);
    setSelectIndicadores(undefined)
    if (utilsModule?.logger()) console.log("APUESTA_ESTRATEGICA")
    if (utilsModule?.logger()) console.log(apuestaEstrategica.APUESTA_ESTRATEGICA.find(e => e.value == target.value))
    setSelectApuestaEstategica(apuestaEstrategica.APUESTA_ESTRATEGICA.find(e => e.value == target.value))
    setCategoriaTematica(apuestaEstrategica.APUESTA_ESTRATEGICA.find(e => e.value == target.value))
    setIndicadores(null)
  };
  const handleCategoriaTematicaSelected = ({target}) => {
    setSelectIndicadores(undefined)
    setIndicadores(categoriaTematica.CATEGORIA_TEMATICA.find(e => e.value == target.value));
    setSelectCategoriaTematica(categoriaTematica.CATEGORIA_TEMATICA.find(e => e.value == target.value));
    if (utilsModule.logger()) console.log({value:target.value, CATEGORIA_TEMATICA: categoriaTematica.CATEGORIA_TEMATICA.find(e => e.value == target.value)});
  };
  const handleIndicadorSelected = ({target}) => {
    setIsLoading(true)
    setDepartmentSelect(undefined)
    const indiSelected = indicadores.INDICADOR.find(e => e.value == target.value);
    if (utilsModule.logger()) console.log({"INDICADOR":target.value,indiSelected})
    setSelectIndicadores(indiSelected)
    setIsLoading(false)
  };
  /**
   * En este metodo se selecciona el departamento al que se va realizar la consulta de indicadores
   * y genera la consulta
   * @param param0 
   */
  const handleDepartamentoSelected = async ({target}) => {
    setIsLoading(true)
    // Elimina las geometrias dibujadas previamente
    if(lastLayerDeployed.length > 0) lastLayerDeployed.forEach(feature => jimuMapView.view.map.remove(feature))
    const targetDepartment = target.value;
    const itemSelected = departamentos.find(departamento => departamento.value == targetDepartment);
    setDepartmentSelect(itemSelected) // se utiliza para sacar el label en la grafica, widget indicadores
    const response = await utilsModule.realizarConsulta("*", `${servicios.urls.indicadores[selectIndicadores.url]}/query`, false, `cod_departamento='${itemSelected.decodigo}'`);
    if (utilsModule.logger()) console.log({value: target.value,itemSelected, response, selectIndicadores});

    if(!response || response?.features.length<1){
      if (utilsModule.logger()) console.error("query don't get features to render");
      setMensajeModal({
        deployed: true,
        type: typeMSM.warning,
        tittle: 'Info',
        body: "Sin información aun para el departamento seleccionado",        
        subBody:''
      })
      setIsLoading(false)
    }else{
      /* Selecciona los responseIndicadores que coinciden con el departamento, para luego filtrar por municipio */
      const _dataCoropletico = response.features;    
      if (utilsModule.logger()) console.log({itemSelected, dataCoropletico, lastLayerDeployed, _dataCoropletico})
      if (lastLayerDeployed) {
        jimuMapView.view.map.remove(lastLayerDeployed)
        setLastLayerDeployed(undefined)
      }
      // en esta consulta trae solo los municipios del departamento objetivo
      // se direge al metodo ubicado en utils/module.ts
      await utilsModule.pintarFeatureLayer({
        _dataCoropletico,
        definitionExpression:`${constantes.diccionario.indicadores.decodigo}='${targetDepartment}'`,
        doZoom:true,
        fieldValueToSetRangeCoropletico:selectIndicadores.fieldValue,//para calcular los colores del coropletico
        geometryType:"polygon",
        getAttributes:false,
        identificadorMixData:constantes.diccionario.indicadores.mpcodigo,
        jimuMapView,
        lastLayerDeployed,
        pintarFeature:true,
        returnGeometry:true,
        setClickHandler,
        setLastLayerDeployed,
        setPoligonoSeleccionado,
        setIsLoading,
        url:servicios.urls.Municipios,
      });
    }
  }
 
  const consultar = () =>{
    setIsLoading(true)
    if (utilsModule?.logger()) console.log(
      {
        subsitemas,
        apuestaEstrategica,
        categoriaTematica,
        indicadores,
        selectSubSistema,
        selectApuestaEstategica,
        selectCategoriaTematica,
        selectIndicadores,
        // municipioSelected,
        departmentSelect,
        // annioSelected,
        responseIndicadores
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
        
        {/* <Button
          size="sm"
          type="default"
          onClick={consultar}
          className="mb-4"
        >
          Consultar
        </Button> */}
      </>
    )
  }

  useEffect(() => {
    if (utilsModule?.logger()) console.log("Effect selectSubSistema")
    dispatch(appActions.widgetStatePropChange(widgetID_Indicadores, "poligonoSeleccionado", {clear:true}))
    return () => {}
  }, [selectSubSistema, categoriaTematica, selectCategoriaTematica, selectIndicadores, departmentSelect])
  

  useEffect(() => {
    if(!poligonoSeleccionado) return
    if (utilsModule.logger()) console.log({poligonoSeleccionado, dataCoropletico})
    poligonoSeleccionado.departmentSelect=departmentSelect
    poligonoSeleccionado.selectIndicadores=selectIndicadores
    const dataToRender = JSON.stringify({poligonoSeleccionado, departmentSelect, selectIndicadores})
    dispatch(appActions.widgetStatePropChange(widgetID_Indicadores, "poligonoSeleccionado", dataToRender))
    return () => {}
  }, [poligonoSeleccionado])

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
          isLoading && <Loading />
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
  diccionario: diccionario;
}

export interface diccionario {
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
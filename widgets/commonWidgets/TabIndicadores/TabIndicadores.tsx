import React, { useEffect, useState } from 'react'
import { Button } from 'jimu-ui'
import { appActions } from 'jimu-core'
import './style.css'
import { dataFuenteIndicadores } from './dataFormularioIndicadores'
import { loadModules } from "esri-loader";

const widgetIdIndicadores = 'widget_48' // se genera al ingresar al widget objetivo y generarlo en el effect de inicio con props.id
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const constantesTabIndicadores = {
  decodigo: 'decodigo',
  mpcodigo: 'mpcodigo'
}
/*
const legendItems = [
  { color: 'rgb(52, 152, 219, 0.8)', range: '1 - 2' },
  { color: 'rgb(22, 160, 133, 0.8)', range: '3 - 6' },
  { color: 'rgb(46, 204, 112, 0.8)', range: '7 - 14' },
  { color: 'rgb(242, 156, 18, 0.8)', range: '15 - 37' },
  { color: 'rgb(211, 84, 0, 0.8)', range: '38 - 1868' },
] */
const initSelectIndicadores = {
  urlDepartal: '',
  fieldValueDepartal: '',
  fieldValueNal: '',
  fieldlabelNal: [],
  leyendaNal: [],
  leyenda: [],
  urlNal: '',
  urlNalDataAlfanumerica: '',
  label: '',
  value: 0,
  descripcion: ''
}
type InitSelectIndicadores = {
  urlDepartal: string;
  fieldValueDepartal: string;
  fieldValueNal: string;
  fieldlabelNal: string[]; // Array de cadenas
  leyendaNal: string[]; // Array de cadenas
  leyenda: string[]; // Array de cadenas
  urlNal: string;
  urlNalDataAlfanumerica: string;
  label: string;
  value: number; // Número
  descripcion: string;
};
const initLastLayerDeployed = { graphics: [], graphicsLayers: [] }

const TabIndicadores: React.FC<any> = ({ dispatch, departamentos, jimuMapView }) => {
  const [constantes, setConstantes] = useState<InterfaceConstantes | null>(null)
  const [widgetModules, setWidgetModules] = useState<typeof import('../widgetsModule') | undefined>(undefined)
  const [servicios, setServicios] = useState<typeof import('../../api/servicios') | undefined>(undefined)
  const [utilsModule, setUtilsModule] = useState<typeof import('../../utils/module') | undefined>(undefined)
  const [lastLayerDeployed, setLastLayerDeployed] = useState(initLastLayerDeployed)
  const [mensajeModal, setMensajeModal] = useState({
    deployed: false,
    type: typeMSM.info,
    tittle: '',
    body: '',
    subBody: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [clickHandler, setClickHandler] = useState(null) // Estado para almacenar el manejador del evento click y capturar las geometrias seleccionadas con un click
  const [poligonoSeleccionado, setPoligonoSeleccionado] = useState(undefined)
  const [geometriaMunicipios, setGeometriaMunicipios] = useState<{ features: { attributes: { mpcodigo: string }; geometry: any }[] } | undefined>(undefined)
  const [geometriasDepartamentos, setGeometriasDepartamentos] = useState<{ features: { attributes: { mpcodigo: string }; geometry: any }[] } | undefined>(undefined)
  const [selectSubSistema, setSelectSubSistema] = useState<{ value: number; label: string; descripcion: string; APUESTA_ESTRATEGICA: { value: number; label: string; descripcion: string; CATEGORIA_TEMATICA: { value: number; label: string; descripcion: string; INDICADOR: ({ value: number; label: string } | { value: number; label: string })[]; }[]; }[]; } | undefined>(undefined)
  const [apuestaEstrategica, setApuestaEstrategica] = useState<{ value: number; label: string; descripcion: string; APUESTA_ESTRATEGICA: { value: number; label: string; descripcion: string; CATEGORIA_TEMATICA: { value: number; label: string; descripcion: string; INDICADOR: ({ value: number; label: string } | { value: number; label: string })[]; }[]; }[]; } | null>(null)
  const [selectApuestaEstategica, setSelectApuestaEstategica] = useState<{ value: number; label: string; descripcion: string; CATEGORIA_TEMATICA: { value: number; label: string; descripcion: string; INDICADOR: ({ value: number; label: string } | { value: number; label: string })[]; }[]; } | undefined>(undefined)
  const [categoriaTematica, setCategoriaTematica] = useState<{ value: number; label: string; descripcion: string; CATEGORIA_TEMATICA: { value: number; label: string; descripcion: string; INDICADOR: ({ value: number; label: string } | { value: number; label: string })[]; }[]; } | null>(null)
  const [selectCategoriaTematica, setSelectCategoriaTematica] = useState<{ value: number; label: string; descripcion: string; INDICADOR: ({ value: number; label: string } | { value: number; label: string })[]; } | undefined>(undefined)
  const [indicadores, setIndicadores] = useState<({ value: number; label: string } | { value: number; label: string })[] | null>(null)
  const [selectIndicadores, setSelectIndicadores] = useState<InitSelectIndicadores|undefined>(undefined)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [responseIndicadores, setResponseIndicadores] = useState(undefined)
  const [departmentSelect, setDepartmentSelect] = useState<{ value: string; label: string } | undefined>(undefined)
  const [municipios, setMunicipios] = useState<{ value: any; [key: string]: any }[]>([])
  const [municipioSelect, setMunicipioSelect] = useState<{ [key: string]: any; value: any } | undefined>(undefined)
  const [rangosLeyenda, setRangosLeyenda] = useState([])
  const [esriModules, setEsriModules] = useState(undefined)
  const [es_Indicador, setEsIndicador] = useState("");
  // const [dataTempQueryNal, setDataTempQueryNal] = useState([])
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
  const [respuestas, setRespuestas] = useState(null)
  
  const handleSubsistemaSelected = ({ target }) => {
    clearGraphigs() // Elimina las geometrias dibujadas previamente
    setSelectApuestaEstategica(undefined)
    setSelectCategoriaTematica(undefined)
    setSelectIndicadores(undefined)
    const findSubSistema = dataFuenteIndicadores.find(e => e.value === target.value)
    if (utilsModule?.logger()) console.log(findSubSistema)
    setApuestaEstrategica(findSubSistema || null)
    setSelectSubSistema(findSubSistema)
    setCategoriaTematica(null)
    setIndicadores(null)
    setMunicipios([])
    setRangosLeyenda([])
  }
  const handleApuestaEstrategicaSelected = ({ target }) => {
    clearGraphigs() // Elimina las geometrias dibujadas previamente
    setSelectCategoriaTematica(undefined)
    setSelectIndicadores(initSelectIndicadores)
    setRangosLeyenda([])
    const APUESTA_ESTRATEGICA = apuestaEstrategica?.APUESTA_ESTRATEGICA.find(e => e.value === target.value)
    if (utilsModule?.logger()) console.log('APUESTA_ESTRATEGICA', { APUESTA_ESTRATEGICA, value: target.value })
    setSelectApuestaEstategica(APUESTA_ESTRATEGICA)
    setCategoriaTematica(APUESTA_ESTRATEGICA || null)
    if (APUESTA_ESTRATEGICA?.CATEGORIA_TEMATICA.length === 1 && APUESTA_ESTRATEGICA.CATEGORIA_TEMATICA[0].label === '') {
      setIndicadores(APUESTA_ESTRATEGICA.CATEGORIA_TEMATICA[0].INDICADOR)
    } else {
      setIndicadores(null)
    }
    setMunicipios([])
  }
  const handleCategoriaTematicaSelected = ({ target }) => {
    setSelectIndicadores(initSelectIndicadores)
    setRangosLeyenda([])
    const CATEGORIA_TEMATICA = categoriaTematica?.CATEGORIA_TEMATICA.find(e => e.value === target.value)
    setIndicadores(CATEGORIA_TEMATICA?.INDICADOR ?? null)
    setSelectCategoriaTematica(CATEGORIA_TEMATICA)
    if (utilsModule?.logger()) console.log({ value: target.value, CATEGORIA_TEMATICA })
    setMunicipios([])
    setIsLoading(false)
  }

  // Maneja el indicadores seleccionado a nivel nacional
  const handleIndicadorSelected = async ({ target }) => {    
    setIsLoading(true)
    setDepartmentSelect(undefined)
    setRangosLeyenda([])
    let indiSelected, _es_Indicador, geometrias = geometriaMunicipios, __geometriasDepartamental, fieldValueToSetRangeCoropletico, urlIndicadorToGetData, label_indicador
    indiSelected = indicadores?.find(e => e.value === target.value)
    if (!geometriasDepartamentos) {//esto para traer la geometria de los departamentos solo una vez
      __geometriasDepartamental = await utilsModule?.realizarConsulta('*', servicios?.urls.Departamentos+'/query', true, '1=1')
      setGeometriasDepartamentos(__geometriasDepartamental);      
    }else{
      __geometriasDepartamental = geometriasDepartamentos
    }
    fieldValueToSetRangeCoropletico=indiSelected.fieldValueNal
    label_indicador = indiSelected.fieldlabelNal
     _es_Indicador = "Nacional"
    if (indiSelected.label.includes('1.7.')) {
        setEsIndicador('es=1.7.')
        _es_Indicador = 'es=1.7.'
        geometrias = __geometriasDepartamental
        urlIndicadorToGetData = servicios?.urls.indicadoresDepartal[indiSelected.urlDepartal]
        fieldValueToSetRangeCoropletico=indiSelected.fieldValueDepartal
        label_indicador = indiSelected.fieldlabelDepartal
    } else if((indiSelected.label.includes('3.1.1')||indiSelected.label.includes('3.1.2'))){
      urlIndicadorToGetData = servicios?.urls.indicadores[indiSelected.url]
       setEsIndicador("Nacional")
    }else{
      setEsIndicador("Nacional")
      urlIndicadorToGetData = servicios?.urls.indicadoresNaci[indiSelected.urlNal]
    }
    setSelectIndicadores(indiSelected)
    setMunicipios([])
    setTimeout(() => {
      handleIndicadorSelectedContinua({ indiSelected, target, _es_Indicador, geometrias, urlIndicadorToGetData, fieldValueToSetRangeCoropletico, label_indicador })
    }, 5000)
  }
  const handleIndicadorSelectedContinua = async ({ _where='1=1', indiSelected, target, _es_Indicador, geometrias, urlIndicadorToGetData, fieldValueToSetRangeCoropletico, label_indicador }) => {
    const { /* FeatureLayer, */ SimpleFillSymbol, Polygon, Graphic, GraphicsLayer } = esriModules    
    const [/* FeatureLayer, SimpleFillSymbol, Polygon, Graphic, GraphicsLayer,  */geometryEngine] = await loadModules([
     /*  "esri/layers/FeatureLayer",
      "esri/symbols/SimpleFillSymbol",
      "esri/geometry/Polygon",
      "esri/Graphic",
      "esri/layers/GraphicsLayer", */
      "esri/geometry/geometryEngine",
  ]);
    let responseIndicador
    // let layer
    if (!urlIndicadorToGetData /* || !servicios.urls.indicadoresNaciAlfanumerica[indiSelected.urlNalDataAlfanumerica] */) {
      setIsLoading(false)
      setMensajeModal({
        deployed: true,
        type: typeMSM.warning,
        tittle: 'Info',
        body: 'El indicador seleccionado no presenta servicio nacional',
        subBody: ''
      })
      if (utilsModule?.logger()) console.error({ urlIndicadorToGetData })
      // setSelectIndicadores(initSelectIndicadores)
      // return
    } else {
      urlIndicadorToGetData = `${urlIndicadorToGetData}/query`
     
      
      let dataGraficoIndi_311_indice_gini = null
      if ((indiSelected.label.includes('3.1.1')||indiSelected.label.includes('3.1.2')) && _es_Indicador == 'Nacional') {
        dataGraficoIndi_311_indice_gini = await utilsModule?.realizarConsulta('*', `${servicios?.urls.indicadoresNaci[indiSelected.urlNal]}/query`, false, '1=1')
      }else if ((indiSelected.label.includes('3.1.1')||indiSelected.label.includes('3.1.2')) && _es_Indicador == 'Departamental') {
        dataGraficoIndi_311_indice_gini = await utilsModule?.realizarConsulta('*', `${servicios?.urls.indicadoresDepartal["v_indice_gini_ids_depto"]}/query`, false, `cod_departamento = '${target.value}'`)
      }
      responseIndicador = await utilsModule?.realizarConsulta('*', urlIndicadorToGetData, false, _where)

      if (!responseIndicador.features || responseIndicador?.features.length < 1) {
        if (utilsModule?.logger()) console.error('Sin data en el responseIndicador => ', { responseIndicador, urlIndicadorToGetData, _where })
        setMensajeModal({
          deployed: true,
          type: typeMSM.warning,
          tittle: 'Info',
          body: 'Sin información nacional para el indicador seleccionado',
          subBody: ''
        })
        setIsLoading(false)
        return
      }
      clearGraphigs() // Elimina las geometrias dibujadas previamente      
      /** Extrae la geometria del servicio municipal q coinciden con el cod_municipio y fuciona los atributos del servicio de datos con la geometria*/
      responseIndicador = responseIndicador.features.map(RIN => {
        let geom = null
        if (_es_Indicador == 'es=1.7.') {
          geom = geometrias?.features?.find(GM => GM.attributes.decodigo === RIN.attributes.cod_departamento)
        }else if(_es_Indicador == 'Nacional' || _es_Indicador == 'Departamental'){
          const codMun = RIN.attributes.cod_municipio ? RIN.attributes.cod_municipio : RIN.attributes.mpcodigo ? RIN.attributes.mpcodigo : RIN.attributes.cod_departamento
          if (!codMun) console.error('No se encontró el código del municipio en el atributo', {RIN})
          //if (_es_Indicador == 'Nacional') {              
            geom = geometrias?.features?.find(GM => GM.attributes.mpcodigo === codMun)
            if (!geom) { // le apunta a traer geometria departamental
              geom = geometriasDepartamentos?.features?.find(GM => GM.attributes.decodigo === codMun)
            }
          /* }else if( _es_Indicador == 'Departamental'){
            geom = geometrias?.features?.find(GM => GM.attributes.decodigo === codMun)              
          } */
          if (!geom) console.error('No se encontró geometria', {RIN})
        }/* else if(_es_Indicador == 'Departamental'){          
          geometrias?.features?.find(GM => GM.attributes.mpcodigo === RIN.attributes.mpcodigo).geometry.rings[0][0]
        } */
        return { attributes: { ...RIN.attributes, ...(geom?.attributes ?? {}) }, geometry: geom?.geometry ?? null }
      })      
      let dataOrdenada = responseIndicador
      if (_es_Indicador == 'Departamental') {
        dataOrdenada = await poblarMunicipios({features:responseIndicador, targetDepartment:target.value})        
      }
             
      setTimeout(() => {
        
        utilsModule?.dibujarPoligono({
          features: dataOrdenada,
          // minValue: 0, // Removed as it is not a recognized property
          // interval: 0,
          jimuMapView,
          fieldValueToSetRangeCoropletico,
          lastLayerDeployed,
          Polygon,
          Graphic,
          GraphicsLayer,
          SimpleFillSymbol,
          setPoligonoSeleccionado,
          setClickHandler,
          setRangosLeyenda,
          setLastLayerDeployed,
          setIsLoading,
          indiSelected
          // layer
        })
              
        const groupAndSumData = (data, fieldValue, fieldLabels) => {
          // Helper function to group data by a key and sum values
          const groupBy = (key) => {
            const grouped = data.reduce((acc, item) => {
              const groupKey = item.attributes[key]
              // acc[groupKey] = (acc[groupKey] || 0) + item.attributes.cantidad_predios
              acc[groupKey] = (acc[groupKey] || 0) + item.attributes[fieldValue]
              return acc
            }, {})
  
            return {
              status: 'fulfilled',
              value: {
                displayFieldName: '',
                fieldAliases: {
                  [key]: key,
                  suma: 'suma'
                },
                fields: [
                  { name: key, type: typeof key === 'string' ? 'esriFieldTypeString' : 'esriFieldTypeSmallInteger', alias: key, length: 100 },
                  { name: 'suma', type: 'esriFieldTypeDouble', alias: 'suma' }
                ],
                features: Object.entries(grouped).map(([groupKey, suma]) => ({
                  attributes: {
                    [key]: typeof groupKey === 'string' ? groupKey : Number(groupKey),
                    suma
                  }
                }))
              }
            }
          }
  
          // Generate results for each key
          // return ['anio', 'modo_entrega', 'genero_beneficiario'].map((key) =>
          return fieldLabels.map((key) =>
            groupBy(key as keyof any)
          )
        }
        const dataToRenderGraphic = (((indiSelected.label.includes('3.1.1')||indiSelected.label.includes('3.1.2')) && _es_Indicador == 'Nacional')
        || ((indiSelected.label.includes('3.1.1')||indiSelected.label.includes('3.1.2')) && _es_Indicador == 'Departamental')) ? dataGraficoIndi_311_indice_gini?.features : responseIndicador

        /* if (!dataToRenderGraphic[0].geometry) {
          dataToRenderGraphic = dataToRenderGraphic.map((item) => {
            const geometry = responseIndicador.find(e=>e.attributes.cod_departamento == item.attributes.cod_departamento).geometry // Verifica si la geometría está en attributes
            return { ...item, geometry }
          })          
        } */
        
        const results = groupAndSumData(dataToRenderGraphic, fieldValueToSetRangeCoropletico, label_indicador)
        // const end = performance.now() // Fin de medición
        // console.log({ results })
        const sr = { ...respuestas, dataToRenderGraphic, results }
        setRespuestas(sr)
        
        if (utilsModule?.logger())  console.log({
            geometrias,
            INDICADOR: target.value,
            indiSelected,
            urlIndicadorToGetData,
            // urlAlfanumericaNal,
            dataToRenderGraphic,
            fieldValueToSetRangeCoropletico,
            // layer,
            // dataTempQueryNal,
            results
          })
          // console.log(`Tiempo transcurrido: ${(end - start).toFixed(2)} ms`) // Muestra el tiempo total
        
        if (!results) {
          setIsLoading(false)
          setMensajeModal({
          // console.log({
            deployed: true,
            type: typeMSM.warning,
            tittle: 'Info',
            body: 'Sin Data alfanumerica nacional para este indicador, continuar para ver data por municipio',
            subBody: ''
          })
          // eslint-disable-next-line no-useless-return
          return
        }
      
        const DATASET: Array<{ datasets: any[], labels: any[] }> = []
  
        // Función para procesar resultados y construir dataset
        const processField = (fieldlabelNal: string, legend: string) => {
          const result = results.find(e => {
            if (!e.value?.error) {
            // if (!e.error) {
              return e.value.fields[0].name === fieldlabelNal
              // return e.fields[0].name === fieldlabelNal
            } else {
              utilsModule?.logger() && console.error({ e, results })
              return false
            }
          })
  
          if (result) {
            const data = result.value.features.map(({ attributes }) => attributes.suma)
            // const data = result.features.map(({ attributes }) => attributes.suma)
            const labels = result.value.features.map(({ attributes }) => attributes[fieldlabelNal])
            // const labels = result.features.map(({ attributes }) => attributes[fieldlabelNal])
  
            return {
              datasets: [
                {
                  backgroundColor: utilsModule?.getRandomRGBA(),
                  data,
                  label: legend
                }
              ],
              labels
            }
          }
  
          return null // Devuelve null si no hay datos válidos
        }
  
        // Iterar sobre los campos y procesarlos
        label_indicador.forEach((fieldlabelNal, i) => {
          const legend = (_es_Indicador == 'Departamental' || _es_Indicador == 'es=1.7.')? indiSelected.leyendaDepartal[i] : indiSelected.leyendaNal[i]
          const dataset = processField(fieldlabelNal, legend)
          if (dataset) {
            DATASET.push(dataset)
          }
        })
  
        // logica para ajustar el extend al departamento seleccionado
        let extentAjustado = undefined
        if ((_es_Indicador == 'Departamental' || _es_Indicador == 'es=1.7.') && responseIndicador[0].geometry?.extent/* responseIndicador?.features?.length > 0 */) {
          if (utilsModule?.logger()) console.log({
            _es_Indicador,
            dataToRenderGraphic,
            responseIndicador,
            geometryEngine
          })
          let geometria_featu = dataToRenderGraphic.features ? dataToRenderGraphic.features : dataToRenderGraphic
          geometria_featu=geometria_featu[0].geometry?geometria_featu:responseIndicador
          // geometria_featu= responseIndicador//no funcino
          if (utilsModule?.logger()) console.log({geometria_featu})
          const geometriaDepto = geometria_featu?.map(feature => feature.geometry);
          if (geometriaDepto.length > 0) {
              // Verificar si geometryEngine está definido
              if (!geometryEngine) {
                  console.error("geometryEngine no está definido. Verifica la importación.");
                  return;
              }
  
              // Combina las geometrías en una sola
              const geometriaUnida = geometryEngine.union(geometriaDepto);
              if (geometriaUnida) {
                  const extent = geometriaUnida.extent;
                  extentAjustado = extent.expand(1.05); 
                  // const extentAumentado = geometryEngine.buffer(extent, 5000); // Aleja un poco el zoom en metros
                  // jimuMapView.view.goTo(extentAjustado);
              }
          }
        }
  
        const dataToRender = JSON.stringify(
          {
            nacional: {
              dataAlfanuemricaNal: DATASET,
              indiSelected,
              dataToRenderGraphic,
              url: urlIndicadorToGetData,
              fieldValueToSetRangeCoropletico,
              extentAjustado
            }
          }
        )
        dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
        //  'https://pruebassig.igac.gov.co/server/rest/services/Indicadores_nacionales_municipales/MapServer/3/query'
        /* const dataAlfanuemricaNal = await utilsModule?.realizarConsulta('*', urlAlfanumericaNal, false, '1=1')
        // enviar data al widget indicadores para pintar graficos estaditicos a nivel nacional
        // con lo siguiente se envia la data al widget indicadores para renderizar la grafica de barras
        */
        
        
        setIsLoading(false)
      }, 5000);
    }
  }

  /**
   * En este metodo se selecciona el departamento al que se va realizar la consulta de indicadores
   * y genera la consulta
   * @param param0
   */
  const handleDepartamentoSelected = async ({ target }) => {
    const targetDepartment = target.value
    const itemSelected = departamentos.find(departamento => departamento.value === targetDepartment)
    setDepartmentSelect(itemSelected) // se utiliza para sacar el label en la grafica, widget indicadores y control el valor en el campo departamento
    if (itemSelected.value === 0) return

    setIsLoading(true)
    let tipoConsulta = 'Departamental', _geometrias=geometriaMunicipios
    if (selectIndicadores?.label.includes('1.7.')) {
      tipoConsulta = 'es=1.7.'
      _geometrias=geometriasDepartamentos
    }
    setEsIndicador(tipoConsulta)
    const urlIndicadorToGetData = servicios?.urls.indicadoresDepartal[selectIndicadores?.urlDepartal]
    if (!urlIndicadorToGetData) {
      console.error(`urlIndicadorToGetData no encontrado, revisar indicador en dataFormulario y servicios`)
      setIsLoading(false)
      return
    }
    handleIndicadorSelectedContinua({
      indiSelected:selectIndicadores,
      target,
      _es_Indicador:tipoConsulta,
      geometrias:_geometrias,
      urlIndicadorToGetData,
      fieldValueToSetRangeCoropletico:selectIndicadores?.fieldValueDepartal,
      label_indicador: selectIndicadores?.fieldlabelDepartal,
      _where:`cod_departamento='${target.value}'`
    })
  }

  const poblarMunicipios = async ({features, targetDepartment}) => {
    let dataOrdenada = utilsModule?.ajustarDataToRender({ features }, '', 'mpnombre') //simplemente ordena los features
    const eliminaRegistrosRepetidos = utilsModule?.discriminarRepetidos(dataOrdenada, 'label')
    eliminaRegistrosRepetidos?.unshift({ value: 0, label: 'Seleccione ...' })
    setMunicipios(eliminaRegistrosRepetidos)
    const filterRespIndiNal = features.filter(rin => rin.attributes.decodigo === targetDepartment)
    dataOrdenada?.map(f => {
      const codigoMunicipio = f.attributes.mpcodigo ? f.attributes.mpcodigo : f.attributes.cod_municipio
      filterRespIndiNal.forEach(dc => {
        // if (codigoMunicipio === dc.attributes.cod_municipio || f.attributes.decodigo === dc.attributes.cod_departamento) {
        if(codigoMunicipio === dc.attributes.mpcodigo){
          f.attributes.dataIndicadores
            ? f.attributes.dataIndicadores.push({[selectIndicadores.fieldValueDepartal]:dc.attributes[selectIndicadores.fieldValueDepartal]})
            : f.attributes.dataIndicadores = [{[selectIndicadores.fieldValueDepartal]:dc.attributes[selectIndicadores.fieldValueDepartal]}]
        }
      })
    })
    return dataOrdenada
  }

  /**
   * captura el municipio seleccionado en el intput, ajusta extend, resalta el poligono seleccionado
   * @param param0
   */
  const handleMunicipioSelected = async ({ target }) => {
    setIsLoading(true)
    setTimeout(async () => {
      let itemSelected = municipios.find(municipio => municipio.value === target.value)
      if (!itemSelected) {
        const municipios_slice = municipios.slice(1)
        itemSelected = municipios_slice.find(municipio => municipio.value.attributes.mpcodigo === target.value.attributes.mpcodigo)
      }
      setMunicipioSelect(itemSelected)
      if (itemSelected?.value === 0){
        setIsLoading(false)
        return
      } 
      if (utilsModule?.logger()) console.log({ municipios: itemSelected })
      utilsModule?.goToOneExtentAndZoom({ jimuMapView, extent: itemSelected?.value.geometry.extent, duration: 1000 })
      const graphicMunicipioSlected = lastLayerDeployed.graphics.find(e => e.attributes.mpcodigo === itemSelected?.mpcodigo)
      // setPoligonoSeleccionado(graphicMunicipioSlected)
      const urlservicioMunicipal = `${servicios?.urls.indicadores[selectIndicadores.url]}/query`
      const responseUrlservicioMunicipal = await utilsModule?.realizarConsulta('*', urlservicioMunicipal, false, `mpcodigo = '${itemSelected?.mpcodigo}'`)
      utilsModule?.dibujarPoligonoToResaltar(
        {
          rings: graphicMunicipioSlected.geometry.rings,
          wkid: graphicMunicipioSlected.geometry.spatialReference.wkid,
          attributes: graphicMunicipioSlected.attributes,
          jimuMapView,
          times: 3,
          borrar: true
        })
      // jimuMapView.view.goTo(itemSelected.value.geometry.extent)
      //Con las siguientes lineas se envia la data al widget indicadores para renderizar las graficas estadisticas
      const tempPoligonoSeleccionado = {
        // geometry: itemSelected.value.geometry, symbol: {}, attributes: itemSelected, popupTemplate: {}
        geometry: itemSelected?.value.geometry, symbol: {}, attributes: responseUrlservicioMunicipal.features, popupTemplate: {}
      }
      if (selectIndicadores.urlNal !== '') {
        const dataToRender = JSON.stringify({ municipal: { poligonoSeleccionado: tempPoligonoSeleccionado, departmentSelect, selectIndicadores } })
        dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
      } else {
        setMensajeModal({
          deployed: true,
          type: typeMSM.warning,
          tittle: 'Info',
          body: `Sin información estadistica para ${itemSelected?.mpnombre}`,
          subBody: ''
        })
      }
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }, 1000)
  }

  // Elimina las geometrias dibujadas previamente
  const clearGraphigs = () => {
    if (utilsModule?.logger()) console.log('clearGraphigs')
    // if (lastLayerDeployed.length > 0) utilsModule.removeLayer(jimuMapView, lastLayerDeployed)
    if (lastLayerDeployed.graphicsLayers.length > 0){
      utilsModule?.removeLayer(jimuMapView, lastLayerDeployed.graphicsLayers)
      const dataToWidgetIndicadores = JSON.stringify({ clear: true })
      dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToWidgetIndicadores))
    } 
    /* setTimeout(() => {
      setLastLayerDeployed(initLastLayerDeployed)
    }, 2000) */
    // jimuMapView.view.
  }
  const consultar = () => {
    setIsLoading(true)
    if (utilsModule?.logger()) {
      console.log(
        {
          isLoading,
          clickHandler,
          poligonoSeleccionado,
          geometriaMunicipios,
          dataFuenteIndicadores,
          selectSubSistema,
          apuestaEstrategica,
          selectApuestaEstategica,
          categoriaTematica,
          selectCategoriaTematica,
          indicadores,
          selectIndicadores,
          responseIndicadores,
          departmentSelect,
          municipios,
          municipioSelect,
          rangosLeyenda,
          esriModules
        }
      )
      setIsLoading(false)
    }
  }

  const formularioIndicadores = () => {
    return (
      <>               
        { widgetModules?.INPUTSELECT(dataFuenteIndicadores, handleSubsistemaSelected, selectSubSistema?.value, 'Sub Sistema', '') }

        { (apuestaEstrategica && widgetModules) &&
          widgetModules.INPUTSELECT(apuestaEstrategica, handleApuestaEstrategicaSelected, selectApuestaEstategica?.value, 'Línea estratégica', 'APUESTA_ESTRATEGICA')
        }
        { (categoriaTematica && widgetModules && (categoriaTematica.CATEGORIA_TEMATICA.length >= 1 && categoriaTematica.CATEGORIA_TEMATICA[0].label !== '')) &&
          widgetModules.INPUTSELECT(categoriaTematica, handleCategoriaTematicaSelected, selectCategoriaTematica?.value, 'Categoría Temática', 'CATEGORIA_TEMATICA')
        }
        { (indicadores && widgetModules) &&
          widgetModules.INPUTSELECT(indicadores, handleIndicadorSelected, selectIndicadores?.value, 'Indicador', 'INDICADOR')
        }
        { (selectIndicadores && widgetModules) &&
          widgetModules.INPUTSELECT(departamentos, handleDepartamentoSelected, departmentSelect?.value, 'Departamento', '')
        }
        { ((es_Indicador == 'Departamental' || es_Indicador == 'Nacional') && departmentSelect?.value && municipios.length>1) &&
          widgetModules?.INPUTSELECT(municipios, handleMunicipioSelected, municipioSelect?.value, 'Municipio', '')
        }
        <Button
          size='sm'
          type='default'
          onClick={ () => {
            setSelectSubSistema(undefined)
            setApuestaEstrategica(null)
            setCategoriaTematica(null)
            setDepartmentSelect(undefined)
            setSelectIndicadores(initSelectIndicadores)
            setIndicadores(null)
            setMunicipios([])
            clearGraphigs()
            setRangosLeyenda([])
          }}
          className='mb-4'
        >
          Limpiar
        </Button>
        {
          utilsModule?.logger() &&
          <Button
              size='sm'
              type='default'
              onClick={consultar}
              className='mb-4'
            >
            Consultar
          </Button>
        }

        {
         (rangosLeyenda.length > 0 && constantes) &&
          <div className='legend'>
            <h3 style={{ color: 'white' }}>{/* { indicadores.label  } por  */}{selectIndicadores.label} {selectIndicadores.fieldValue === 'total_area_ha' ? '(ha)' : ''}</h3>
            <ul>
              {constantes.coloresMapaCoropletico.map((item, index) => (
                rangosLeyenda[index] &&
                  <li key={index}>
                        <span style={{ backgroundColor: item.colorRgb }}></span> {` ${rangosLeyenda[index][2]?`${rangosLeyenda[index][2]} : `:''} ${rangosLeyenda[index][0]}     ${index==0?'':'-'}     ${rangosLeyenda[index][1]}`}
                  </li>
              ))}
            </ul>
            {/* <p>Quintiles</p> */}            
          </div>
        }
      </>
    )
  }
  const getGeometriasMunicipios = async (url: string) => {
    setIsLoading(true)
    try {
      const municipiosResponse = await utilsModule.queryAttributesLayer({ url: url + '/query', definitionExpression: '1=1', returnGeometry: true, outFields: '*' })
      const resumenMunicipios = {
        features: municipiosResponse.features,
        fields: municipiosResponse.fields,
        geometryType: municipiosResponse.geometryType,
        spatialReference: municipiosResponse.spatialReference
      }
      // const departAjustadosToRender = utilsModule.ajustarDataToRender(dataResponse,'decodigo','denombre')
      if (utilsModule?.logger()) console.log({ municipiosResponse, resumenMunicipios })
      setGeometriaMunicipios(resumenMunicipios)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error({ error, url })
      setMensajeModal({
        deployed: true,
        type: typeMSM.error,
        tittle: 'Fallo comunicación',
        body:'Consulta geometrias municipios',
        subBody:'Intentelo nuevamente o comuniquese con el administrador del sistema'
      })
    }
  }

  const cargarModulosEsri = async () => {
    const modulosEsri = await utilsModule?.loadEsriModules()
    setEsriModules(modulosEsri)
  }

  useEffect(() => {
    if (utilsModule) {
      setTimeout(() => {
        getGeometriasMunicipios(servicios.urls.Municipios)
      }, 2000)
    }

    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jimuMapView])

  useEffect(() => {
    if (utilsModule?.logger()) console.log({ geometriaMunicipios })
    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometriaMunicipios])

  /**
   * Ajusta campos de municipios
   */
  useEffect(() => {
    if (utilsModule?.logger()) console.log({municipios})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [municipios])

  /**
   * con este effect limpia el ultimo grafico estadistico selecionado
   */
 /*  useEffect(() => {
    if (utilsModule?.logger()) console.log({ where: 'Effect selectSubSistema', widgetIdIndicadores })
    // if (departmentSelect.value === '0') return
    const dataToWidgetIndicadores = JSON.stringify({ clear: true })
    dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToWidgetIndicadores))
    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectSubSistema, categoriaTematica, selectCategoriaTematica, selectIndicadores, departmentSelect]) */

  /**
   * al dar un click en uno de los municipios, captura el poligono seleccionado y lo envia al widget indicadores
   * con la data correspondiente para renderizar la grafica de barras estadistica
   */
  useEffect(() => {
    if (!poligonoSeleccionado || !departmentSelect) return

    handleMunicipioSelected({
      target:{
        value:{
          attributes:poligonoSeleccionado.attributes,
          geometry:poligonoSeleccionado.geometry
        }
      }
    })
    
    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poligonoSeleccionado])

  useEffect(() => {
    if (!utilsModule) return
    cargarModulosEsri()

    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utilsModule])

  /**
   * Carga los modulos necesarios a emplear en el widget
   */
  useEffect(() => {
   /*  alert(`
      - Quede en el item 1.5.3, verificar el valor del coropletico a nivel municipal, no me cuadra
      - ajustar extend del item 3.1.1 y 3.1.2
      - sincronizar el borrado del grafico con el del coropletico
      `) */
    import('../widgetsModule').then(modulo => { setWidgetModules(modulo) })
    import('../../utils/module').then((modulo) => { setUtilsModule(modulo) })
    import('../../api/servicios').then(modulo => { setServicios(modulo) })
    import('../../utils/constantes').then(modulo => { setConstantes(modulo) })
  }, [])

  return (
    <div className=''>
        {
          formularioIndicadores()
        }
        {
          widgetModules?.MODAL(mensajeModal, setMensajeModal)
        }
        {
          isLoading && widgetModules?.OUR_LOADING()
        }
    </div>
  )
}

export default TabIndicadores

enum typeMSM {
  success = 'success',
  info = 'info',
  error = 'error',
  warning = 'warning',
}

export interface InterfaceConstantes {
  coloresMapaCoropletico: ColoresMapaCoropletico[]
  diccionario: Diccionario
}

export interface ColoresMapaCoropletico {
  colorRgb: string
  value: number[]
}

export interface Diccionario {
  indicadores: Indicadores
}

export interface Indicadores {
  decodigo: string
  cantidad_predios: string
  mpcodigo: string
}

export interface InterfaceDataCoropletico {
  attributes: Attributes
}

export interface Attributes {
  cod_departamento: string
  cod_municipio: string
  mpnombre: string
  anio: number
  tipo_predio: TipoPredio
  cantidad_predios: number
  total_area_ha: number
  ESRI_OID: number
}

export enum TipoPredio {
  Baldio = 'Baldio',
  BaldioReservado = 'Baldio Reservado',
  FiscalPatrimonial = 'Fiscal Patrimonial',
}

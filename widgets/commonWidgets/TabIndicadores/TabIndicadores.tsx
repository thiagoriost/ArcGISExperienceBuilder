import React, { useEffect, useState } from 'react'
import { Button } from 'jimu-ui'
import { appActions } from 'jimu-core'
import './style.css'
import { dataFuenteIndicadores } from './dataFormularioIndicadores'
import { loadModules } from "esri-loader";
import Extent from "@arcgis/core/geometry/Extent"

const widgetIdIndicadores = 'widget_48' // se genera al ingresar al widget objetivo y generarlo en el effect de inicio con props.id
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const constantesTabIndicadores = {
  decodigo: 'decodigo',
  mpcodigo: 'mpcodigo'
}
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
  url: string;
};
const initLastLayerDeployed = { graphics: [], graphicsLayers: [] }
const init_indiSelected={
  value: 0,
  label: '',
  descripcion: '',
  url: '',
  urlNal: '',
  urlDepartal: '',
  urlNalDataAlfanumerica: '',
  fieldlabel: [],
  fieldlabelNal: [],
  fieldlabelDepartal: [],
  leyenda: [],
  leyendaNal: [],
  leyendaDepartal: [],
  fieldValue: '',
  fieldValueNal: '',
  fieldValueDepartal: '',
  quintiles: []
}

const TabIndicadores: React.FC<any> = ({ dispatch, departamentos, jimuMapView }) => {
  const [constantes, setConstantes] = useState<InterfaceConstantes | null>(null)
  const [widgetModules, setWidgetModules] = useState<typeof import('../widgetsModule') | undefined>(undefined)
  const [servicios, setServicios] = useState<typeof import('../../api/servicios')>()
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
  const [geometriasDepartamentos, setGeometriasDepartamentos] = useState<{ features: { attributes: {
    decodigo: any; mpcodigo: string }; geometry: any }[] } | undefined>(undefined)
  // const [selectSubSistema, setSelectSubSistema] = useState<{ value: number; label: string; descripcion: string; APUESTA_ESTRATEGICA: { value: number; label: string; descripcion: string; CATEGORIA_TEMATICA: { value: number; label: string; descripcion: string; INDICADOR: ({ value: number; label: string } | { value: number; label: string })[]; }[]; }[]; } | undefined>(undefined)
  const [apuestaEstrategica, setApuestaEstrategica] = useState<{ value: number; label: string; descripcion: string; APUESTA_ESTRATEGICA: { value: number; label: string; descripcion: string; CATEGORIA_TEMATICA: { value: number; label: string; descripcion: string; INDICADOR: ({ value: number; label: string } | { value: number; label: string })[]; }[]; }[]; } | null>(null)
  const [selectApuestaEstategica, setSelectApuestaEstategica] = useState<{ value: number; label: string; descripcion: string; CATEGORIA_TEMATICA: { value: number; label: string; descripcion: string; INDICADOR: ({ value: number; label: string } | { value: number; label: string })[]; }[]; } | undefined>(undefined)
  // const [categoriaTematica, setCategoriaTematica] = useState<{ value: number; label: string; descripcion: string; CATEGORIA_TEMATICA: { value: number; label: string; descripcion: string; INDICADOR: ({ value: number; label: string } | { value: number; label: string })[]; }[]; } | null>(null)
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
    // setSelectSubSistema(findSubSistema)
    // setCategoriaTematica(null)
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
    // setCategoriaTematica(APUESTA_ESTRATEGICA || null)
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
    const CATEGORIA_TEMATICA = selectApuestaEstategica?.CATEGORIA_TEMATICA.find(e => e.value === target.value)
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
    let __geometriasDepartamental
    let outStatistics: string = ''
    let _es_Indicador = "Nacional"
    let indiSelected: InterfaceIndiSelected = indicadores?.find(e => e.value === target.value) as InterfaceIndiSelected || init_indiSelected
    let geometrias = geometriaMunicipios
    let fieldValueToSetRangeCoropletico=indiSelected?.fieldValueNal
    let label_indicador = indiSelected?.fieldlabelNal    
    let urlIndicadorToGetData=servicios?.urls.indicadoresNaci[indiSelected?.urlNal]
    if (!geometriasDepartamentos) {//esto para traer la geometria de los departamentos solo una vez
      __geometriasDepartamental = await utilsModule?.realizarConsulta({url:servicios?.urls.Departamentos+'/query', returnGeometry:true})
      setGeometriasDepartamentos(__geometriasDepartamental);      
    }else{
      __geometriasDepartamental = geometriasDepartamentos
    }
    fieldValueToSetRangeCoropletico=indiSelected.fieldValueNal
    label_indicador = indiSelected.fieldlabelNal
     _es_Indicador = "Nacional"
    if (indiSelected.label.includes('1.7.')) {
        // setEsIndicador('es=1.7.')
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
      outStatistics = JSON.stringify([
        {
          "statisticType": "sum",
          onStatisticField:indiSelected.fieldValueNal,
          "outStatisticFieldName": `Total`
        }
      ])
      fieldValueToSetRangeCoropletico="total"
    }
    setSelectIndicadores(indiSelected)
    setMunicipios([]) // para deshabilitar el campo municipio
    setTimeout(() => {
      handleIndicadorSelectedContinua({ indiSelected, target, _es_Indicador, geometrias, urlIndicadorToGetData, outStatistics, fieldValueToSetRangeCoropletico, regionSeleccionada: 'Nacional' })
    }, 5000)
  }
  const handleIndicadorSelectedContinua = async ({
    _where='1=1',
    indiSelected,
    target,
    _es_Indicador,
    geometrias,
    urlIndicadorToGetData,
    outStatistics='',
    fieldValueToSetRangeCoropletico,
    regionSeleccionada=''
  }) => {
    const {fieldlabelNal} = indiSelected
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
    
      responseIndicador = await utilsModule?.realizarConsulta({url:urlIndicadorToGetData, where:_where, outStatistics:outStatistics, groupByFieldsForStatistics:'mpcodigo'})
      /* let dataGraficoIndi_311_indice_gini = null
      if ((indiSelected.label.includes('3.1.1')||indiSelected.label.includes('3.1.2')) && _es_Indicador == 'Departamental') {
        dataGraficoIndi_311_indice_gini = await utilsModule?.realizarConsulta({url:`${servicios?.urls.indicadoresDepartal["v_indice_gini_ids_depto"]}/query`, where:`cod_departamento = '${target.value}'`})
      } */
    
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

    if (!geometrias) {
      try {
        geometrias = await obtenerGeometriasUnicas(responseIndicador);
        //console.log('Geometrías obtenidas:', geometrias);
      } catch (error) {
        console.error('Error:', error);
      }
    }


    if (regionSeleccionada !== 'Municipal') clearGraphigs() // Elimina las geometrias dibujadas previamente      
    if (geometrias) {
      /** Extrae la geometria del servicio municipal q coinciden con el cod_municipio y fuciona los atributos del servicio de datos con la geometria*/
      const geometriasNoEncontradas: {attributes:{mpcodigo:string}}[] = []
      responseIndicador = responseIndicador.features.map(RIN => {
        let geom: typeGeometria | undefined | null;
        if(regionSeleccionada === 'Municipal'){
          geom = geometrias?.features?.find(GM => GM.attributes.mpcodigo === RIN.attributes.mpcodigo)
        }else if (_es_Indicador == 'es=1.7.') { // las geometrias que vienen desde el servicio departamental, solo traen los rings, mas no el exteny demas, en comparacion con el municipal
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
          if (!geom){
            console.error('No se encontró geometria', {RIN})
            geometriasNoEncontradas.push({
              attributes:{
                mpcodigo: RIN.attributes.mpcodigo
              }
            })
          } 
        }/* else if(_es_Indicador == 'Departamental'){          
          geometrias?.features?.find(GM => GM.attributes.mpcodigo === RIN.attributes.mpcodigo).geometry.rings[0][0]
        } */
        return { attributes: { ...RIN.attributes, ...(geom?.attributes ?? {}) }, geometry: geom?.geometry ?? null }
      })  
      if (geometriasNoEncontradas.length > 0) {
        geometrias = await obtenerGeometriasUnicas({features:geometriasNoEncontradas});
        setMensajeModal({
          deployed: true,
          type: typeMSM.error,
          tittle: 'GEOMETRIAS NO ENCONTRADAS',
          body: 'Intentalo nuevamente',
          subBody: ''
        })
        setIsLoading(false)
        return
      }
    }else{
      console.error('geometrias no definidas', { geometrias})
      setMensajeModal({
        deployed: true,
        type: typeMSM.error,
        tittle: 'GEOMETRIAS NO ENCONTRADAS',
        body: 'Recarga el visor o intentalo nuevamente',
        subBody: ''
      })
      setIsLoading(false)
      return
    }    
    let dataOrdenada: never[] | undefined
    if (_es_Indicador == 'Departamental') {
      dataOrdenada = await poblarMunicipios({features:responseIndicador, targetDepartment:target.value})        
    }

    if (responseIndicador.map(e => e.geometry).length !== responseIndicador.length) {
      setMensajeModal({
        deployed: true,
        type: typeMSM.error,
        tittle: 'Sin geometrias',
        body: 'Recarga el visor o intentalo mas tarde',
        subBody: ''
      })
      setIsLoading(false)
      return
    }
            
    setTimeout(async() => {
      if (regionSeleccionada !== 'Municipal') utilsModule?.dibujarPoligono({
        features: responseIndicador,
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
      let dataToRenderGraphic = await getDataToRenderGraficosEstadisticos({indiSelected, _where, regionSeleccionada}) // realiza las consultas teniendo encuenta el fieldLabel en el Output Statistics
      
      /* dataToRenderGraphic = ((indiSelected.label.includes('3.1.1')||indiSelected.label.includes('3.1.2')) && regionSeleccionada == 'Departamental')
      ? dataGraficoIndi_311_indice_gini?.features
      : responseIndicador */
      /**
       * Logica para ajustar el DATASET para renderizar las graficas de barras
       */
      
      const DATASET = ajustarDATASET({dataToRenderGraphic, regionSeleccionada, indiSelected})
      //console.log({DATASET})


      // logica para ajustar el extend al departamento seleccionado
      let extentAjustado : GeographicExtent | undefined = undefined
      if (regionSeleccionada === 'Municipal' || (_es_Indicador == 'Departamental' && responseIndicador[0].geometry?.extent/* responseIndicador?.features?.length > 0 */)) {
        if (utilsModule?.logger()) console.log({
          _es_Indicador,
          dataToRenderGraphic,
          responseIndicador,
          geometryEngine
        })
        extentAjustado = (responseIndicador.length == 1) ? calculateExtent(responseIndicador[0].geometry.rings) : ajustarExtend({dataToRenderGraphic, responseIndicador, geometryEngine})
        //console.log({extentAjustado})
      }else if (_es_Indicador == 'es=1.7.' && regionSeleccionada == 'Departamental') {
        extentAjustado = calculateExtent(responseIndicador[0].geometry.rings)
      }

      const dataToRender = JSON.stringify(
        {
          nacional: {
            dataAlfanumericaNal: DATASET,
            indiSelected,
            regionSeleccionada,
            extentAjustado
          }
        }
      )
      dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
      
      setIsLoading(false)
      }, 5000);
    }
  }

  /**
 * Obtiene geometrías únicas basadas en los mpcodigo de un responseIndicador
 * @param responseIndicador - Objeto con features que contienen atributos mpcodigo
 * @param utilsModule - Módulo con función realizarConsulta
 * @param servicios - Objeto con URLs de servicios
 * @returns Promise con las geometrías obtenidas
 */
const obtenerGeometriasUnicas = async(
  responseIndicador: { features: Array<{ attributes: { mpcodigo: string } }> }
): Promise<any> => {
  // 1. Extraer y filtrar códigos únicos
  const mpCodigos = responseIndicador.features.map(feature => feature.attributes.mpcodigo);
  const codigosUnicos = [...new Set(mpCodigos)];

  // 2. Construir consulta WHERE optimizada
  // const whereClause = codigosUnicos.map(codigo => `mpcodigo='${codigo}'`).join(' or ');
  const whereClause = `mpcodigo IN (${codigosUnicos.map(c => `'${c}'`).join(',')})`;

  // 3. Realizar consulta
  try {
    /* const geometrias = await utilsModule.realizarConsulta({
      url: servicios.urls.Municipios,
      where: whereClause,
      returnGeometry: true
    }); */

    const geometrias =  await getGeometriasMunicipios({url:servicios?.urls.Municipios, where:whereClause})

    return geometrias;
  } catch (error) {
    console.error('Error al obtener geometrías:', error);
    throw error;
  }
}


  /**
   * Ajusta la data que sera enviada por el DATASET para renderizar las graficas de barras
   */
  const ajustarDATASET = ({dataToRenderGraphic, regionSeleccionada, indiSelected}) => { 
    const processChartData = (data: { features: { attributes: Record<string, any> }[] }, labelKey: string, valueKey: string, sortKey = null) => {
      const sortedData = sortKey
      ? data.features.sort(
          (a, b) => a.attributes[sortKey] - b.attributes[sortKey]
        )
      : data.features;

      const labels: string[] = [];
      const values: any[] = [];

      sortedData.forEach(({ attributes }) => {
        labels.push(attributes[labelKey]);
        values.push(attributes[valueKey]);
      });
      return { labels, values };
    };
    const respuestaDataProcesada:Indicador_respuestaDataProcesada[] = []
    //console.log({dataToRenderGraphic})
    dataToRenderGraphic?.forEach(respuesta => {
      const resp = processChartData(respuesta, respuesta.fields[0].name, respuesta.fields[1].name)
      respuestaDataProcesada.push(resp)
    })
    const DATASET: interface_DATASET[] = [];
    const leyenda = regionSeleccionada === 'Nacional' ? indiSelected.leyendaNal: regionSeleccionada === 'Municipal'? indiSelected.leyenda : indiSelected.leyendaDepartal
    respuestaDataProcesada.forEach((respDatProc, index) => {
      const colorRGBA: RGBAColor = utilsModule?.getRandomRGBA()
      //console.log({colorRGBA})
      const {rgba, valueRGBA} = colorRGBA
      DATASET.push({
        labels: respDatProc.labels,
        datasets: [
          {
            label: `${leyenda[index]}`,
            data: respDatProc.values,
            backgroundColor: rgba,
            borderColor: `rgba(${valueRGBA[0]}, ${valueRGBA[1]}, ${valueRGBA[2]}, 1)`,
            borderWidth: 2,
          }
        ]
      })
    })
    return DATASET
  }

  const ajustarExtend = ({ dataToRenderGraphic, responseIndicador, geometryEngine }) => {
    if (!geometryEngine) {
      console.error("geometryEngine no está definido. Verificar importación.");
      return null; // Retorna un valor claro en caso de error
    }
  
    // Obtiene las geometrías de forma segura
    const geometriaFeatu = dataToRenderGraphic?.features || responseIndicador;
    if (!geometriaFeatu?.length) {
      console.warn("No se encontraron geometrías para procesar.");
      return null;
    }
  
    const geometriaDepto = geometriaFeatu.map(feature => feature.geometry);
    if (!geometriaDepto.length) {
      console.warn("No se encontraron geometrías válidas en los datos proporcionados.");
      return null;
    }
  
    // Combina las geometrías en una sola
    //console.log({geometriaDepto}, geometriaDepto.length)
    if (geometriaDepto.length > 9) {
      console.warn(`Demasiadas geometrías ${geometriaDepto.length} para unir y generar el extend, por tiempos toma parte de las geometrias para generar extend y aplicarlo`);
      geometriaDepto.splice(9)
      // return null;
      
    }

    const geometriaUnida = geometryEngine.union(geometriaDepto);
    if (!geometriaUnida) {
      console.warn("No se pudo unir las geometrías.");
      return null;
    }
  
    // Calcula y retorna el extent ajustado
    const extent = geometriaUnida.extent;
    return extent.expand(1.15); // Expande un 15% el extent
  };
  
  const getDataToRenderGraficosEstadisticos = async ({
    indiSelected, _where="1=1", regionSeleccionada }: { indiSelected: IndicadorSeleccionado; _where:string; regionSeleccionada:string }) => {
    let fieldlabel, fieldValue, url
    if (regionSeleccionada === 'Nacional') {
      fieldlabel = indiSelected?.fieldlabelNal
      fieldValue = indiSelected.fieldValueNal
      url = servicios?.urls.indicadoresNaci[indiSelected.urlNal]
    }else if (regionSeleccionada === 'Departamental'){
      fieldlabel = indiSelected.fieldlabelDepartal
      fieldValue = indiSelected.fieldValueDepartal
      url = servicios?.urls.indicadoresNaci[indiSelected.urlDepartal]
    }else if (regionSeleccionada === 'Municipal'){
      fieldlabel = indiSelected.fieldlabel
      fieldValue = indiSelected.fieldValue
      url = servicios?.urls.indicadoresNaci[indiSelected.url]
    }

    try {
      // 1. Validación de datos iniciales
      if (!fieldlabel?.length || !fieldValue || !url) {
        console.error('Datos requeridos no están disponibles');
        setIsLoading(false);
        return;
      }
  
      // 2. Procesamiento en paralelo para mejor rendimiento
      const dataTorenderGraphics = await Promise.all(
        indiSelected.fieldlabelNal.map(async (fln) => {         
          const outStatistics: OutStatistics = [{
            statisticType: 'sum',
            onStatisticField: fieldValue,
            outStatisticFieldName: `total`
          }];
  
          return utilsModule?.realizarConsulta({
            url,
            outStatistics: JSON.stringify(outStatistics),
            groupByFieldsForStatistics: fln,
            where: _where
          });
        })
      );
  
      // 3. Filtrado de respuestas inválidas
      const validResponses = dataTorenderGraphics.filter(Boolean);
      
      //console.log('Datos para gráficos:', validResponses);
      return validResponses;
      
    } catch (error) {
      console.error('Error al renderizar gráficos:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * En este metodo se selecciona el departamento al que se va realizar la consulta de indicadores
   * y genera la consulta
   * @param param0
   */
  const handleDepartamentoSelected = async ({ target }) => {
    const targetDepartment = target.value
    const itemSelected = departamentos.find(departamento => departamento.value === targetDepartment)
    if (itemSelected.value === 0) return
    setDepartmentSelect(itemSelected) // se utiliza para sacar el label en la grafica, widget indicadores y control el valor en el campo departamento

    setIsLoading(true)
    let tipoConsulta = 'Departamental', _geometrias=geometriaMunicipios
    if (selectIndicadores?.label.includes('1.7.')) {
      tipoConsulta = 'es=1.7.'
      _geometrias=geometriasDepartamentos
    }
    let urlIndicadorToGetData = servicios?.urls.indicadoresDepartal[selectIndicadores?.urlDepartal]
    if (selectIndicadores?.label.includes('3.1.1')||selectIndicadores?.label.includes('3.1.2')){
      urlIndicadorToGetData = servicios?.urls.indicadores[selectIndicadores?.url]
      tipoConsulta = 'Departamental'
    }    
    if (!urlIndicadorToGetData) {
      console.error(`urlIndicadorToGetData no encontrado, revisar indicador en dataFormulario y servicios`)
      setIsLoading(false)
      return
    }
    handleIndicadorSelectedContinua({
      _where:`cod_departamento='${target.value}'`,
      indiSelected:{...selectIndicadores, deparmetSelected:itemSelected.denombre},
      target,
      _es_Indicador:tipoConsulta,
      geometrias:_geometrias,
      urlIndicadorToGetData,
      fieldValueToSetRangeCoropletico:selectIndicadores?.fieldValueDepartal,
      regionSeleccionada:'Departamental'
      // label_indicador: selectIndicadores?.fieldlabelDepartal,
    })
  }

  // Calcular el extent
const calculateExtent = (rings) => {
  let minX = Number.MAX_VALUE,
    minY = Number.MAX_VALUE,
    maxX = -Number.MAX_VALUE,
    maxY = -Number.MAX_VALUE;

  rings.flat().forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });

  return new Extent({
    xmin: minX,
    ymin: minY,
    xmax: maxX,
    ymax: maxY,
    spatialReference: { wkid: 4326 }, // Asegúrate de usar el WKID correcto
  });
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
    const [geometryEngine] = await loadModules(["esri/geometry/geometryEngine"]);
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
      // utilsModule?.goToOneExtentAndZoom({ jimuMapView, extent: itemSelected?.value.geometry.extent, duration: 1000 })
      handleIndicadorSelectedContinua({
        _where:`mpcodigo = '${itemSelected?.mpcodigo}'`,
        indiSelected:{...selectIndicadores, municipioSelected:itemSelected?.mpnombre, deparmetSelected:departmentSelect?.denombre},
        target,
        _es_Indicador:'Municipal',
        geometrias:geometriaMunicipios,
        urlIndicadorToGetData:servicios?.urls.indicadores[selectIndicadores?.url],
        fieldValueToSetRangeCoropletico:selectIndicadores?.fieldValueDepartal,
        regionSeleccionada:'Municipal'
        // label_indicador: selectIndicadores?.fieldlabelDepartal,
      })
      const graphicMunicipioSlected = lastLayerDeployed.graphics.find(e => e.attributes.mpcodigo === itemSelected?.mpcodigo)
      utilsModule?.dibujarPoligonoToResaltar(
      {
        rings: graphicMunicipioSlected?.geometry.rings,
        wkid: graphicMunicipioSlected?.geometry.spatialReference.wkid,
        attributes: graphicMunicipioSlected?.attributes,
        jimuMapView,
        times: 3,
        borrar: true
      })
      
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
          // selectSubSistema,
          apuestaEstrategica,
          selectApuestaEstategica,
          // categoriaTematica,
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
        { widgetModules?.INPUTSELECT(dataFuenteIndicadores, handleSubsistemaSelected, apuestaEstrategica?.value, 'Sub Sistema', '') }

        { (apuestaEstrategica && widgetModules) &&
          widgetModules.INPUTSELECT(apuestaEstrategica, handleApuestaEstrategicaSelected, selectApuestaEstategica?.value, 'Línea estratégica', 'APUESTA_ESTRATEGICA')
        }
        { (selectApuestaEstategica && widgetModules && (selectApuestaEstategica.CATEGORIA_TEMATICA.length >= 1 && selectApuestaEstategica.CATEGORIA_TEMATICA[0].label !== '')) &&
          widgetModules.INPUTSELECT(selectApuestaEstategica, handleCategoriaTematicaSelected, selectCategoriaTematica?.value, 'Categoría Temática', 'CATEGORIA_TEMATICA')
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
            // setSelectSubSistema(undefined)
            setApuestaEstrategica(null)
            // setCategoriaTematica(null)
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
  const getGeometriasMunicipios = async ({url, where='1=1'}:{url:String; where:String}) => {
    setIsLoading(true)
    try {
      if (utilsModule?.logger())console.info("Consultando geometrias municipios ...")
      const municipiosResponse = await utilsModule?.queryAttributesLayer({ url: url + '/query', definitionExpression: where, returnGeometry: true, outFields: '*' })
      let resumenMunicipios = {
        features: municipiosResponse.features,
        fields: municipiosResponse.fields,
        geometryType: municipiosResponse.geometryType,
        spatialReference: municipiosResponse.spatialReference
      }
      // const departAjustadosToRender = utilsModule.ajustarDataToRender(dataResponse,'decodigo','denombre')
      if (utilsModule?.logger()) console.log({ municipiosResponse, resumenMunicipios })
      resumenMunicipios.features = [...geometriaMunicipios?geometriaMunicipios.features:'', ...resumenMunicipios.features]
      setGeometriaMunicipios(resumenMunicipios)
      setIsLoading(false)
      return resumenMunicipios
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
        getGeometriasMunicipios({url:servicios?.urls.Municipios})
      }, 2000)
    }

    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jimuMapView])


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
      - ajustar extend para cuando el departamento tiene muchos municipios, por lo menos q se ajuste a un municipio y hacer un zoom alto para q enfoque al departamento
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


type StatisticDefinition = {
  statisticType: string; // Ej: "sum", "avg", "count", etc.
  onStatisticField: string; // Campo sobre el que se aplica la estadística
  outStatisticFieldName: string; // Nombre del campo resultante
};

// El tipo para `outStatistics` puede ser un array de StatisticDefinition o un string
export  type OutStatistics = StatisticDefinition[] | string | undefined;

export interface InterfaceIndiSelected {
  value:                  number;
  label:                  string;
  descripcion:            string;
  url:                    string;
  urlNal:                 string;
  urlDepartal:            string;
  urlNalDataAlfanumerica: string;
  fieldlabel:             string[];
  fieldlabelNal:          string[];
  fieldlabelDepartal:     string[];
  leyenda:                string[];
  leyendaNal:             string[];
  leyendaDepartal:        string[];
  fieldValue:             string;
  fieldValueNal:          string;
  fieldValueDepartal:     string;
  quintiles:              Array<Array<number | string>>;
}

type typeGeometria = {
  attributes: { mpcodigo: string };
  geometry: any; // Considera tipar `geometry` con algo más específico si es posible (ej: `Geometry` de GeoJSON)
};

interface Indicador_respuestaDataProcesada {labels: string[];values: any[];}[]

interface IndicadorSeleccionado {
  fieldlabel: string[];
  fieldlabelNal: string[];
  fieldlabelDepartal: string[];
  url: string;
  urlNal: string;
  urlDepartal: string
  fieldValue: string;
  fieldValueNal: string;
  fieldValueDepartal: string
}

interface Servicios {
  urls: {
    indicadoresNaci: Record<string, string>;
  };
}

interface ResponseQuery {
  // Define la estructura de tu respuesta según lo que esperas
  [key: string]: any;
}

interface interface_DATASET { labels: string[]; datasets: { label: string; data: any[]; backgroundColor: string | undefined; borderColor: string; borderWidth: number; }[] }

interface SpatialReference {
  wkid: number;  // Well-Known ID del sistema de referencia espacial (4326 = WGS84)
}

interface GeographicExtent {
  spatialReference: SpatialReference;
  xmin: number;  // Longitud mínima (oeste)
  ymin: number;  // Latitud mínima (sur)
  xmax: number;  // Longitud máxima (este)
  ymax: number;  // Latitud máxima (norte)
}

interface RGBAColor {
  rgba: string;
  valueRGBA: [number, number, number, number];
}
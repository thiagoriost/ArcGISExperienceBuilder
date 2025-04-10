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
  const [esIndicador_1_7, setEsIndicador_1_7] = useState(false);
  // const [dataTempQueryNal, setDataTempQueryNal] = useState([])
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
  const [respuestas, setRespuestas] = useState(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cancelClickEvent = () => {
    if (clickHandler) {
      clickHandler.remove()
      setClickHandler(null) // Limpiar el estado del manejador del evento
    }
  }

  const handleSubsistemaSelected = ({ target }) => {
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

  const handleIndicadorSelected = async ({ target }) => {    
    setIsLoading(true)
    clearGraphigs() // Elimina las geometrias dibujadas previamente
    setDepartmentSelect(undefined)
    setRangosLeyenda([])
    let indiSelected, isIndicador_1_7, geometrias, __geometriasDepartamental
    indiSelected = indicadores?.find(e => e.value === target.value)
    if (!geometriasDepartamentos) {
      console.log(7777777)
      __geometriasDepartamental = await utilsModule?.realizarConsulta('*', servicios?.urls.Departamentos+'/query', true, '1=1')
      setGeometriasDepartamentos(__geometriasDepartamental);      
    }else{
      __geometriasDepartamental = geometriasDepartamentos
    }
    if (indiSelected.label == '1.7.1 Porcentaje de predios rurales actualizados' ||
      indiSelected.label == '1.7.2 Porcentaje de área de predios rurales actualizados' ||
      indiSelected.label == '1.7.3 Cantidad de municipios actualizados en cada vigencia' ||
      indiSelected.label == '1.7.4 Número de municipios formados en cada vigencia') {
        setEsIndicador_1_7(true)
        isIndicador_1_7 = true
        geometrias = __geometriasDepartamental
    }else{
      setEsIndicador_1_7(false)
      isIndicador_1_7 = false
      geometrias = geometriaMunicipios
    }
    setSelectIndicadores(indiSelected)
    setMunicipios([])
    setTimeout(() => {
      handleIndicadorSelectedContinua({ indiSelected, target, isIndicador_1_7, geometrias })
    }, 5000)
  }
  const handleIndicadorSelectedContinua = async ({ indiSelected, target, isIndicador_1_7, geometrias }) => {
    const { /* FeatureLayer, */ SimpleFillSymbol, Polygon, Graphic, GraphicsLayer } = esriModules    
    let urlIndicadorToGetData = servicios?.urls.indicadoresNaci[indiSelected.urlNal]
    if (isIndicador_1_7) {
        urlIndicadorToGetData = servicios?.urls.indicadoresDepartal[indiSelected.urlDepartal]
    }
    let responseIndicadorNacional
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
      if (utilsModule?.logger()) console.error({ responseIndicadorNacional, urlIndicadorToGetData })
      // setSelectIndicadores(initSelectIndicadores)
      // return
    } else {
      urlIndicadorToGetData = `${urlIndicadorToGetData}/query`
      // const existeQuery = dataTempQueryNal.find(d => (d.id === indiSelected.label && d.url === urlIndicadorToGetData))
      /* if (existeQuery) {
        responseIndicadorNacional = existeQuery.responseIndicadorNacional
        layer = existeQuery.layer
      } else { */
      responseIndicadorNacional = await utilsModule?.realizarConsulta('*', urlIndicadorToGetData, false, '1=1')

      if (!responseIndicadorNacional.features || responseIndicadorNacional?.features.length < 1) {
        if (utilsModule?.logger()) console.error('Sin data en el responseIndicadorNacional => ', { responseIndicadorNacional, urlIndicadorToGetData })
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

      /** Extrae la geometria del servicio municipal q coinciden con el cod_municipio y fuciona los atributos del servicio de datos con la geometria*/
      console.log({geometriaMunicipios})
      responseIndicadorNacional = responseIndicadorNacional.features.map(RIN => {
        let geom = null
        if (isIndicador_1_7) {
          geom = geometrias?.features?.find(GM => GM.attributes.decodigo === RIN.attributes.cod_departamento)
        }else{
          const codMun = RIN.attributes.cod_municipio ? RIN.attributes.cod_municipio : RIN.attributes.mpcodigo
          geom = geometrias?.features?.find(GM => GM.attributes.mpcodigo === codMun)
        }
        return { attributes: { ...RIN.attributes, ...(geom?.attributes ?? {}) }, geometry: geom?.geometry ?? null }
      })        
      
      // layer = new FeatureLayer({ url: `${urlIndicadorToGetData}` })
      // const guardarConsultaIndicadorNacional = { url: urlIndicadorToGetData, responseIndicadorNacional, layer, id: indiSelected.label }
      // setDataTempQueryNal([...dataTempQueryNal, guardarConsultaIndicadorNacional])
      // }

      // Datos para configurar los rangos del coropletico
      const fieldValueToSetRangeCoropletico = isIndicador_1_7 ? indiSelected.fieldValueDepartal : indiSelected.fieldValueNal
      // const {minValue, maxValue, interval} = utilsModule.rangosCoropleticos(responseIndicadorNacional, fieldValueToSetRangeCoropletico)

      // dibujar Municipios en coropletico
      
       
      utilsModule?.dibujarPoligono({
        features: responseIndicadorNacional,
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
      
      
      // const layer = new FeatureLayer({ url:`https://pruebassig.igac.gov.co/server/rest/services/Indicadores_nacionales_municipales/MapServer/0` })

      //consultar data alfanumerica para renderizar grafico a nivel nacional
      // const urlAlfanumericaNal = servicios.urls.indicadoresNaciAlfanumerica[indiSelected.urlNalDataAlfanumerica] ? `${servicios.urls.indicadoresNaciAlfanumerica[indiSelected.urlNalDataAlfanumerica]}/query` : `${servicios.urls.indicadoresNaci[indiSelected.urlNalDataAlfanumerica]}/query`
      // const start = performance.now() // Inicio de medición
      // const urlAlfanumericaNal = `${urlIndicadorToGetData}`
      // const outFields =
      const onStatisticField = indiSelected.fieldValueNal
      // realiza las consultas segun los fieldlabelNal para cada indicador

      // codigo comentariado para evitar quw realice todas las peticiones al tiempo, se cambia por una detras de la otra
      /* const fetchPromises = indiSelected.fieldlabelNal.map(async (field) => {
        const urln = `${urlIndicadorToGetData}?where=1%3D1&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=${field}&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=${field}&outStatistics=%5B%7B%0D%0A++%22statisticType%22%3A+%22sum%22%2C%0D%0A++%22onStatisticField%22%3A+%22${onStatisticField}%22%2C%0D%0A++%22outStatisticFieldName%22%3A+%22suma%22%0D%0A%7D%5D&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson`
        const respon = await fetch(urln)
        const res = await respon.json()
        return res
      })
      const results = await Promise.allSettled(fetchPromises) // info para las grafica estadistica */
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
      const results = groupAndSumData(responseIndicadorNacional, indiSelected.fieldValueNal, indiSelected.fieldlabelNal)
      // const end = performance.now() // Fin de medición
      // console.log({ results })
      setRespuestas({ ...(respuestas || {}), responseIndicadorNacional, results })
      /* const myHeaders = new Headers()
      const response = await fetch(urlStadistic, {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      })
      const _responseConsulta = await response.json() */
      if (utilsModule?.logger()) {
        console.log({
          onStatisticField,
          INDICADOR: target.value,
          indiSelected,
          urlIndicadorToGetData,
          // urlAlfanumericaNal,
          responseIndicadorNacional,
          fieldValueToSetRangeCoropletico,
          // layer,
          // dataTempQueryNal,
          results
        })
        // console.log(`Tiempo transcurrido: ${(end - start).toFixed(2)} ms`) // Muestra el tiempo total
      }
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
      // Desfragmentar el array
      // const featuresUnificados = results.map(element => element.value.features).flat()
      // ajustar result para que sea igual data alfanumerica
      /* const DATASET = []
      indiSelected.fieldlabelNal.forEach((FL, i) => {
        const data = []
        const labels = []
        // eslint-disable-next-line array-callback-return
        const findR = results.find(e => {
          if (!e.value.error) {
            return e.value.fields[0].name === FL
          } else {
            if (utilsModule?.logger()) {
              console.error({ e, results })
            }
          }
        })
        if (findR) {
          findR.value.features.forEach(({ attributes }) => {
            data.push(attributes.suma)
            labels.push(attributes[FL])
          })
          DATASET.push(
            {
              datasets: [{
                backgroundColor: 'rgba(201, 88, 88, 0.5)',
                data,
                label: indiSelected.leyenda[i]
              }],
              labels
            }
          )
        }
      }) */
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
      indiSelected.fieldlabelNal.forEach((fieldlabelNal, i) => {
        const dataset = processField(fieldlabelNal, indiSelected.leyendaNal[i])
        if (dataset) {
          DATASET.push(dataset)
        }
      })

      const dataToRender = JSON.stringify(
        {
          nacional: {
            dataAlfanuemricaNal: DATASET,
            indiSelected,
            responseIndicadorNacional,
            url: urlIndicadorToGetData,
            fieldValueToSetRangeCoropletico
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
    }
  }

/* MFCQ PRUEBA MONICA * */
  const consultarDatosDepartamentales = async () => {
    if (!selectIndicadores.urlDepartal || selectIndicadores.urlDepartal === '') {
        console.warn('No hay URL departamental definida.');
        return [];
    }

    try {
        const response = await fetch(selectIndicadores.urlDepartal);
        const data = await response.json();

        if (data && data.features) {
            respuestas.responseIndicadorDepartamental = data.features;
            return data.features;
        } else {
            console.warn('No se encontraron datos en la URL departamental.');
            return [];
        }
    } catch (error) {
        console.error('Error al obtener datos departamentales:', error);
        return [];
    }
  };

  /**
   * En este metodo se selecciona el departamento al que se va realizar la consulta de indicadores
   * y genera la consulta
   * @param param0
   */
  const handleDepartamentoSelected = async ({ target }) => {
    setIsLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
   // const { FeatureLayer, SimpleFillSymbol, Polygon, Graphic, GraphicsLayer, geometryEngine } = esriModules
    // Cargar módulos de ArcGIS
    const [FeatureLayer, SimpleFillSymbol, Polygon, Graphic, GraphicsLayer, geometryEngine] = await loadModules([
        "esri/layers/FeatureLayer",
        "esri/symbols/SimpleFillSymbol",
        "esri/geometry/Polygon",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/geometry/geometryEngine",
    ]);
    const targetDepartment = target.value
    const itemSelected = departamentos.find(departamento => departamento.value === targetDepartment)
    setDepartmentSelect(itemSelected) // se utiliza para sacar el label en la grafica, widget indicadores

    if (itemSelected.value === '0') return
    /* const urlDepartamental = `${servicios.urls.indicadoresDepartal[selectIndicadores.urlDepartal]}/query`
      const where = `cod_departamento='${itemSelected.decodigo}'`
      const response = await utilsModule?.realizarConsulta('*', urlDepartamental, true, where)
      const _dataCoropletico = response.features
      setResponseIndicadores(response) */
    if (utilsModule?.logger()) console.log({ value: target.value, itemSelected, respuestas, selectIndicadores })

    /* if (!response || response?.features?.length < 1 || response?.error?.code) {
          if (utilsModule?.logger()) console.error('query dont get features to render')
          setMensajeModal({
            deployed: true,
            type: typeMSM.warning,
            tittle: 'Info',
            body: 'Sin información para el departamento seleccionado',
            subBody: ''
          })
          setRangosLeyenda([])
        } else  */
    if (selectIndicadores.urlDepartal === '') {
      console.error('Sin información departamental por el momento', { itemSelected })
      setMensajeModal({
        deployed: true,
        type: typeMSM.warning,
        tittle: '! Ups disculpas¡',
        body: 'Sin información a nivel departamental por el momento, continua explorando por municipio',
        subBody: ''
      })
      setIsLoading(false)
    } else {
      /* Selecciona los responseIndicadores que coinciden con el departamento, para luego filtrar por municipio */
      if (utilsModule?.logger()) console.log({ itemSelected, lastLayerDeployed/* , _dataCoropletico */ })
      /* if (lastLayerDeployed.graphicsLayers) {
            jimuMapView.view.map.remove(lastLayerDeployed)
            setLastLayerDeployed(undefined)
          } */
      // en esta consulta trae solo los municipios del departamento objetivo
      // se direge al metodo ubicado en utils/module.ts
      /*
            const { FeatureLayer, Graphic, GraphicsLayer, SimpleFillSymbol, SimpleMarkerSymbol, SimpleLineSymbol } = esriModules
            await utilsModule.pintarFeatureLayer({
              _dataCoropletico: {},
              definitionExpression: `${constantesTabIndicadores.decodigo}='${targetDepartment}'`,
              doZoom: true,
              fieldValueToSetRangeCoropletico: selectIndicadores.fieldValueDepartal, //para calcular los colores del coropletico
              geometryType: 'polygon',
              getAttributes: false,
              identificadorMixData: constantesTabIndicadores.mpcodigo,
              jimuMapView,
              lastLayerDeployed,
              pintarFeature: true,
              returnGeometry: true,
              url: servicios.urls.Municipios,
              FeatureLayer,
              Graphic,
              GraphicsLayer,
              SimpleFillSymbol,
              SimpleMarkerSymbol,
              SimpleLineSymbol,
              indiSelected: selectIndicadores,
              setClickHandler,
              setLastLayerDeployed,
              setPoligonoSeleccionado,
              setIsLoading,
              setMunicipios,
              setRangosLeyenda
            })
          */

      /* 
        Esta logica es para ajustar el indicador 1.7, el cual no tiene informacion nacional ni municipal
       */
      if (respuestas) {
        const respIndiNal = respuestas.responseIndicadorNacional
        const filterRespIndiNal = respIndiNal.filter(rin => rin.attributes.decodigo === targetDepartment)
        if (filterRespIndiNal.length < 1) {
          setMensajeModal({
            deployed: true,
            type: typeMSM.warning,
            tittle: '! Ups ¡',
            body: `Sin información a nivel departamental para ${itemSelected.denombre} `,
            subBody: ''
          })
          setIsLoading(false)
          return
        }
        // const dataOrdenada = utilsModule.ajustarDataToRender({ features: filterRespIndiNal }, '', 'mpnombre').filter(e => e.dataIndicadores)
        const dataOrdenada = utilsModule.ajustarDataToRender({ features: filterRespIndiNal }, '', 'mpnombre')
        const eliminaRegistrosRepetidos = utilsModule.discriminarRepetidos(dataOrdenada, 'label')
        eliminaRegistrosRepetidos.unshift({ value: 0, label: 'Seleccione ...' })
        setMunicipios(eliminaRegistrosRepetidos)
        // filtra solo los municipios a renderizar agregandolesel total de indicador segun el fieldValueDepartal
        dataOrdenada.map(f => {
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
        setTimeout(async () => {
          clearGraphigs() // Elimina las geometrias dibujadas previamente
          await utilsModule.dibujarPoligono({
            features: eliminaRegistrosRepetidos,
            jimuMapView,
            setPoligonoSeleccionado,
            setClickHandler,
            fieldValueToSetRangeCoropletico: selectIndicadores.fieldValueDepartal,
            setLastLayerDeployed,
            lastLayerDeployed,
            setRangosLeyenda,
            Polygon,
            Graphic,
            GraphicsLayer,
            SimpleFillSymbol,
            indiSelected: selectIndicadores,
            setIsLoading,
            layer: null
          })
          // const filtroSoloFeaturesDelDepartaSeleccionado = dataAlfanuemricaDepartal.features.filter(feature => feature.attributes.cod_departamento === itemSelected.decodigo)
          if (dataOrdenada) {
            // const filtroSoloFeaturesDelDepartaSeleccionado = respIndiNal
            const filtroSoloFeaturesDelDepartaSeleccionado = dataOrdenada
  
            //CAMBIO MFCW
        
            const geometriaDepto = dataOrdenada.map(feature => feature.geometry);
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
                    const extentAjustado = extent.expand(1.05); 
                   // const extentAumentado = geometryEngine.buffer(extent, 5000); // Aleja un poco el zoom en metros
                    jimuMapView.view.goTo(extentAjustado);
                }
            }
          
            // FIN CAMBIO
  
            if (utilsModule?.logger()) console.log({ INDICADOR: target.value, filtroSoloFeaturesDelDepartaSeleccionado, selectIndicadores, itemSelected, lastLayerDeployed })
            // enviar data al widget indicadores para pintar graficos estaditicos a nivel departamental
            const dataToRender = JSON.stringify({ departamental: { filtroSoloFeaturesDelDepartaSeleccionado, itemSelected, response: respIndiNal, selectIndicadores } })
            dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
          }
          setIsLoading(false)
        }, 1000)        
      }else{
        // ajustar para renderizar coropletico departamental
        const urlIndDepart = `${servicios?.urls.indicadoresDepartal[selectIndicadores.urlDepartal]}/query`
        const responseIndicadorDepartnal = await utilsModule?.realizarConsulta('*', urlIndDepart, true, `cod_departamento = '${itemSelected.decodigo}'`)
        console.log({responseIndicadorDepartnal})
        // Datos para configurar los rangos del coropletico
        const fieldValueToSetRangeCoropletico = selectIndicadores.fieldValueDepartal
        // dibujar coropletico departamental
        clearGraphigs() // Elimina las geometrias dibujadas previamente
        setTimeout(() => {
          utilsModule?.dibujarPoligono({
            features: responseIndicadorDepartnal.features,
            // minValue: 0,
            // maxValue: 0,
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
            indiSelected:selectIndicadores,
            layer:null
          })          
        }, 1000);

      }
        
    }
  }
  /**
   * captura el municipio seleccionado en el intput, ajusta extend, resalta el poligono seleccionado
   * @param param0
   */
  const handleMunicipioSelected = async ({ target }) => {
    setIsLoading(true)
    setTimeout(async () => {
      const itemSelected = municipios.find(municipio => municipio.value === target.value)

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
    if (lastLayerDeployed.graphicsLayers.length > 0) utilsModule?.removeLayer(jimuMapView, lastLayerDeployed.graphicsLayers)
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
        { municipios.length > 0 && !esIndicador_1_7 &&
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
    if (utilsModule?.logger()) console.log(municipios)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [municipios])

  /**
   * con este effect limpia el ultimo grafico estadistico selecionado
   */
  useEffect(() => {
    if (utilsModule?.logger()) console.log({ where: 'Effect selectSubSistema', widgetIdIndicadores })
    // if (departmentSelect.value === '0') return
    const dataToWidgetIndicadores = JSON.stringify({ clear: true })
    // dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'poligonoSeleccionado', dataToWidgetIndicadores))
    dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToWidgetIndicadores))
    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectSubSistema, categoriaTematica, selectCategoriaTematica, selectIndicadores, departmentSelect])

  /**
   * al dar un click en uno de los municipios, captura el poligono seleccionado y lo envia al widget indicadores
   * con la data correspondiente para renderizar la grafica de barras estadistica
   */
  useEffect(() => {
    if (!poligonoSeleccionado || !departmentSelect) return
    poligonoSeleccionado.departmentSelect = departmentSelect
    poligonoSeleccionado.selectIndicadores = selectIndicadores
    // const dataToRender = JSON.stringify({poligonoSeleccionado, departmentSelect, selectIndicadores})
    // dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'poligonoSeleccionado', dataToRender))
    const dataToRender = JSON.stringify({ municipal: { poligonoSeleccionado, departmentSelect, selectIndicadores } })
    dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
    let selectedMunic
    if (municipios.length > 0) {
      selectedMunic = municipios.find(e => e.mpcodigo === poligonoSeleccionado.attributes.mpcodigo)
    } else {
      selectedMunic = poligonoSeleccionado.attributes
    }
    setMunicipioSelect(selectedMunic)
    if (utilsModule?.logger()) console.log({ poligonoSeleccionado, selectedMunic, dataToRender })

    utilsModule.dibujarPoligonoToResaltar(
      {
        rings: poligonoSeleccionado.geometry.rings,
        wkid: poligonoSeleccionado.geometry.spatialReference.wkid,
        attributes: poligonoSeleccionado.attributes,
        jimuMapView,
        times: 3,
        borrar: true
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
    console.log(555555)
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

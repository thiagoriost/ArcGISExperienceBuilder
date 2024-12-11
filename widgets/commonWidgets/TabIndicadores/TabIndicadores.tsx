import React, { useEffect, useState } from 'react'
import { Button } from 'jimu-ui'
import { appActions } from 'jimu-core'
import './style.css'
import { dataFuenteIndicadores } from './dataFormularioIndicadores'

const widgetIdIndicadores = 'widget_48' // se genera al ingresar al widget objetivo y generarlo en el effect de inicio con props.id
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

const initLastLayerDeployed = { graphics: [], graphicsLayers: [] }

const TabIndicadores: React.FC<any> = ({ dispatch, departamentos, jimuMapView }) => {
  const [constantes, setConstantes] = useState<InterfaceConstantes>(undefined)
  const [widgetModules, setWidgetModules] = useState(null)
  const [servicios, setServicios] = useState(null)
  const [utilsModule, setUtilsModule] = useState(undefined)
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
  const [geometriaMunicipios, setGeometriaMunicipios] = useState(undefined)
  const [selectSubSistema, setSelectSubSistema] = useState(undefined)
  const [apuestaEstrategica, setApuestaEstrategica] = useState(null)
  const [selectApuestaEstategica, setSelectApuestaEstategica] = useState(undefined)
  const [categoriaTematica, setCategoriaTematica] = useState(null)
  const [selectCategoriaTematica, setSelectCategoriaTematica] = useState(undefined)
  const [indicadores, setIndicadores] = useState(null)
  const [selectIndicadores, setSelectIndicadores] = useState(undefined)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [responseIndicadores, setResponseIndicadores] = useState(undefined)
  const [departmentSelect, setDepartmentSelect] = useState(undefined)
  const [municipios, setMunicipios] = useState([])
  const [municipioSelect, setMunicipioSelect] = useState(undefined)
  const [rangosLeyenda, setRangosLeyenda] = useState([])
  const [esriModules, setEsriModules] = useState(undefined)
  const [dataTempQueryNal, setDataTempQueryNal] = useState([])
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
    if (utilsModule.logger()) console.log(findSubSistema)
    setApuestaEstrategica(findSubSistema)
    setSelectSubSistema(findSubSistema)
    setCategoriaTematica(null)
    setIndicadores(null)
    setMunicipios([])
    setRangosLeyenda([])
  }
  const handleApuestaEstrategicaSelected = ({ target }) => {
    setSelectCategoriaTematica(undefined)
    setSelectIndicadores(undefined)
    setRangosLeyenda([])
    const APUESTA_ESTRATEGICA = apuestaEstrategica.APUESTA_ESTRATEGICA.find(e => e.value === target.value)
    if (utilsModule?.logger()) console.log('APUESTA_ESTRATEGICA', { APUESTA_ESTRATEGICA, value: target.value })
    setSelectApuestaEstategica(APUESTA_ESTRATEGICA)
    setCategoriaTematica(APUESTA_ESTRATEGICA)
    if (APUESTA_ESTRATEGICA.CATEGORIA_TEMATICA.length === 1 && APUESTA_ESTRATEGICA.CATEGORIA_TEMATICA[0].label === '') {
      setIndicadores(APUESTA_ESTRATEGICA.CATEGORIA_TEMATICA[0].INDICADOR)
    } else {
      setIndicadores(null)
    }
    setMunicipios([])
  }
  const handleCategoriaTematicaSelected = ({ target }) => {
    setSelectIndicadores(undefined)
    setRangosLeyenda([])
    const CATEGORIA_TEMATICA = categoriaTematica.CATEGORIA_TEMATICA.find(e => e.value === target.value)
    setIndicadores(CATEGORIA_TEMATICA)
    setSelectCategoriaTematica(CATEGORIA_TEMATICA)
    if (utilsModule.logger()) console.log({ value: target.value, CATEGORIA_TEMATICA })
    setMunicipios([])
    setIsLoading(false)
  }

  const handleIndicadorSelected = ({ target }) => {
    setIsLoading(true)
    clearGraphigs() // Elimina las geometrias dibujadas previamente
    setDepartmentSelect(undefined)
    setRangosLeyenda([])
    let indiSelected
    indicadores.INDICADOR ? indiSelected = indicadores.INDICADOR.find(e => e.value === target.value) : indiSelected = indicadores.find(e => e.value === target.value)
    setSelectIndicadores(indiSelected)
    setMunicipios([])
    setTimeout(() => {
      handleIndicadorSelectedContinua({ indiSelected, target })
    }, 1000)
  }
  const handleIndicadorSelectedContinua = async ({ indiSelected, target }) => {
    const { FeatureLayer, SimpleFillSymbol, Polygon, Graphic, GraphicsLayer } = esriModules

    let urlIndicadorNacionalMunicipal = servicios.urls.indicadoresNaci[indiSelected.urlNal]
    let responseIndicadorNacional
    let layer
    if (!urlIndicadorNacionalMunicipal /* || !servicios.urls.indicadoresNaciAlfanumerica[indiSelected.urlNalDataAlfanumerica] */) {
      setIsLoading(false)
      setMensajeModal({
        deployed: true,
        type: typeMSM.warning,
        tittle: 'Info',
        body: 'El indicador seleccionado no presenta servicio nacional',
        subBody: ''
      })
      if (utilsModule.logger()) console.error({ responseIndicadorNacional, urlIndicadorNacionalMunicipal })
      // setSelectIndicadores(undefined)
      // return
    } else {
      urlIndicadorNacionalMunicipal = `${urlIndicadorNacionalMunicipal}/query`
      const existeQuery = dataTempQueryNal.find(d => (d.id === indiSelected.label && d.url === urlIndicadorNacionalMunicipal))
      if (existeQuery) {
        responseIndicadorNacional = existeQuery.responseIndicadorNacional
        layer = existeQuery.layer
      } else {
        responseIndicadorNacional = await utilsModule.realizarConsulta('*', urlIndicadorNacionalMunicipal, false, '1=1')

        if (!responseIndicadorNacional.features || responseIndicadorNacional?.features.length < 1) {
          if (utilsModule.logger()) console.error('Sin data en el responseIndicadorNacional => ', { responseIndicadorNacional, urlIndicadorNacionalMunicipal })
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
        // obtiene las geometrias para cada feature de las geometrias municipios previamente cargadas
        /*  */
        /* let responseGeometriasMunicipios = { features: [] }

        if (geometriaMunicipios) {
          responseGeometriasMunicipios = geometriaMunicipios
        } else { // si los municipios no fueron cargados al inicio del programa, en este else se intenta recargarlos
          if (utilsModule.logger()) console.error('Problemas con la consulta de geometrías por municipios')
          const munis = discriminarRepetidos(responseIndicadorNacional.features, 'cod_municipio')

          const results = [] // Almacena los resultados de las consultas

          // Usamos un bucle for...of para iterar sobre los endpoints
          for (const { attributes } of munis) {
            try {
            // Espera a que termine la consulta fetch antes de pasar a la siguiente
            // const response = await fetch(endpoint)
              const response = await utilsModule.realizarConsulta('*', servicios.urls.Municipios + '/query', true, `mpcodigo = '${attributes.cod_municipio}'`)

              // Si la respuesta es exitosa, convierte los datos a JSON
              if (response.features.length > 0) {
              // const data = await response.json()
                results.push(response.features[0]) // Almacena los datos en el array results
              // console.log(`Datos obtenidos de ${attributes}:`, {features:response.features})
              } else {
                if (utilsModule.logger()) console.error(`Error en la solicitud a ${attributes}:`, response.status, servicios.urls.Municipios)
              }
            } catch (error) {
            // Captura cualquier error de red o en la solicitud
              console.error(`Error de red en la solicitud a ${attributes}:`, error)
            }
          }

          // Retorna los resultados de todas las consultas
          // return results
          responseGeometriasMunicipios = { features: results }
          setIsLoading(false)
        } */

        /** Extrae la geometria del servicio municipal q coinciden con el cod_municipio y fuciona los atributos del servicio de datos con la geometria*/
        responseIndicadorNacional = responseIndicadorNacional.features.map(RIN => {
          const geome = geometriaMunicipios.features.find(GM => GM.attributes.mpcodigo === RIN.attributes.cod_municipio)
          return { attributes: { ...RIN.attributes, ...geome.attributes }, geometry: geome.geometry }
        })

        layer = new FeatureLayer({ url: `${urlIndicadorNacionalMunicipal}` })
        const guardarConsultaIndicadorNacional = { url: urlIndicadorNacionalMunicipal, responseIndicadorNacional, layer, id: indiSelected.label }
        setDataTempQueryNal([...dataTempQueryNal, guardarConsultaIndicadorNacional])
      }

      // Datos para configurar los rangos del coropletico
      const fieldValueToSetRangeCoropletico = indiSelected.fieldValueNal
      // const {minValue, maxValue, interval} = utilsModule.rangosCoropleticos(responseIndicadorNacional, fieldValueToSetRangeCoropletico)

      // dibujar Municipios en coropletico
      utilsModule.dibujarPoligono({
        features: responseIndicadorNacional,
        minValue: 0,
        maxValue: 0,
        interval: 0,
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
        indiSelected,
        layer
      })
      // const layer = new FeatureLayer({ url:`https://pruebassig.igac.gov.co/server/rest/services/Indicadores_nacionales_municipales/MapServer/0` })

      //consultar data alfanumerica para renderizar grafico a nivel nacional
      // const urlAlfanumericaNal = servicios.urls.indicadoresNaciAlfanumerica[indiSelected.urlNalDataAlfanumerica] ? `${servicios.urls.indicadoresNaciAlfanumerica[indiSelected.urlNalDataAlfanumerica]}/query` : `${servicios.urls.indicadoresNaci[indiSelected.urlNalDataAlfanumerica]}/query`
      // const start = performance.now() // Inicio de medición
      const urlAlfanumericaNal = `${urlIndicadorNacionalMunicipal}/query`
      // const outFields =
      const onStatisticField = indiSelected.fieldValueNal
      const fetchPromises = indiSelected.fieldlabelNal.map(async (field) => {
        const urln = `${urlAlfanumericaNal}?where=1%3D1&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=${field}&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=${field}&outStatistics=%5B%7B%0D%0A++%22statisticType%22%3A+%22sum%22%2C%0D%0A++%22onStatisticField%22%3A+%22${onStatisticField}%22%2C%0D%0A++%22outStatisticFieldName%22%3A+%22suma%22%0D%0A%7D%5D&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson`
        const respon = await fetch(urln)
        const res = await respon.json()
        return res
      })
      // const fetchPromises = urls.map((url) => fetch(url).then((res) => res.json()));
      const results = await Promise.allSettled(fetchPromises) // info para las grafica estadistica
      // const end = performance.now() // Fin de medición
      setRespuestas({ ...respuestas, responseIndicadorNacional, results })
      /* const myHeaders = new Headers()
      const response = await fetch(urlStadistic, {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      })
      const _responseConsulta = await response.json() */
      if (utilsModule.logger()) {
        console.log({
          onStatisticField,
          INDICADOR: target.value,
          indiSelected,
          urlIndicadorNacionalMunicipal,
          urlAlfanumericaNal,
          responseIndicadorNacional,
          fieldValueToSetRangeCoropletico,
          layer,
          dataTempQueryNal,
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
            if (utilsModule.logger()) {
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
          if (!e.value.error) {
            return e.value.fields[0].name === fieldlabelNal
          } else {
            utilsModule.logger() && console.error({ e, results })
            return false
          }
        })

        if (result) {
          const data = result.value.features.map(({ attributes }) => attributes.suma)
          const labels = result.value.features.map(({ attributes }) => attributes[fieldlabelNal])

          return {
            datasets: [
              {
                backgroundColor: utilsModule.getRandomRGBA(),
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
            url: urlIndicadorNacionalMunicipal,
            fieldValueToSetRangeCoropletico
          }
        }
      )
      dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
      //  'https://pruebassig.igac.gov.co/server/rest/services/Indicadores_nacionales_municipales/MapServer/3/query'
      /* const dataAlfanuemricaNal = await utilsModule.realizarConsulta('*', urlAlfanumericaNal, false, '1=1')
      // enviar data al widget indicadores para pintar graficos estaditicos a nivel nacional
      // con lo siguiente se envia la data al widget indicadores para renderizar la grafica de barras
      */
    }
  }
  /**
   * En este metodo se selecciona el departamento al que se va realizar la consulta de indicadores
   * y genera la consulta
   * @param param0
   */
  const handleDepartamentoSelected = async ({ target }) => {
    setIsLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { FeatureLayer, SimpleFillSymbol, Polygon, Graphic, GraphicsLayer } = esriModules
    const targetDepartment = target.value
    const itemSelected = departamentos.find(departamento => departamento.value === targetDepartment)
    setDepartmentSelect(itemSelected) // se utiliza para sacar el label en la grafica, widget indicadores

    if (itemSelected.value === '0') return
    /* const urlDepartamental = `${servicios.urls.indicadoresDepartal[selectIndicadores.urlDepartal]}/query`
      const where = `cod_departamento='${itemSelected.decodigo}'`
      const response = await utilsModule.realizarConsulta('*', urlDepartamental, true, where)
      const _dataCoropletico = response.features
      setResponseIndicadores(response) */
    if (utilsModule.logger()) console.log({ value: target.value, itemSelected, respuestas, selectIndicadores })

    /* if (!response || response?.features?.length < 1 || response?.error?.code) {
          if (utilsModule.logger()) console.error('query dont get features to render')
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
      if (utilsModule.logger()) console.log({ itemSelected, lastLayerDeployed/* , _dataCoropletico */ })
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
      setTimeout(async () => {
        clearGraphigs() // Elimina las geometrias dibujadas previamente
        await utilsModule.dibujarPoligono({
          features: dataOrdenada,
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

          if (utilsModule.logger()) console.log({ INDICADOR: target.value, filtroSoloFeaturesDelDepartaSeleccionado, selectIndicadores, itemSelected, lastLayerDeployed })
          // enviar data al widget indicadores para pintar graficos estaditicos a nivel departamental
          const dataToRender = JSON.stringify({ departamental: { filtroSoloFeaturesDelDepartaSeleccionado, itemSelected, response: respIndiNal, selectIndicadores } })
          dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
        }
        setIsLoading(false)
      }, 1000)
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
      if (itemSelected.value === '0') return
      if (utilsModule.logger()) console.log({ municipios: itemSelected })
      utilsModule.goToOneExtentAndZoom({ jimuMapView, extent: itemSelected.value.geometry.extent, duration: 1000 })
      const graphicMunicipioSlected = lastLayerDeployed.graphics.find(e => e.attributes.mpcodigo === itemSelected.mpcodigo)
      // setPoligonoSeleccionado(graphicMunicipioSlected)
      const urlservicioMunicipal = `${servicios.urls.indicadores[selectIndicadores.url]}/query`
      const responseUrlservicioMunicipal = await utilsModule.realizarConsulta('*', urlservicioMunicipal, false, `cod_municipio = '${itemSelected.mpcodigo}'`)
      utilsModule.dibujarPoligonoToResaltar(
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
        geometry: itemSelected.value.geometry, symbol: {}, attributes: responseUrlservicioMunicipal.features, popupTemplate: {}
      }
      if (selectIndicadores.url !== '') {
        const dataToRender = JSON.stringify({ municipal: { poligonoSeleccionado: tempPoligonoSeleccionado, departmentSelect, selectIndicadores } })
        dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
      } else {
        setMensajeModal({
          deployed: true,
          type: typeMSM.warning,
          tittle: 'Info',
          body: `Sin información estadistica para ${itemSelected.mpnombre}`,
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
    if (utilsModule.logger()) console.log('clearGraphigs')
    // if (lastLayerDeployed.length > 0) utilsModule.removeLayer(jimuMapView, lastLayerDeployed)
    if (lastLayerDeployed.graphicsLayers.length > 0) utilsModule.removeLayer(jimuMapView, lastLayerDeployed.graphicsLayers)
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
          esriModules,
          dataTempQueryNal
        }
      )
      setIsLoading(false)
    }
  }

  const formularioIndicadores = () => {
    return (
      <>
        { widgetModules?.INPUTSELECT(dataFuenteIndicadores, handleSubsistemaSelected, selectSubSistema?.value, 'Sub Sistema') }

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
        { municipios.length > 0 &&
          widgetModules.INPUTSELECT(municipios, handleMunicipioSelected, municipioSelect?.value, 'Municipio', '')
        }
        <Button
          size='sm'
          type='default'
          onClick={ () => {
            setSelectSubSistema(undefined)
            setApuestaEstrategica(undefined)
            setCategoriaTematica(undefined)
            setDepartmentSelect(undefined)
            setSelectIndicadores(undefined)
            setIndicadores(undefined)
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
                        <span style={{ backgroundColor: item.colorRgb }}></span> {`${rangosLeyenda[index][0]}     -     ${rangosLeyenda[index][1]}`}
                  </li>
              ))}
            </ul>
            <p>Quintiles</p>
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
      if (utilsModule.logger()) console.log({ municipiosResponse, resumenMunicipios })
      setGeometriaMunicipios(resumenMunicipios)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error({ error, url })
    }
  }

  const cargarModulosEsri = async () => {
    const modulosEsri = await utilsModule.loadEsriModules()
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
    if (utilsModule.logger()) console.log({ poligonoSeleccionado, selectedMunic, dataToRender })

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
    import('../widgetsModule').then(modulo => { setWidgetModules(modulo) })
    import('../../utils/module').then(modulo => { setUtilsModule(modulo) })
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

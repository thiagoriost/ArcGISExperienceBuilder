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
  const [responseIndicadores, setResponseIndicadores] = useState(undefined)
  const [departmentSelect, setDepartmentSelect] = useState(undefined)
  const [municipios, setMunicipios] = useState([])
  const [municipioSelect, setMunicipioSelect] = useState(undefined)
  const [rangosLeyenda, setRangosLeyenda] = useState([])
  const [esriModules, setEsriModules] = useState(undefined)
  const [dataTempQueryNal, setDataTempQueryNal] = useState([])

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
        body: 'El indicador seleccionado no presenta servicio',
        subBody: ''
      })
      setSelectIndicadores(undefined)
      if (utilsModule.logger()) console.error({ responseIndicadorNacional, urlIndicadorNacionalMunicipal })
      return
    }
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
      const discriminarRepetidos = (data, campo) => {
        const filteredData = []
        const codMunicipiosSet = new Set()
        data.forEach(item => {
          const valueKey = item.attributes[campo]

          // Si el valueKey no está en el set, agregarlo al set y a filteredData
          if (!codMunicipiosSet.has(valueKey)) {
            codMunicipiosSet.add(valueKey)
            filteredData.push(item)
          }
        })

        if (utilsModule.logger()) console.log({ data, filteredData })
        return filteredData
      }
      let responseGeometriasMunicipios = { features: [] }

      if (geometriaMunicipios) {
        responseGeometriasMunicipios = geometriaMunicipios
      } else {
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
      }

      /** Extrae la geometria q coinciden con el cod_municipio y fuciona los atributos del servicio de datos con la geometria*/
      responseIndicadorNacional = responseIndicadorNacional.features.map(RIN => {
        const geome = responseGeometriasMunicipios.features.find(GM => GM.attributes.mpcodigo === RIN.attributes.cod_municipio ? RIN.attributes.cod_municipio : RIN.attributes.mpcodigo)
        return { attributes: { ...RIN.attributes, ...geome.attributes }, geometry: geome.geometry }
      })

      layer = new FeatureLayer({ url: `${servicios.urls.indicadoresNaci[indiSelected.urlNal]}` })
      const guardarConsultaIndicadorNacional = { url: urlIndicadorNacionalMunicipal, responseIndicadorNacional, layer, id: indiSelected.label }
      setDataTempQueryNal([...dataTempQueryNal, guardarConsultaIndicadorNacional])
    }

    // Datos para configurar los rangos del coropletico
    const fieldValueToSetRangeCoropletico = indiSelected.fieldValue
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
      indiSelected
    })
    // const layer = new FeatureLayer({ url:`https://pruebassig.igac.gov.co/server/rest/services/Indicadores_nacionales_municipales/MapServer/0` })
    await layer.load()
    // layer.when()
    /* setTimeout(() => {
      jimuMapView.view.goTo(layer.fullExtent)
      setIsLoading(false)
    }, 500) */
    //consultar data alfanumerica para renderizar grafico a nivel nacional

    const urlAlfanumericaNal = servicios.urls.indicadoresNaciAlfanumerica[indiSelected.urlNalDataAlfanumerica] ? `${servicios.urls.indicadoresNaciAlfanumerica[indiSelected.urlNalDataAlfanumerica]}/query` : `${servicios.urls.indicadoresNaci[indiSelected.urlNalDataAlfanumerica]}/query`
    const dataAlfanuemricaNal = await utilsModule.realizarConsulta('*', urlAlfanumericaNal, false, '1=1')
    if (utilsModule.logger()) {
      console.log({
        INDICADOR: target.value,
        indiSelected,
        urlIndicadorNacionalMunicipal,
        urlAlfanumericaNal,
        responseIndicadorNacional,
        fieldValueToSetRangeCoropletico,
        layer,
        dataTempQueryNal,
        dataAlfanuemricaNal
      })
    }
    // enviar data al widget indicadores para pintar graficos estaditicos a nivel nacional
    if (!dataAlfanuemricaNal) {
      setIsLoading(false)
      setMensajeModal({
      // console.log({
        deployed: true,
        type: typeMSM.warning,
        tittle: 'Info',
        body: 'Sin Data alfanumerica nacional para este indicador, continuar para ver data por municipio',
        subBody: ''
      })
      return
    }
    // con lo siguiente se envia la data al widget indicadores para renderizar la grafica de barras
    const dataToRender = JSON.stringify({ nacional: { dataAlfanuemricaNal, indiSelected, responseIndicadorNacional, url: urlIndicadorNacionalMunicipal, fieldValueToSetRangeCoropletico } })
    dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  }
  /**
   * En este metodo se selecciona el departamento al que se va realizar la consulta de indicadores
   * y genera la consulta
   * @param param0
   */
  const handleDepartamentoSelected = async ({ target }) => {
    const targetDepartment = target.value
    const itemSelected = departamentos.find(departamento => departamento.value === targetDepartment)
    setDepartmentSelect(itemSelected) // se utiliza para sacar el label en la grafica, widget indicadores
    if (itemSelected.value === '0') return
    setIsLoading(true)
    const response = await utilsModule.realizarConsulta('*', `${servicios.urls.indicadores[selectIndicadores.url]}/query`, false, `cod_departamento='${itemSelected.decodigo}'`)
    setResponseIndicadores(response)
    if (utilsModule.logger()) console.log({ value: target.value, itemSelected, response, selectIndicadores })
    if (!response || response?.features?.length < 1 || response?.error?.code) {
      if (utilsModule.logger()) console.error('query dont get features to render')
      setMensajeModal({
        deployed: true,
        type: typeMSM.warning,
        tittle: 'Info',
        body: 'Sin información para el departamento seleccionado',
        subBody: ''
      })
      setRangosLeyenda([])
    } else {
      clearGraphigs() // Elimina las geometrias dibujadas previamente
      /* Selecciona los responseIndicadores que coinciden con el departamento, para luego filtrar por municipio */
      const _dataCoropletico = response.features
      if (utilsModule.logger()) console.log({ itemSelected, lastLayerDeployed, _dataCoropletico })
      /* if (lastLayerDeployed.graphicsLayers) {
        jimuMapView.view.map.remove(lastLayerDeployed)
        setLastLayerDeployed(undefined)
      } */
      // en esta consulta trae solo los municipios del departamento objetivo
      // se direge al metodo ubicado en utils/module.ts
      const { FeatureLayer, Graphic, GraphicsLayer, SimpleFillSymbol, SimpleMarkerSymbol, SimpleLineSymbol } = esriModules
      await utilsModule.pintarFeatureLayer({
        _dataCoropletico,
        definitionExpression: `${constantesTabIndicadores.decodigo}='${targetDepartment}'`,
        doZoom: true,
        fieldValueToSetRangeCoropletico: selectIndicadores.fieldValue, //para calcular los colores del coropletico
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
    }
    // consultar y ajustar data para renderizar grafico estadistico
    if (selectIndicadores.urlDepartal === '') {
      console.error('Sin información departamental por el momento', { itemSelected, response })
      setMensajeModal({
        deployed: true,
        type: typeMSM.warning,
        tittle: '! Ups disculpas¡',
        body: 'Sin información a nivel departamental por el momento, continua explorando por municipio',
        subBody: ''
      })
      return
    }
    const urlAlfanumericaDepartal = `${servicios.urls.indicadoresDepartal[selectIndicadores.urlDepartal]}/query`
    const dataAlfanuemricaDepartal = await utilsModule.realizarConsulta('*', urlAlfanumericaDepartal, false, `cod_departamento = '${itemSelected.decodigo}'`)
    // const filtroSoloFeaturesDelDepartaSeleccionado = dataAlfanuemricaDepartal.features.filter(feature => feature.attributes.cod_departamento === itemSelected.decodigo)
    if (dataAlfanuemricaDepartal.features) {
      const filtroSoloFeaturesDelDepartaSeleccionado = dataAlfanuemricaDepartal.features
      if (dataAlfanuemricaDepartal.features.length < 1) {
        setIsLoading(false)
        return
      }
      if (utilsModule.logger()) console.log({ INDICADOR: target.value, filtroSoloFeaturesDelDepartaSeleccionado, selectIndicadores, itemSelected, lastLayerDeployed, urlAlfanumericaDepartal })
      // enviar data al widget indicadores para pintar graficos estaditicos a nivel departamental
      const dataToRender = JSON.stringify({ departamental: { filtroSoloFeaturesDelDepartaSeleccionado, itemSelected, response, selectIndicadores } })
      dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
    } else {
      console.error({ dataAlfanuemricaDepartal, urlAlfanumericaDepartal })
      setMensajeModal({
        deployed: true,
        type: typeMSM.warning,
        tittle: 'Info',
        body: 'Se estan presentando problemas con los servicios, favor intentado mas tarde o ponte en contacto con soporte técnico',
        subBody: ''
      })
    }
    setIsLoading(false)
  }
  /**
   * captura el municipio seleccionado en el intput, ajusta extend, resalta el polgono seleccionado
   * @param param0
   */
  const handleMunicipioSelected = ({ target }) => {
    const itemSelected = municipios.find(municipio => municipio.value === target.value)
    setMunicipioSelect(itemSelected)
    if (itemSelected.value === '0') return
    if (utilsModule.logger()) console.log({ municipios: itemSelected })
    utilsModule.goToOneExtentAndZoom({ jimuMapView, extent: itemSelected.value.geometry.extent, duration: 1000 })
    const graphicMunicipioSlected = lastLayerDeployed.graphics.find(e => e.attributes.mpcodigo === itemSelected.mpcodigo)
    // setPoligonoSeleccionado(graphicMunicipioSlected)
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
      geometry: itemSelected.value.geometry, symbol: {}, attributes: itemSelected, popupTemplate: {}
    }
    const dataToRender = JSON.stringify({ municipal: { poligonoSeleccionado: tempPoligonoSeleccionado, departmentSelect, selectIndicadores } })
    dispatch(appActions.widgetStatePropChange(widgetIdIndicadores, 'dataFromDispatch', dataToRender))
  }

  // Elimina las geometrias dibujadas previamente
  const clearGraphigs = () => {
    if (utilsModule.logger()) console.log('clearGraphigs')
    // if (lastLayerDeployed.length > 0) utilsModule.removeLayer(jimuMapView, lastLayerDeployed)
    if (lastLayerDeployed.graphicsLayers.length > 0) utilsModule.removeLayer(jimuMapView, lastLayerDeployed.graphicsLayers)
    setTimeout(() => {
      // setLastLayerDeployed(initLastLayerDeployed)
    }, 2000)
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

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis' // The map object can be accessed using the JimuMapViewComponent


const simple = props => {

  const [utilsModule, setUtilsModule] = useState(null)
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>()
  const [initialExtent, setInitialExtent] = useState(null)

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (utilsModule?.logger()) console.log('Ingresando al evento objeto JimuMapView...')
    if (jmv) {
      setJimuMapView(jmv)
      setInitialExtent(jmv.view.extent) // Guarda el extent inicial
    }
  }

  useEffect(() => {
      // setResponseConsulta(dataPruebaResponse)
      import('../../../utils/module').then(modulo => { setUtilsModule(modulo) })
      return () => {
        // Acción a realizar cuando el widget se cierra.
        if (utilsModule?.logger()) console.log('El widget se cerrará')
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <div className='w-100 p-3 bg-primary'>
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}

      <h1>Widget Simple</h1>
    </div>
  )
}

simple.propTypes = {}

export default simple
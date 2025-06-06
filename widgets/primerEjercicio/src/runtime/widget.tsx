import { React, type AllWidgetProps } from 'jimu-core'
import { type IMConfig } from '../config'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis' // The map object can be accessed using the JimuMapViewComponent
import { useEffect, useState } from 'react'


const Widget = (props: AllWidgetProps<IMConfig>) => {

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
    <div className="w-100 p-3 bg-primary text-white">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}
      <p>Simple Widget</p>
      <p>exampleConfigProperty: {props.config.exampleConfigProperty}</p>
    </div>
  )
}

export default Widget

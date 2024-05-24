import { React, type AllWidgetProps } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'
import Point from "esri/geometry/Point";

const { useState } = React

const Widget = (props: AllWidgetProps<any>) => {

  const [latitude, setLatitude] = useState<string>('')
  const [longitude, setLongitude] = useState<string>('')

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      // When the pointer moves, take the pointer location and create a Point
      // Geometry out of it (`view.toMap(...)`), then update the state.
      jmv.view.on("pointer-move", (evt) => {
        const point: Point = jmv.view.toMap({
          x: evt.x,
          y: evt.y
        });
        setLatitude(point.latitude.toFixed(3));
        setLongitude(point.longitude.toFixed(3));
      });
    }
  };

  return (
    <div  className="w-100 p-3 bg-primary text-white">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}
      <p> Lat/Lon: {latitude} {longitude} </p>
    </div>
  );
}

export default Widget


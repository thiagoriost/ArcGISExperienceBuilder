import { React, AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
const { useState } = React

const Widget = (props: AllWidgetProps<any>) => {
  
    
    const activeViewChangeHandler = (jmv: JimuMapView) => {
      if (jmv) {
        
      }
    };
    
    return (
      <div  className="w-100 p-3 bg-primary text-white">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
        )}
        
      </div>
    );
  };
  
  export default Widget;
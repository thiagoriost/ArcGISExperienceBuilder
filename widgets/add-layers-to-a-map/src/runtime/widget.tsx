import { React, AllWidgetProps } from "jimu-core";
import { StarFilled } from 'jimu-icons/filled/application/star'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { Button, Icon } from 'jimu-ui'; // import components
import FeatureLayer from "esri/layers/FeatureLayer";

const { useState } = React
const iconNode = <StarFilled />;

const Widget = (props: AllWidgetProps<any>) => {
  
    const [jimuMapView, setJimuMapView] = useState<JimuMapView>(); //To add the layer to the Map, a reference to the Map must be saved into the component state.
    
    const activeViewChangeHandler = (jmv: JimuMapView) => {
      if (jmv) {
        setJimuMapView(jmv);
      }
    };

    const formSubmit = (evt: { preventDefault: () => void; }) => {
      evt.preventDefault();
      // More here soon
      // create a new FeatureLayer
      const layer = new FeatureLayer({
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0"
      });

      // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
      jimuMapView.view.map.add(layer);
    };
    
    return (
      <div  className="w-100 p-3 bg-primary text-white">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
        )}

        <form onSubmit={formSubmit}>
          <div>
            {/* <button>Add Layer</button> */}
            <Button type="primary">{iconNode} Add Layer</Button>
          </div>
        </form>

      </div>
    );
  };
  
  export default Widget;
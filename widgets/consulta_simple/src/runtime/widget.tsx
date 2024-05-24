import { React, AllWidgetProps } from "jimu-core";
import { StarFilled } from 'jimu-icons/filled/application/star'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { Button, Icon, Label, Option, Select } from 'jimu-ui'; // import components
import FeatureLayer from "esri/layers/FeatureLayer";

import './style.css';

const { useState } = React
const iconNode = <StarFilled />;

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


        <div className="mb-1">
          <Label size="default"> Capa </Label>
          <Select
              onChange={function noRefCheck(){}}
              placeholder="Seleccione una capa;"
            >
              <Option value="0">
                Capa_1
              </Option>
              <Option value="1">
                Capa_2
              </Option>
              <Option value="2">
                Capa_3
              </Option>
              {/* <Option header>
                Domestic
              </Option>
              <Option value="1">
                <div className="text-truncate">
                  This is a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long label
                </div>
              </Option>
              <Option value="2">
                Shanghai
              </Option>
              <Option divider />
              <Option header>
                International
              </Option>
              <Option value="3">
                Redlands
              </Option>
              <Option value="4">
                Los Angeles
              </Option> */}
          </Select>
        </div>
        <div className="mb-1">
          <Label size="default"> Atributo </Label>
          <Select
            onChange={function noRefCheck(){}}
            placeholder="Seleccione un atributo:"
          >
          </Select>
        </div>
        <div className="mb-1">
          <Label size="default"> Valor </Label>
          <Select
            onChange={function noRefCheck(){}}
            placeholder="Seleccione un valor:"
          >
          </Select>
        </div>

        <div className="btns">
          <Button
            htmlType="button"
            onClick={function noRefCheck(){}}
            size="default"
            type="default"
          >
            Consultar
          </Button>
          <Button
            htmlType="button"
            onClick={function noRefCheck(){}}
            size="default"
            type="default"
          >
            Limpiar
          </Button>
        </div>
        

       

      </div>
    );
  };
  
  export default Widget;
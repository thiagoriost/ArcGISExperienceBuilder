import { React, AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import { loadModules } from 'esri-loader';
import { useEffect, useState } from "react";

const poli_1 = [[610184,1047372],[610167,1047386],[610150,1047395],[610133,1047407],[610115,1047415],[610109,1047422],[610097,1047403],[610086,1047387],[610082,1047376],[610096,1047366],[610112,1047353],[610124,1047346],[610142,1047356],[610160,1047364],[610177,1047372],[610184,1047372]];
const poli_2 = [[610124,1047346],[610112,1047331],[610099,1047314],[610088,1047299],[610077,1047284],[610073,1047279],[610059,1047291],[610061,1047314],[610040,1047328],[610036,1047339],[610044,1047350],[610059,1047358],[610077,1047373],[610082,1047376],[610096,1047366],[610112,1047353],[610124,1047346]]
const poli_3 = [[610080,1047379],[610060,1047385],[610046,1047394],[610026,1047399],[610009,1047405],[609994,1047407],[609977,1047394],[609989,1047379],[610004,1047366],[610019,1047350],[610031,1047339],[610044,1047350],[610059,1047358],[610077,1047373],[610080,1047379]]
const poli_4 = [[610010,1047419],[610030,1047425],[610048,1047423],[610068,1047426],[610087,1047424],[610107,1047420],[610105,1047418],[610097,1047403],[610086,1047387],[610082,1047376],[610031,1047339],[610019,1047350],[610004,1047366],[609989,1047379]]
const PolygonDrawingWidget  = (props: AllWidgetProps<any>) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [initialExtent, setInitialExtent] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [north, setNorth] = useState('');
  const [east, setEast] = useState('');

  
    
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
      setInitialExtent(jmv.view.extent); // Guarda el extent inicial
    }
  };

  // Add coordinate to the list
  const addCoordinate = () => {
    console.log(parseFloat(east), parseFloat(north))
    setCoordinates([...coordinates, [parseFloat(east), parseFloat(north)]]);
    setNorth('');
    setEast('');
  };

  // Draw polygon on the map
  const drawPolygon = async (coordenadas) => {
  console.log(coordenadas)
    if (!jimuMapView || coordenadas.length < 3) return; // Need at least 3 points to form a polygon
    const [Polygon, Graphic, GraphicsLayer] = await loadModules(['esri/geometry/Polygon', 'esri/Graphic', 'esri/layers/GraphicsLayer']);

    // Close the polygon by adding the first point as the last point
    console.log({coordenadas})
    // const closedCoordinates = [...coordinates, coordinates[0]];
    // console.log({closedCoordinates})
    console.log(JSON.stringify(coordenadas))
    const polygon = new Polygon({
      rings: [coordenadas],
      // rings: [closedCoordinates],
      spatialReference: jimuMapView.view.spatialReference
    });

    const graphic = new Graphic({
      geometry: polygon,
      symbol: {
        type: 'simple-fill',
        color: [51, 51, 204, 0.5],
        outline: {
          color: 'white',
          width: 1
        }
      }
    });

    const graphicsLayer = new GraphicsLayer();
    graphicsLayer.add(graphic);
    jimuMapView.view.map.add(graphicsLayer);
    jimuMapView.view.goTo(graphic.geometry.extent.expand(1.5));
    setCoordinates([]);
  };

  useEffect(() => {
    console.log("starting widget")
    // setCoordinates(poli_1);
    automaticDrawPolygon()
    return () => {}
  }, [])
  
    
  const automaticDrawPolygon = (): void => {
    setTimeout(() => {      
      drawPolygon(poli_1)
      setTimeout(() => {      
        drawPolygon(poli_2)
        setTimeout(() => {      
          drawPolygon(poli_3)
          setTimeout(() => {      
            drawPolygon(poli_4)
          }, 1000);
        }, 1000);
      }, 1000);
    }, 2000);
  }

    return (
      <div  className="w-100 p-3 bg-primary text-white">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
        )}
        
        <div>
          <h3>Polygon Drawing Tool</h3>
          <div>
            <label>
              North:
              <input type="text" value={north} onChange={e => setNorth(e.target.value)} />
            </label>
            <label>
              East:
              <input type="text" value={east} onChange={e => setEast(e.target.value)} />
            </label>
            <button onClick={addCoordinate}>Add Coordinate</button>
          </div>
          <div>
            <button onClick={()=>drawPolygon(coordinates)}>Draw Polygon</button>
          </div>
          <div>
            <button onClick={automaticDrawPolygon}>Automatic Draw Polygon</button>
          </div>
          
        </div>
      </div>
    );
  };
  
  export default PolygonDrawingWidget;
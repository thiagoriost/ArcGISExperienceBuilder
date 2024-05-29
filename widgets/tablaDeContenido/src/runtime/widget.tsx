import { React, AllWidgetProps } from "jimu-core";
import { useState, useEffect } from "react";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import './style.css';
import { CapasTematicas, ItemResponseTablaContenido, TablaDeContenidoInterface, datosBasicosInterface, interfCapa, interfaceCapasNietos } from "../types/interfaces";
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';


const Widget = (props: AllWidgetProps<any>) => {
  const [varJimuMapView, setJimuMapView] = useState<JimuMapView>(); // To add the layer to the Map, a reference to the Map must be saved into the component state.
  const [checkedItems, setCheckedItems] = useState({});
  const [groupedLayers, setGroupedLayers] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});




  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };
  const agregarTematicaNietaNueva = (capasNietos, ItemResponseTablaContenido: ItemResponseTablaContenido, datosBasicos:datosBasicosInterface) => {

    //Define una nueva capa basada en ItemResponseTablaContenido.
    const nuevaCapa = {
      IDCAPA: ItemResponseTablaContenido.IDCAPA,
      IDTEMATICA: ItemResponseTablaContenido.IDTEMATICA,
    };

    //Define una nueva temática nieta basada en datosBasicos y agrega capasBisnietos.
    const nuevaTematicaNieta = {
      ...datosBasicos,
      capasBisnietos: ItemResponseTablaContenido.URL ? [ItemResponseTablaContenido] : ['']
    };

    return {
      capas: [...capasNietos.capas, nuevaCapa],
      tematicasNietas: [...capasNietos.tematicasNietas, nuevaTematicaNieta]
    };
  }

  const validaSiExisteCApaNieto = (capasNietos: interfaceCapasNietos, ItemResponseTablaContenido:ItemResponseTablaContenido) => {
    return !capasNietos.capas.some(capaNieta =>
      capaNieta.IDCAPA === ItemResponseTablaContenido.IDCAPA &&
      capaNieta.IDTEMATICA === ItemResponseTablaContenido.IDTEMATICA
    );
  }

  const ordenarDataTablaContenido = (responseTablaDeContenido: any[] | TablaDeContenidoInterface) => {
    const tematicas:CapasTematicas[] = [];
    let capasNietos: interfaceCapasNietos = { capas: [], tematicasNietas: [] };

    const addTematica = (tematicas:CapasTematicas[], datosBasicos: datosBasicosInterface, itemResponseTablaContenido: ItemResponseTablaContenido) => {
      if (!itemResponseTablaContenido.URL) {
        tematicas.push({ ...datosBasicos, capasHijas: [] });
      } else {
        tematicas.push({
          ...datosBasicos,
          capasHijas: [{ ...datosBasicos, capasNietas: itemResponseTablaContenido.NOMBRECAPA ? [itemResponseTablaContenido] : [] }],
        });
      }
    };

    responseTablaDeContenido.forEach((itemResponseTablaContenido: ItemResponseTablaContenido) => {
      const datosBasicos:datosBasicosInterface = {
        IDTEMATICAPADRE: itemResponseTablaContenido.IDTEMATICAPADRE,
        IDTEMATICA: itemResponseTablaContenido.IDTEMATICA,
        NOMBRETEMATICA: itemResponseTablaContenido.NOMBRETEMATICA,
        TITULOCAPA: itemResponseTablaContenido.TITULOCAPA,
      };

      if (itemResponseTablaContenido.IDTEMATICAPADRE === 0 && itemResponseTablaContenido.NOMBRETEMATICA) {
        const tematicaExistente = tematicas.find(t => t.IDTEMATICA === itemResponseTablaContenido.IDTEMATICA);
        if (!tematicaExistente) {
          addTematica(tematicas, datosBasicos, itemResponseTablaContenido);
        } else if (itemResponseTablaContenido.NOMBRECAPA) {
          tematicaExistente.capasHijas.push({ ...datosBasicos, capasNietas: [itemResponseTablaContenido] });
        }
      }
    });

    responseTablaDeContenido.forEach((itemResponseTablaContenido: ItemResponseTablaContenido) => {
      const datosBasicos:datosBasicosInterface = {
        IDTEMATICAPADRE: itemResponseTablaContenido.IDTEMATICAPADRE,
        IDTEMATICA: itemResponseTablaContenido.IDTEMATICA,
        NOMBRETEMATICA: itemResponseTablaContenido.NOMBRETEMATICA,
        TITULOCAPA: itemResponseTablaContenido.TITULOCAPA,
      };

      if (itemResponseTablaContenido.IDTEMATICAPADRE > 1) {
        const tematicaPadre = tematicas.find(tematica => tematica.IDTEMATICA === itemResponseTablaContenido.IDTEMATICAPADRE);
        if (tematicaPadre) {
          let capaHija = tematicaPadre.capasHijas.find((capaHija: { IDTEMATICA: number; }) => capaHija.IDTEMATICA === itemResponseTablaContenido.IDTEMATICA);
          if (!capaHija) {
            tematicaPadre.capasHijas.push({ ...datosBasicos, capasNietas: itemResponseTablaContenido.URL ? [itemResponseTablaContenido] : [] });
          } else {
            capaHija.capasNietas.push(itemResponseTablaContenido);
          }
        } else if (validaSiExisteCApaNieto(capasNietos, itemResponseTablaContenido)) {
          const tematicaNieta = capasNietos.tematicasNietas.find(tn => tn.IDTEMATICA === itemResponseTablaContenido.IDTEMATICA);
          if (tematicaNieta) {
            tematicaNieta.capasBisnietos.push(itemResponseTablaContenido);
          } else {
            capasNietos = agregarTematicaNietaNueva(capasNietos, itemResponseTablaContenido, datosBasicos);
          }
        }
      }
    });

    capasNietos.tematicasNietas.forEach(itemCapaNieta => {
      tematicas.forEach(itemTematica => {
        itemTematica.capasHijas.forEach(capaHija => {
          if (itemCapaNieta.IDTEMATICAPADRE === capaHija.IDTEMATICA) {
            capaHija.capasNietas.push(itemCapaNieta);
          }
        });
      });
    });

    console.log({ tematicas });
    setGroupedLayers(tematicas);
  }


  const fetchLayers = async () => {
    const url = 'https://sigquindio.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseTablaDeContenido: TablaDeContenidoInterface[] = await response.json();
      ordenarDataTablaContenido(responseTablaDeContenido);
    } catch (error) {
      console.error('Error fetching layers:', error);
    }
  };

  const Node = ({ node, level = 0 }) => {
    const isExpanded = expandedItems[node.IDTEMATICA];
    const hasChildren = (node.capasHijas?.length >= 1) || (node.capasNietas?.length > 0 && node.IDTEMATICAPADRE > 0) 
      || (node.capasBisnietos?.length >= 1 );
      
    const isChecked = node.capasNietas ? node.capasNietas[0].IDCAPA:node.IDCAPA
    return (
      <div style={{ marginLeft: level * 20 + 'px' }}>
        <div>
          <span onClick={() => handleExpandCollapse(node.IDTEMATICA)} style={{ cursor: 'pointer' }}>
            {hasChildren ? (isExpanded ? <FaChevronDown /> : <FaChevronRight />) : null}
          </span>
          {
            ((node.URL || (node.capasNietas?.length < 2 && node.IDTEMATICAPADRE == 0)) ) ? (
              <input 
                type="checkbox" 
                checked={!!checkedItems[isChecked]} 
                onChange={() => handleCheck(node)} 
              />
            ) : null
          }
          { 
            (((node.capasHijas?.length >= 1) || (node.capasNietas?.length > 1) || (node.capasBisnietos?.length >= 1)
            || (node.IDTEMATICAPADRE > 0 ) && !node.URL) )
              ? node.NOMBRETEMATICA 
              : node.TITULOCAPA
          }
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.capasHijas && node.capasHijas.map(child => (
              <Node key={child.IDTEMATICA} node={child} level={level + 1} />
            ))}
            {node.capasNietas && node.capasNietas.map(child => (
              <Node key={child.IDTEMATICA} node={child} level={level + 1} />
            ))}
            {node.capasBisnietos && node.capasBisnietos.map(child => (
              <Node key={child.IDTEMATICA} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleCheck = (capa: interfCapa) => {
    const capaTemp = capa.capasNietas ? capa.capasNietas[0].IDCAPA:capa.IDCAPA
    setCheckedItems(prevState => ({
      ...prevState,
      [capaTemp]: !prevState[capaTemp],
    }));
  };

  // Manejar expansión y colapso de las temáticas
  const handleExpandCollapse = (id) => {
    console.log("expand => ", {id})
    setExpandedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderTree = (nodes) => {
    return nodes.map(node => (
      <Node key={node.IDTEMATICA} node={node} />
    ));
  };

  useEffect(() => {
    fetchLayers();
  }, []);

  return (
    <div className="w-100 p-3 bg-primary text-white" style={{overflowY:'scroll'}}>
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}


    <div >
      {renderTree(groupedLayers)}
    </div>


    </div>
  );
};

export default Widget;




import { React, AllWidgetProps } from "jimu-core";
import { useState, useEffect } from "react";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import '../styles/style.css';
import { CapasTematicas, ItemResponseTablaContenido, TablaDeContenidoInterface, datosBasicosInterface, interfCapa, interfaceCapasNietos } from "../types/interfaces";
import renderTree from "./components/renderTree";
import Widget_Tree from "./components/widgetTree";

const Widget = (props: AllWidgetProps<any>) => {
  const [varJimuMapView, setJimuMapView] = useState<JimuMapView>(); // To add the layer to the Map, a reference to the Map must be saved into the component state.
  const [groupedLayers, setGroupedLayers] = useState<CapasTematicas[]>([]);

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

  useEffect(() => {
    fetchLayers();
  }, []);

  return (
    <div className="w-100 p-3 bg-primary text-white" style={{overflowY:'scroll'}}>
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}

      <div >
        {/* {renderTree(groupedLayers)} */}
        <Widget_Tree dataTablaContenido={groupedLayers} varJimuMapView={varJimuMapView}/>
      </div>

    </div>
  );
};

export default Widget;




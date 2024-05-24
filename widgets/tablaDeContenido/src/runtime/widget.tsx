import { React, AllWidgetProps } from "jimu-core";
import { StarFilled } from 'jimu-icons/filled/application/star'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import FeatureLayer from "esri/layers/FeatureLayer";

// import { Button, Icon, Label, Option, Select } from 'jimu-ui'; // import components
// import FeatureLayer from "esri/layers/FeatureLayer";

import './style.css';
import { useEffect } from "react";
import { TablaDeContenidoInterface, capaInterface } from "../types/interfaces";

const { useState } = React
const iconNode = <StarFilled />;
interface Layer {
  DESCRIPCIONSERVICIO: string;
  IDCAPA: number;
  METADATOCAPA: string;
  URL: string;
  VISIBLE: boolean;
  NOMBRETEMATICA: string;
  TITULOCAPA: string;
  // Otros campos que puedas necesitar
}

const estructuraTablaContenido = [
  {
    nombreServicio: 'Ambiental',
    subServicio1Adicional: [
      {
        nombreSubServicio1Adicional: 'Cuenca',

      },
    ],
    capas: []

  }
]

const Widget = (props: AllWidgetProps<any>) => {

  const [varJimuMapView, setJimuMapView] = useState<JimuMapView>(); //To add the layer to the Map, a reference to the Map must be saved into the component state.
  // const [layers, setLayers] = useState<TablaDeContenidoInterface[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [expandedSubgroups, setExpandedSubgroups] = useState<{ [key: string]: boolean }>({});
  const [jsonTOC, setJsonTOC] = useState([])
  const [groupedLayers, setGroupedLayers] = useState({})

  const fetchLayers = async () => {
    try {
      const response = await fetch('https://sigquindio.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public');
      const responseTablaDeContenido: TablaDeContenidoInterface[] = await response.json();
      console.log({ responseTablaDeContenido })
      // setLayers(responseTablaDeContenido);
      setTimeout(() => {
        groupLayers(responseTablaDeContenido);
        
      }, 3000);
    } catch (error) {
      console.error('Error fetching layers:', error);
    }
  };

  /* const consultaSiExisteCapa = (idCapaMapa: string) => {
    const layers = varJimuMapView.view.map.layers;
    return layers.filter(layer => layer.id === idCapaMapa);
  } */

  const agregarCapaMapa = (capa: capaInterface) => {
    const layerToAdd = new FeatureLayer({
      url: capa.urlMapServer
    });
    varJimuMapView.view.map.add(layerToAdd);
  }
  const consultaExisteTematica = (jsonTOC: any[], arg1: { id: string; }) => {
    console.log("logica para consultar si ya existe la tematica")
    return jsonTOC.filter(e => e.id === arg1.id)
  }

  const tematicasHijo = (responseTablaDeContenido, { tablaDeContenido, idTematicasPadre }) => {
    let idTematicasHijo = []
    responseTablaDeContenido.forEach((e, i) => {

      if (e.IDTEMATICAPADRE > 0 && (idTematicasPadre.filter((itp, i) => itp.idTematicaPadre == e.IDTEMATICAPADRE).length > 0)) {
        if (e.IDTEMATICAPADRE == 20) {
          if (tablaDeContenido[e.IDTEMATICAPADRE].capas.filter(capa => capa.IDCAPA == e.IDCAPA).length < 1) {
            //console.log(tablaDeContenido[e.IDTEMATICAPADRE], e);  
            console.log(e);
            if (idTematicasHijo.filter(ith => ith.idTematicasHijo == e.IDTEMATICA).length < 1) {

              idTematicasHijo.push({ idTematicasHijo: e.IDTEMATICA, idTematicasNietos: [] })

            }
            if (idTematicasPadre.map(itp => itp.idTematicaPadre == e.IDTEMATICA).lenght < 1) {
              /* itp.idTematicasHijos.push({
                idTematicaHijo: e.IDTEMATICA,
                idTematicasNietos: []
              }) */
            }
            tablaDeContenido[e.IDTEMATICAPADRE].capas = [...tablaDeContenido[e.IDTEMATICAPADRE].capas, e]
          }

        }
      }

    })
    return { tablaDeContenido, idTematicasPadre, idTematicasHijo }
  }

  const tematicasPadre = (responseTablaDeContenido) => {
    let tablaDeContenido = {};
    let idTematicasPadre = []
    responseTablaDeContenido.forEach((e, i) => {

      if (e.IDTEMATICAPADRE === 0) {
        //console.log(idTematicasPadre.filter(itp => itp == e.IDTEMATICA))
        if (idTematicasPadre.filter(itp => itp.idTematicaPadre == e.IDTEMATICA).length < 1) {
          idTematicasPadre.push({ idTematicaPadre: e.IDTEMATICA, idTematicasHijos: [] })
        }

        if (e.DESCRIPCIONSERVICIO) {
          tablaDeContenido = { ...tablaDeContenido, [e.IDTEMATICA]: { IDTEMATICA: e.IDTEMATICA, NOMBRETEMATICA: e.NOMBRETEMATICA, capas: [e] } }
        } else {
          tablaDeContenido = { ...tablaDeContenido, [e.IDTEMATICA]: { IDTEMATICA: e.IDTEMATICA, NOMBRETEMATICA: e.NOMBRETEMATICA, capas: [] } }
        }
        //tablaDeContenido = {...tablaDeContenido,  [e.NOMBRETEMATICA]: e}
      }

    })
    return { tablaDeContenido, idTematicasPadre }
  }

  const groupLayers = (responseTablaDeContenido: TablaDeContenidoInterface[]) => {
    let rows = responseTablaDeContenido;
    let primeraVez = true;
    for (var i = 0; i < rows.length; i++) {
      let idTematica = rows[i].IDTEMATICA + 't';
      let idCapaArbol = rows[i].IDCAPA + 'c' + getRandomID();
      let idCapaMapa = rows[i].IDCAPA + 'c';
      let nombreTematica = rows[i].NOMBRETEMATICA;
      let tituloCapa = rows[i].TITULOCAPA;
      let idTematicaPadre = rows[i].IDTEMATICAPADRE;
      let visible = rows[i].VISIBLE;
      let url = rows[i].URL;
      let idCapaDeServicio = rows[i].NOMBRECAPA
      let urlMetadatoCapa = rows[i].METADATOCAPA
      let urlMetadatoServicio = rows[i].METADATOSERVICIO
      let DESCARGACAPA = rows[i].DESCARGACAPA ? rows[i].DESCARGACAPA : false;

      if (!idTematicaPadre) {
        idTematicaPadre = "#";
      } else {
        idTematicaPadre = idTematicaPadre + 't';
      }
      let existeTematica = consultaExisteTematica(jsonTOC, { 'id': idTematica });
      let newTematica = { "id": idTematica, "text": nombreTematica, "type": "tematica", "parent": idTematicaPadre };
      //En nombre tematica va el id para agregar el wms
      let newCapa = {}
      if (visible) {
        newCapa = {
          "id": idCapaArbol,
          "idCapaMapa": idCapaMapa,
          "text": Utf8Decode(tituloCapa),
          "type": "capa",
          "parent": idTematica,
          "state": { checked: true },
          "url": url,
          "idCapaDeServicio": idCapaDeServicio,
          "urlMetadatoCapa": urlMetadatoCapa,
          "urlMetadatoServicio": urlMetadatoServicio,
          DESCARGACAPA
        };
        /* if (map.getLayer(idCapaMapa) == undefined) {
          agregarCapaMapa(newCapa);
        } */

      } else {
        newCapa = { "id": idCapaArbol, "idCapaMapa": idCapaMapa, "text": Utf8Decode(tituloCapa), "type": "capa", "parent": idTematica, "state": { checked: false }, "url": url, "idCapaDeServicio": idCapaDeServicio, "urlMetadatoCapa": urlMetadatoCapa, "urlMetadatoServicio": urlMetadatoServicio, DESCARGACAPA };

      }

      if (existeTematica.length !== 0) {
        //ya existe la tematica en el JSON
        // jsonTOC.push(newCapa);
        setJsonTOC((prevJson) => [...prevJson, newCapa]);
      } else {
        //NO existe el servicio en el JSON
        // jsonTOC.push(newTematica);
        setJsonTOC((prevJson) => [...prevJson, newTematica]);
        if (rows[i].IDCAPA) {
          // jsonTOC.push(newCapa);
          setJsonTOC((prevJson) => [...prevJson, newCapa]);
        }
      }

    }

    console.log(jsonTOC);


  };

  // const groupedLayers = groupLayers(layers, 'DESCRIPCIONSERVICIO', 'NOMBRETEMATICA');

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  const toggleLayerVisibility = (layer: any) => {
    // Logic to toggle layer visibility in the map
    // This depends on how you have integrated your map and layers
    console.log('Toggling layer visibility:', layer);
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };
  const toggleSubgroup = (group: string, subgroup: string) => {
    const key = `${group}-${subgroup}`;
    setExpandedSubgroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    fetchLayers();
  }, []);

  return (
    <div className="w-100 p-3 bg-primary text-white">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}

      <div style={{ backgroundColor: 'white', overflowY: 'auto', maxHeight: '400px' }}>
        {Object.keys(groupedLayers).map((group, index) => (
          <div key={index}>
            <h2 onClick={() => toggleGroup(group)}>{group}</h2>
            {expandedGroups[group] && Object.keys(groupedLayers[group]).map((subgroup, idx) => (
              <div key={idx} style={{ marginLeft: '20px' }}>
                <h3 onClick={() => toggleSubgroup(group, subgroup)}>{subgroup}</h3>
                {expandedSubgroups[`${group}-${subgroup}`] && (
                  <ul>
                    {groupedLayers[group][subgroup].map((layer, id) => (
                      <li key={id} style={{ marginLeft: '20px' }}>
                        <label style={{ color: 'black' }}>
                          <input
                            type="checkbox"
                            checked={layer.VISIBLE}
                            onChange={() => toggleLayerVisibility(layer)}
                          />
                          {layer.TITULOCAPA || 'Sin título'}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>




    </div>
  );
};

export default Widget;


/**
     * Genera un numero aleatorio para el id del nodo dentro de la tabla de contenido, para poder tener capas repetidas en diferentes tematicas.
     */
export const getRandomID = () => {
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var stringLength = 4;
  return Array.apply(null, new Array(stringLength)).map(function () {
    return possible[Math.floor(Math.random() * possible.length)];
  }).join('');

}

/**
     * Funcion para codificar los caracteres con tildes.
     * 
     * @param {String} strUtf 
     */
export const Utf8Decode = (strUtf: string) => {
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  if (strUtf != undefined) {
    var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
      function (c) {  // (note parentheses for precedence)
        var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
        return String.fromCharCode(cc);
      }
    );
    strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
      function (c) {  // (note parentheses for precedence)
        var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
        return String.fromCharCode(cc);
      }
    );
    return strUni;
  }
  return "";
}




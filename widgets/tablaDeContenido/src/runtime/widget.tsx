import { React, AllWidgetProps } from "jimu-core";
import { useState, useEffect } from "react";
import { StarFilled } from 'jimu-icons/filled/application/star'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import FeatureLayer from "esri/layers/FeatureLayer";
import './style.css';
import { TablaDeContenidoInterface, capaInterface, datosBasicosInterface, interfaceCapasNietos, tablaContenInterface } from "../types/interfaces";
import { result } from "lodash-es";

const iconNode = <StarFilled />;

let tablaConten:tablaContenInterface[] = []

const Widget = (props: AllWidgetProps<any>) => {
  const [varJimuMapView, setJimuMapView] = useState<JimuMapView>(); // To add the layer to the Map, a reference to the Map must be saved into the component state.
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [expandedSubgroups, setExpandedSubgroups] = useState<{ [key: string]: boolean }>({});
  const [jsonTOC, setJsonTOC] = useState([]);
  const [groupedLayers, setGroupedLayers] = useState({});

  

  const agregarCapaMapa = (capa: capaInterface) => {
    const layerToAdd = new FeatureLayer({
      url: capa.urlMapServer
    });
    varJimuMapView.view.map.add(layerToAdd);
  };

  const consultaExisteTematica = (jsonTOC: any[], arg1: { id: string; }) => {
    console.log("logica para consultar si ya existe la tematica");
    return jsonTOC.filter(e => e.id === arg1.id);
  };

  const groupLayers = (responseTablaDeContenido: TablaDeContenidoInterface[]) => {
    let rows = responseTablaDeContenido;
    let jsonTOCTemp = [];
    for (var i = 0; i < rows.length; i++) {
      let idTematica = rows[i].IDTEMATICA + 't';
      let idCapaArbol = rows[i].IDCAPA + 'c' + getRandomID();
      let idCapaMapa = rows[i].IDCAPA + 'c';
      let nombreTematica = rows[i].NOMBRETEMATICA;
      let tituloCapa = rows[i].TITULOCAPA;
      let idTematicaPadre = rows[i].IDTEMATICAPADRE;
      let visible = rows[i].VISIBLE;
      let url = rows[i].URL;
      let idCapaDeServicio = rows[i].NOMBRECAPA;
      let urlMetadatoCapa = rows[i].METADATOCAPA;
      let urlMetadatoServicio = rows[i].METADATOSERVICIO;
      let DESCARGACAPA = rows[i].DESCARGACAPA ? rows[i].DESCARGACAPA : false;

      if (!idTematicaPadre) {
        // idTematicaPadre = "#";
      } else {
        // idTematicaPadre = idTematicaPadre + 't';
      }
      let existeTematica = consultaExisteTematica(jsonTOCTemp, { 'id': idTematica });
      let newTematica = { "id": idTematica, "text": nombreTematica, "type": "tematica", "parent": idTematicaPadre };
      let newCapa = {};
      let checked = false;
      if (visible) checked = true
      newCapa = {
        "id": idCapaArbol,
        "idCapaMapa": idCapaMapa,
        "text": Utf8Decode(tituloCapa),
        "type": "capa",
        "parent": idTematica,
        "state": { checked },
        "url": url,
        "idCapaDeServicio": idCapaDeServicio,
        "urlMetadatoCapa": urlMetadatoCapa,
        "urlMetadatoServicio": urlMetadatoServicio,
        DESCARGACAPA
      };

      if (existeTematica.length !== 0) { //ya existe la tematica en el JSON  
        jsonTOCTemp.push(newCapa);
      } else { //NO existe el servicio en el JSON
        jsonTOCTemp.push(newTematica);
        if (rows[i].IDCAPA) {          
          jsonTOCTemp.push(newCapa);
        }
      }
    }

    setJsonTOC(jsonTOCTemp);

  };

  

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  const toggleLayerVisibility = (layer: any) => {
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
    // console.log('jsonTOC updated:', jsonTOC);
    // Puedes hacer algo aquí con jsonTOC actualizado
  }, [jsonTOC]);

  const tematicasHijo = (responseTablaDeContenido: TablaDeContenidoInterface[], {tablaDeContenido, idTematicasPadre}) => {    
    let idTematicasHijo=[]
    responseTablaDeContenido.forEach((e, i) =>{
      // valida si es padre y si existe dentro del arreglo de idTematicasPadre
       if(e.IDTEMATICAPADRE > 0 /* && (idTematicasPadre.filter((itp: { idTematicaPadre: number; }, i: any) => itp.idTematicaPadre == e.IDTEMATICAPADRE).length > 0) */){
        // valida si dentro de las capas del padre ya exite, para q no se repita
        if(tablaDeContenido[e.IDTEMATICAPADRE]?.capas.filter((capa: { IDCAPA: number; }) => capa.IDCAPA == e.IDCAPA).length<1){

          //console.log(tablaDeContenido[e.IDTEMATICAPADRE], e);                     
          console.log(e);
          tablaDeContenido[e.IDTEMATICAPADRE].capas.push(e); // lo agrega al listado de capas del padre
          // valida si exite dentro del arreglo de capas hijos
          if(idTematicasHijo.filter(ith => ith.idTematicasHijo == e.IDTEMATICA).length < 1){
              
            idTematicasHijo.push({idTematicasHijo: e.IDTEMATICA, idTematicasNietos:[]})
              
          }
          /* if(idTematicasPadre.map(itp => itp.idTematicaPadre == e.IDTEMATICA).lenght < 1){
                  itp.idTematicasHijos.push({
                      idTematicaHijo:e.IDTEMATICA,
                      idTematicasNietos:[]
                  })
              } */
          // tablaDeContenido[e.IDTEMATICAPADRE].capas = [...tablaDeContenido[e.IDTEMATICAPADRE].capas, e]
      }
               
    }
       
})    
    return {tablaDeContenido, idTematicasPadre, idTematicasHijo}
}

  const recorreEnBusquedaDeCapasHijo_Nietas = (responseTablaDeContenido, tablaConten) => {
    const dataToSee = [];
    
    const capasNietasPendientesPorAsignar = [];
    // do {
      responseTablaDeContenido.forEach((ItemResponseTablaContenido, i) => {
        if(ItemResponseTablaContenido.IDTEMATICAPADRE > 0){



            tablaConten.map(tablaCon => {
              if (tablaConten.filter(tablaConten.filter(capaNieto => capaNieto.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICAPADRE).length<1)) {
                capasNietasPendientesPorAsignar.push(ItemResponseTablaContenido); //agrega para a listado de nietos para buscar el padre
              } else { // logica busca y asigna hijo apadre
                if (ItemResponseTablaContenido.IDTEMATICAPADRE == tablaCon.IDTEMATICA ) {//verifica si el datoResponse ya se encuentra en el marreglo de la TdeC           
                  if(tablaCon.capas.filter(capa => capa.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA).length>0){//verifica si exite
                    tablaCon.capas.map(subCapa => {
                      if (subCapa.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA) {
                        if (subCapa.capas.filter(subSub => subSub.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA).length>0) {
                          subCapa.capas.map((sc: any) => {
                            if(sc.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA){
                              sc.capas.push(ItemResponseTablaContenido);
                            }})
                        }else{
                          subCapa.capas.push(
                            {
                              IDTEMATICA:ItemResponseTablaContenido.IDTEMATICA,
                              NOMBRETEMATICA: ItemResponseTablaContenido.NOMBRETEMATICA,
                              SubCapas:[ItemResponseTablaContenido]
                            }
                          );
                        }
                      }else{
                        // 
                      }
                    });
                  }else{//si no existe agrega nueva
                    tablaCon.capas.push(
                      {
                        IDTEMATICA:ItemResponseTablaContenido.IDTEMATICA,
                        NOMBRETEMATICA: ItemResponseTablaContenido.NOMBRETEMATICA,
                        capas:[{
                          IDTEMATICA:ItemResponseTablaContenido.IDTEMATICA,
                          NOMBRETEMATICA: ItemResponseTablaContenido.NOMBRETEMATICA,
                          capas:[ItemResponseTablaContenido]
                        }]
                      }
                    );
                  }
                }else{
                  dataToSee.push(ItemResponseTablaContenido)
                }
              }
            });          
            
          }
      });
    // } while (capasNietasPendientesPorAsignar.length>0);
    if (capasNietasPendientesPorAsignar.length>0) {
      recorreEnBusquedaDeCapasHijo_Nietas(responseTablaDeContenido, tablaConten);
    } else {
      console.log({dataToSee})
      return tablaConten;      
    }

  }
  const tematicasPadre1 = (responseTablaDeContenido: TablaDeContenidoInterface[]) => {    
    tablaConten = [];
    /**
     * Logica para deteminar las tematicas padres
     */
    responseTablaDeContenido.forEach(ItemResponseTablaContenido => {
      if(ItemResponseTablaContenido.IDTEMATICAPADRE == 0 && ItemResponseTablaContenido.NOMBRETEMATICA){
          // console.log(ItemResponseTablaContenido)
          if(tablaConten.filter(tablaCon => tablaCon.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA).length > 0){
              tablaConten.map(tablaCon => {
                if(tablaCon.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA){
                  tablaCon.capas.push(ItemResponseTablaContenido); //agrega las capas que no tienen subcapas, directas con el check en el listado padre de la tematica
                }
              })
          }else if(ItemResponseTablaContenido.NOMBRECAPA){// verifica que
            tablaConten.push({
                IDTEMATICA:ItemResponseTablaContenido.IDTEMATICA,
                NOMBRETEMATICA: ItemResponseTablaContenido.NOMBRETEMATICA,
                capas:[ItemResponseTablaContenido.NOMBRECAPA?ItemResponseTablaContenido:''],
            })
          }else{
              tablaConten.push({
                  IDTEMATICA:ItemResponseTablaContenido.IDTEMATICA,
                  NOMBRETEMATICA: ItemResponseTablaContenido.NOMBRETEMATICA,
                  capas:[],
              })
          }
          
      }
    });
    
    //logica capas hijas y nietas
    tablaConten = recorreEnBusquedaDeCapasHijo_Nietas(responseTablaDeContenido, tablaConten)


    
    return tablaConten
  }

  const agregarTematicaNietaNueva = (capasNietos: interfaceCapasNietos, ItemResponseTablaContenido: TablaDeContenidoInterface, datosBasicos: datosBasicosInterface): interfaceCapasNietos => {
    
    capasNietos = {
      capas:[...capasNietos.capas, {
        IDCAPA: ItemResponseTablaContenido.IDCAPA,
        IDTEMATICA: ItemResponseTablaContenido.IDTEMATICA,
      }],
      tematicasNietas:[
        ...capasNietos.tematicasNietas,
        {
          ...datosBasicos,
          capasBisnietos:[ItemResponseTablaContenido.URL?ItemResponseTablaContenido:'']
        }
      ]
    }      
    return capasNietos
  }

  const validaSiExisteCApaNieto = (capasNietos, ItemResponseTablaContenido) => {
    return capasNietos.capas.filter(capaNieta => (
      capaNieta.IDCAPA == ItemResponseTablaContenido.IDCAPA && capaNieta.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA
    )).length<1
  }
  
  const tematicasPadre = (responseTablaDeContenido: TablaDeContenidoInterface[]) => {
    // busco capas padre e hijos directos
    const tematicas = []; 
    responseTablaDeContenido.forEach((ItemResponseTablaContenido, i) => { 
      const datosBasicos = {
        IDTEMATICAPADRE:ItemResponseTablaContenido.IDTEMATICAPADRE,
        IDTEMATICA: ItemResponseTablaContenido.IDTEMATICA,
        NOMBRETEMATICA:ItemResponseTablaContenido.NOMBRETEMATICA,
        TITULOCAPA: ItemResponseTablaContenido.TITULOCAPA,
      }
      
      if(ItemResponseTablaContenido.IDTEMATICAPADRE == 0 && ItemResponseTablaContenido.NOMBRETEMATICA){
        if (tematicas.filter(tematica => tematica.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA).length < 1) {
          // no existe en tematicas

          if (!ItemResponseTablaContenido.URL) { //no tiene url de capa, osea es capa., solo es para cabeza de subtematica
            tematicas.push({
              ...datosBasicos,                       
              capasHijas:[]
            })            
          } else { // como tematica y capa hija a la vez
            tematicas.push({
              ...datosBasicos,
              capasHijas:[
                {
                  ...datosBasicos,
                  capasNietas:[ItemResponseTablaContenido.NOMBRECAPA?ItemResponseTablaContenido:'']                    
                }
              ],
          })
            
          }
        } else { // si ya existe la capa en tematicas, la grega entre el listado de cpas hijas
          tematicas.map(tematica => {
            if(tematica.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA){
              tematica.capasHijas.push(
                {
                  ...datosBasicos,
                  capasNietas:[ItemResponseTablaContenido.NOMBRECAPA?ItemResponseTablaContenido:''] //agrega las capas que no tienen subcapas, directas con el check en el listado padre de la tematica
                }
              )
            }
          })
        }

      }
    });
    console.log(tematicas)
    
    // con el arreglo de padres busca capas hijo y asigno
    const capasHijasDeTematicas = [];
    let capasNietos:interfaceCapasNietos = {capas:[], tematicasNietas:[]};
    responseTablaDeContenido.forEach((ItemResponseTablaContenido, i) => {
      const datosBasicos = {
        IDTEMATICAPADRE:ItemResponseTablaContenido.IDTEMATICAPADRE,
        IDTEMATICA:ItemResponseTablaContenido.IDTEMATICA,
        NOMBRETEMATICA:ItemResponseTablaContenido.NOMBRETEMATICA,
        TITULOCAPA: ItemResponseTablaContenido.TITULOCAPA,
      }
      if(ItemResponseTablaContenido.IDTEMATICAPADRE > 1){ // si es hijo o nieto de tematica padre
        tematicas.map(tematica => {
          if (tematica.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICAPADRE) { // es hijo
            if (tematica.capasHijas.length < 1) { // no tiene capa hijas, la agrega
              tematica.capasHijas.push(
                {
                  ...datosBasicos,
                  capasNietas:[ItemResponseTablaContenido.NOMBRECAPA?ItemResponseTablaContenido:'']                    
                }
              );
            }else{
              // console.log(ItemResponseTablaContenido.IDTEMATICAPADRE)
              // no exite, se debe agregar como capa hija
              if (tematica.capasHijas.filter(capaHija => capaHija.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA).length<1) {
                tematica.capasHijas.push(
                  {
                    ...datosBasicos,
                    capasNietas:ItemResponseTablaContenido.URL?[ItemResponseTablaContenido]:[]
                  }
                );
              }else{ // si existe la hija, enteces se debe agregar como nieta
                tematica.capasHijas.map(capaHija => {
                  if (capaHija.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA) {
                    capaHija.capasNietas.push(ItemResponseTablaContenido)
                  }
                });
              }
            }
            //con el siguiente if, se valida si es una capa nieta, se almacena para ser recorriendo en el siguiente flujo
            // alert("seguir Validando el objeto, capasNietos y su nueva estructura")
          }else if ( validaSiExisteCApaNieto(capasNietos, ItemResponseTablaContenido) && tematicas.filter(tematica => tematica.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICAPADRE).length<1) {
            if (capasNietos.tematicasNietas.filter(tematicaNiesta => tematicaNiesta.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA).length > 0) { // busco si ya existe la tematica nieta
              capasNietos.tematicasNietas.map(tematicaNieta => {
                if (tematicaNieta.IDTEMATICAPADRE == ItemResponseTablaContenido.IDTEMATICAPADRE) {
                  if (tematicaNieta.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA) {
                    tematicaNieta.capasBisnietos.push(ItemResponseTablaContenido); 
                  }else{
                    console.log(1111)
                  }
                }else{
                  console.log(22222)
                }
                if (validaSiExisteCApaNieto(capasNietos, ItemResponseTablaContenido)) capasNietos.capas.push({IDCAPA:ItemResponseTablaContenido.IDCAPA, IDTEMATICA:ItemResponseTablaContenido.IDTEMATICA})
              });                
            } else { // si no existe agrego nueva tematica nieta 
              capasNietos = agregarTematicaNietaNueva(capasNietos, ItemResponseTablaContenido, datosBasicos);
            }
          }else{
            console.log(ItemResponseTablaContenido)
          }
            // capasNietos.push(ItemResponseTablaContenido)              
        });
        

      }
    });
    debugger
    console.log({tematicas})
    console.log({capasNietos})
    // con el arreglo de hijos busco capas nieto y asigno
    capasNietos.tematicasNietas.forEach((itemCapaNieta, icn) => {
      tematicas.map((itemTematica, it) => {
        itemTematica.capasHijas.map((capaHija, ich) => {
          if (itemCapaNieta.IDTEMATICAPADRE == capaHija.IDTEMATICA) {
            capaHija.capasNietas.push(itemCapaNieta);
          }
        });        
      });
    });
    console.log({tematicas})

    // con el arreglo de nieto tataranieto y asigno

  }

  const ordenarDataTablaContenido = (responseTablaDeContenido: TablaDeContenidoInterface[]) => {
    // console.log(responseTablaDeContenido)
    // const tablaContenido = tematicasPadre1(responseTablaDeContenido);
    const tablaContenido = tematicasPadre(responseTablaDeContenido);
    console.log(tablaContenido)
    // console.log(JSON.stringify(tablaContenido))

  }

  const fetchLayers = async () => {
    try {
      const response = await fetch('https://sigquindio.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public');
      const responseTablaDeContenido: TablaDeContenidoInterface[] = await response.json();
      console.log({ responseTablaDeContenido });
      // setTimeout(() => {
        // groupLayers(responseTablaDeContenido); //logica quindio
        ordenarDataTablaContenido(responseTablaDeContenido); // logica Rigo
      // }, 3000);
    } catch (error) {
      console.error('Error fetching layers:', error);
    }
  };

  useEffect(() => {
    fetchLayers();
  }, []);

  return (
    <div className="w-100 p-3 bg-primary text-white">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}

      <button onClick={fetchLayers}>Relanzar flujo</button>

      <div style={{ backgroundColor: 'white', overflowY: 'auto', maxHeight: '400px' }}>
        {Object.keys(groupedLayers).map((group, index) => (
          <div key={index}>
            <h2 onClick={() => toggleGroup(group)}>{group}</h2>
            {expandedGroups[group] && Object.keys(groupedLayers[group]).map((subgroup, idx) => (
              <div key={idx} style={{ marginLeft: '20px' }}>
                <h3 onClick={() => toggleSubgroup(group, subgroup)}>{subgroup}</h3>
                {expandedSubgroups[`${group}-${subgroup}`] && (
                  <ul>
                    {groupedLayers[group][subgroup].map((layer: { VISIBLE: boolean; TITULOCAPA: any; }, id: React.Key) => (
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
};

/**
 * Funcion para codificar los caracteres con tildes.
 * 
 * @param {String} strUtf 
 */
export const Utf8Decode = (strUtf: string) => {
  if (strUtf != undefined) {
    var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
      function (c) {
        var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
        return String.fromCharCode(cc);
      }
    );
    strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,
      function (c) {
        var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
        return String.fromCharCode(cc);
      }
    );
    return strUni;
  }
  return "";
};









import { React, AllWidgetProps } from "jimu-core";
import { useState, useEffect } from "react";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
import './style.css';
import { DatosBasicos, TablaDeContenidoInterface, TematicasTablaDeContenidoInterface, capaInterface, datosBasicosInterface, interfaceCapasNietos, tablaContenInterface } from "../types/interfaces";


const Widget = (props: AllWidgetProps<any>) => {
  const [varJimuMapView, setJimuMapView] = useState<JimuMapView>(); // To add the layer to the Map, a reference to the Map must be saved into the component state.
  
  const [groupedLayers, setGroupedLayers] = useState([]);

  
  

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };
  const agregarTematicaNietaNueva = (capasNietos: interfaceCapasNietos, ItemResponseTablaContenido: TablaDeContenidoInterface, datosBasicos: datosBasicosInterface): interfaceCapasNietos => {
    
    const nuevaCapa = {
      IDCAPA: ItemResponseTablaContenido.IDCAPA,
      IDTEMATICA: ItemResponseTablaContenido.IDTEMATICA,
    };
  
    const nuevaTematicaNieta = {
      ...datosBasicos,
      capasBisnietos: ItemResponseTablaContenido.URL ? [ItemResponseTablaContenido] : ['']
    };
  
    return {
      capas: [...capasNietos.capas, nuevaCapa],
      tematicasNietas: [...capasNietos.tematicasNietas, nuevaTematicaNieta]
    };
  }

  const validaSiExisteCApaNieto = (capasNietos, ItemResponseTablaContenido) => {
    return capasNietos.capas.filter(capaNieta => (
      capaNieta.IDCAPA == ItemResponseTablaContenido.IDCAPA && capaNieta.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA
    )).length<1
  }
  
  const ordenarDataTablaContenido = (responseTablaDeContenido: TablaDeContenidoInterface[]) => {
    const tematicas:TablaDeContenidoInterface[] = []; 
    responseTablaDeContenido.forEach((ItemResponseTablaContenido, i) => { 
      const datosBasicos: DatosBasicos = {
        IDTEMATICAPADRE:ItemResponseTablaContenido.IDTEMATICAPADRE,
        IDTEMATICA: ItemResponseTablaContenido.IDTEMATICA,
        NOMBRETEMATICA:ItemResponseTablaContenido.NOMBRETEMATICA,
        TITULOCAPA: ItemResponseTablaContenido.TITULOCAPA,
      }
      
      if(ItemResponseTablaContenido.IDTEMATICAPADRE == 0 && ItemResponseTablaContenido.NOMBRETEMATICA){
        if (tematicas.filter(tematica => tematica.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA).length < 1) {

          if (!ItemResponseTablaContenido.URL) { 
            tematicas.push({
              ...datosBasicos,                       
              capasHijas:[]
            })            
          } else { 
            tematicas.push({
              ...datosBasicos,
              capasHijas:[
                {
                  ...datosBasicos,
                  capasNietas:ItemResponseTablaContenido.NOMBRECAPA?[ItemResponseTablaContenido]:[]                    
                }
              ],
          })
            
          }
        } else {
          tematicas.map(tematica => {
            if(tematica.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA){
              tematica.capasHijas.push(
                {
                  ...datosBasicos,
                  capasNietas:[ItemResponseTablaContenido.NOMBRECAPA?ItemResponseTablaContenido:''] 
                }
              )
            }
          })
        }

      }
    });
    
    
    let capasNietos:interfaceCapasNietos = {capas:[], tematicasNietas:[]};
    
    responseTablaDeContenido.forEach((ItemResponseTablaContenido, i) => {
      const datosBasicos = {
        IDTEMATICAPADRE:ItemResponseTablaContenido.IDTEMATICAPADRE,
        IDTEMATICA:ItemResponseTablaContenido.IDTEMATICA,
        NOMBRETEMATICA:ItemResponseTablaContenido.NOMBRETEMATICA,
        TITULOCAPA: ItemResponseTablaContenido.TITULOCAPA,
      }
      if(ItemResponseTablaContenido.IDTEMATICAPADRE > 1){ 
        tematicas.map(tematica => {
          if (tematica.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICAPADRE) {
            if (tematica.capasHijas.length < 1) { 
              tematica.capasHijas.push(
                {
                  ...datosBasicos,
                  capasNietas:[ItemResponseTablaContenido.NOMBRECAPA?ItemResponseTablaContenido:'']                    
                }
              );
            }else{
             
              if (tematica.capasHijas.filter(capaHija => capaHija.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA).length<1) {
                tematica.capasHijas.push(
                  {
                    ...datosBasicos,
                    capasNietas:ItemResponseTablaContenido.URL?[ItemResponseTablaContenido]:[]
                  }
                );
              }else{ 
                tematica.capasHijas.map((capaHija: { IDTEMATICA: number; capasNietas: TablaDeContenidoInterface[]; }) => {
                  if (capaHija.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA) {
                    capaHija.capasNietas.push(ItemResponseTablaContenido)
                  }
                });
              }
            }
          }else if ( validaSiExisteCApaNieto(capasNietos, ItemResponseTablaContenido) && tematicas.filter(tematica => tematica.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICAPADRE).length<1) {
            if (capasNietos.tematicasNietas.filter(tematicaNiesta => tematicaNiesta.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA).length > 0) { 
              capasNietos.tematicasNietas.map(tematicaNieta => {
                if (tematicaNieta.IDTEMATICAPADRE == ItemResponseTablaContenido.IDTEMATICAPADRE) {
                  if (tematicaNieta.IDTEMATICA == ItemResponseTablaContenido.IDTEMATICA) {
                    tematicaNieta.capasBisnietos.push(ItemResponseTablaContenido); 
                  }
                }
                if (validaSiExisteCApaNieto(capasNietos, ItemResponseTablaContenido)) capasNietos.capas.push({IDCAPA:ItemResponseTablaContenido.IDCAPA, IDTEMATICA:ItemResponseTablaContenido.IDTEMATICA})
              });                
            } else { 
              capasNietos = agregarTematicaNietaNueva(capasNietos, ItemResponseTablaContenido, datosBasicos);
            }
          }
        });
        

      }
    });
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
    setGroupedLayers(tematicas)

  }


  const fetchLayers = async () => {
    try {
      const response = await fetch('https://sigquindio.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public');
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
    <div className="w-100 p-3 bg-primary text-white">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}

      
    </div>
  );
};

export default Widget;




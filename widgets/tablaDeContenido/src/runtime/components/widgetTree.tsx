import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { WidgetQueryOutlined } from 'jimu-icons/outlined/brand/widget-query'
import { RightOutlined } from 'jimu-icons/outlined/directional/right'
import { WrongOutlined } from 'jimu-icons/outlined/suggested/wrong'
import { DownOutlined } from 'jimu-icons/outlined/directional/down'
import { ClearOutlined } from 'jimu-icons/outlined/editor/clear'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FeatureLayer from "esri/layers/FeatureLayer";
import { ContexMenu } from './ContexMenu';
import { JimuMapView } from 'jimu-arcgis';
import { Button } from 'jimu-ui'
import DragAndDrop from './DragAndDrop';
import { CapasTematicas, InterfaceContextMenu, InterfaceFeaturesLayersDeployed, ItemResponseTablaContenido, Tematicas } from '../../types/interfaces';
import 'rc-slider/assets/index.css'; import 'react-tabs/style/react-tabs.css';
import '../../styles/style.css';
import '../../styles/styles_widgetTree.css';

interface Widget_Tree_Props {
    dataTablaContenido:CapasTematicas[]; // data ordenada
    varJimuMapView: JimuMapView; // referencia al mapa
    setDataTablaContenido: Dispatch<SetStateAction<CapasTematicas[]>> //  por el momento cuando se ajusta el VISIBLE de cada capa
}

/**
 * Widget que se encarga de renderizar la data ya ordenada de la tabla de contenido en forma de arbol
 * @author Rigoberto Rios - rigoriosh@gmail.com
 * @param param0 segun interfac Widget_Tree_Props
 * @returns Widget_Tree
 */
const Widget_Tree: React.FC<Widget_Tree_Props> = ({ dataTablaContenido, varJimuMapView, setDataTablaContenido }) => {
    const [expandedItems, setExpandedItems] = useState({}); // almacena los nodos que son expandibles
    const [checkedItems, setCheckedItems] = useState({}); // almacena los nodos que tienen la opcion de check y son checkeados
    const [searchQuery, setSearchQuery] = useState<string>(''); // se utiliza para capturar la entrada del campo buscar capa
    const [capasSelectd, setCapasSelectd] = useState<ItemResponseTablaContenido[]>([]); // almacena las capas seleccionadas, se emplea para ser renderizadas en el tab "Orden Capas"
    const [contextMenu, setContextMenu] = useState<InterfaceContextMenu>(null); // controla el despliegue y data a mostrar en el contextMenu
    const [featuresLayersDeployed, setFeaturesLayersDeployed] = useState<InterfaceFeaturesLayersDeployed[]>([]); // almacena los features y su metadata pintados en el mapa
    const [banderaRefreshCapas, setBanderaRefreshCapas] = useState<boolean>(false); // bandera empleada para actualizar en el mapa el orden de las capas

    /**
     * Metodo que prende o apaga la capa a la que se le de click en el check y actualiza capasSelectd, checkedItems
     * @param capa de tipo ItemResponseTablaContenido
     */
    const handleCheck = (capa: ItemResponseTablaContenido, {target}) => {
        const IDCAPA = capa.capasNietas ? capa.capasNietas[0].IDCAPA : capa.IDCAPA;
        const capaToDeployContextmenu = capa.URL ? capa : capa.capasNietas ? capa.capasNietas.length == 1 ? capa.capasNietas[0] : undefined : undefined;
        setCheckedItems(prevState => ({ ...prevState, [IDCAPA]: target.checked }));
        capaToDeployContextmenu.VISIBLE = target.checked;
        if (capasSelectd.length > 0 || target.checked) {
            setCapasSelectd(prevState => {
                const newState = prevState.includes(capaToDeployContextmenu) ? prevState.filter(item => item !== capaToDeployContextmenu) : [...prevState, capaToDeployContextmenu];
                return newState;
            });
            capaToDeployContextmenu.VISIBLE ? dibujaCapasSeleccionadas([capaToDeployContextmenu], varJimuMapView) : removerFeatureLayer(capaToDeployContextmenu);            
        }
    };

    /**
     * Metodo que controla el click derecho sobre una capa especifica para abrir el contextMenu
     * @param e evento click
     * @param capa capa seleccionada
     */
    const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, capa: ItemResponseTablaContenido ) => {
        e.preventDefault();
        const capaToDeployContextmenu = capa.URL ? capa : capa.capasNietas ? capa.capasNietas.length == 1 ? capa.capasNietas[0] : undefined : undefined;
        if (capaToDeployContextmenu) {
            setContextMenu({
                mouseX: e.clientX + 50,
                mouseY: e.clientY - 70,
                capa_Feature: {
                    capa:capaToDeployContextmenu,
                    layer: featuresLayersDeployed.filter(e=>e.capa == capaToDeployContextmenu)[0]?.layer
                }
            });
        }
    };

    /**
     * Metodo que se encarga de dibujar el arbol de capas
     * @param param0 
     * @returns 
     */
    const Nodo = ({ capa, level = 0 }) => {
        const isExpanded = expandedItems[capa.IDTEMATICA];
        const hasChildren =
            (capa.capasHijas?.length >= 1) ||
            (capa.capasNietas?.length > 0 && capa.IDTEMATICAPADRE > 0) ||
            (capa.capasBisnietos?.length >= 1) || (searchQuery !== '' && !capa.URL);

        const isChecked = capa.capasNietas ? capa.capasNietas[0].IDCAPA : capa.IDCAPA;

        const displayName = ((capa.capasHijas?.length >= 1)
            || (capa.capasNietas?.length > 1)
            || (capa.capasBisnietos?.length >= 1)
            || (capa.IDTEMATICAPADRE > 0 && !capa.URL))
            ? capa.NOMBRETEMATICA
            : capa.TITULOCAPA;

        const renderChildren = () => (
            <>
                {capa.capasHijas && capa.capasHijas.map(capa => (
                    <Nodo key={capa.IDTEMATICA} capa={capa} level={level + 1} />
                ))}
                {capa.capasNietas && capa.capasNietas.map(capa => (
                    <Nodo key={capa.IDTEMATICA} capa={capa} level={level + 1} />
                ))}
                {capa.capasBisnietos && capa.capasBisnietos.map(capa => (
                    <Nodo key={capa.IDTEMATICA} capa={capa} level={level + 1} />
                ))}
            </>
        );

        return (
            <div style={{ marginLeft: level * 20 + 'px' }} onContextMenu={(e) => { handleRightClick(e, capa) }}  >
                <div className='rowCheck'>
                    <span onClick={() => setExpandedItems(prevState => ({ ...prevState, [capa.IDTEMATICA]: !prevState[capa.IDTEMATICA]}))} 
                        style={{ cursor: 'pointer' }}>
                        {hasChildren ? (isExpanded ? <DownOutlined /> : <RightOutlined />) : null}
                    </span>
                    {
                        ((capa.URL || (capa.capasNietas?.length < 2 && capa.IDTEMATICAPADRE == 0))) ? (
                            <input
                                type="checkbox"
                                checked={!!checkedItems[isChecked]}
                                onChange={(e) => handleCheck(capa, e)}
                                style={{marginRight:'10px'}}
                            />
                        ) : null
                    }
                    {displayName}
                </div>
                {isExpanded && hasChildren && renderChildren()}
            </div>
        );
    };
    
    /**
     * Metodo encargado de filtrar las capas que coinciden con el campo de busqueda
     * @param dataTablaContenido 
     * @returns 
     */
    const filterdataTablaContenido = (dataTablaContenido: CapasTematicas[]) => {
        if (searchQuery === '') {
          return dataTablaContenido;
        }
        const filtereddataTablaContenido = [
          {
            IDTEMATICA: 555,
            IDTEMATICAPADRE: 0,
            NOMBRETEMATICA: 'Resultado de tu busqueda',
            TITULOCAPA: '',
            capasHijas: []
          }
        ];
        const capasHijas = [];
      
        const filtroRecursivo = (dataTablaContenido, searchQuery) => {
          for (const capa of dataTablaContenido) {

            if (capa.URL && capa.TITULOCAPA.toLowerCase().startsWith(searchQuery.toLowerCase())) {
              let existingNode = capasHijas.find(capaHija => capaHija.IDTEMATICA === capa.IDTEMATICA && capaHija.IDTEMATICAPADRE === capa.IDTEMATICAPADRE);
              if (existingNode) {
                existingNode.capasNietas.push(capa);
              } else {
                capasHijas.push({
                  IDTEMATICA: capa.IDTEMATICA,
                  IDTEMATICAPADRE: capa.IDTEMATICAPADRE,
                  NOMBRETEMATICA: capa.NOMBRETEMATICA,
                  TITULOCAPA: capa.TITULOCAPA,
                  capasNietas: [capa]
                });
              }
            }
            if (capa.capasHijas) {
              filtroRecursivo(capa.capasHijas, searchQuery);
            }
            if (capa.capasNietas) {
              filtroRecursivo(capa.capasNietas, searchQuery);
            }
            if (capa.capasBisnietos) {
              filtroRecursivo(capa.capasBisnietos, searchQuery);
            }
          }
        };
      
        filtroRecursivo(dataTablaContenido, searchQuery);
        filtereddataTablaContenido[0].capasHijas = capasHijas;
        console.log(filtereddataTablaContenido)
        return filtereddataTablaContenido;
      };
      
    /**
     * Recibe la data tabla contenido e inicia la logica, pasando primero por el filtrado de capas y despues mapea la respuesta del
     * filtro y renderizar los nodos
     * @param dataTablaContenido 
     * @returns componente Nodo donde renderizara, tematica padre, tematicas y/o capas hijas, tematicas y/o capas nietas y capas bisnietas
     */
    const renderTree = (dataTablaContenido: CapasTematicas[]) => {        
        const filteredDataTablaContenido = filterdataTablaContenido(dataTablaContenido);
        return filteredDataTablaContenido.map((capa: Tematicas) => (
            <Nodo key={capa.IDTEMATICA} capa={capa} />
        ));

    };

    /**
     * Metodo que dibuja en el mapa la capa chequeada y actualiza el state FeaturesLayersDeployed
     * @param capasToRender 
     * @param varJimuMapView 
     */
    const dibujaCapasSeleccionadas = (capasToRender: ItemResponseTablaContenido[], varJimuMapView: JimuMapView) => {
        capasToRender.forEach(capa =>{
            const url = capa.URL?capa.URL:capa.capasNietas[0].URL;
            const nombreCapa = capa.NOMBRECAPA?capa.NOMBRECAPA:capa.capasNietas[0].NOMBRECAPA
            const layer = new FeatureLayer({
                url: `${url}/${nombreCapa}`
            });
            varJimuMapView.view.map.add(layer);
            layer.when(()=>{
                varJimuMapView.view.goTo(layer.fullExtent)
            })
            setFeaturesLayersDeployed(features => [...features,{capa: capa.IDCAPA ? capa : capa.capasNietas[0], layer}]);
            // const testLayer = varJimuMapView.view.map.layers.getItemAt(0) 
        });
    }

    /**
     * Metodo que quita del mapa una capa deschequeada y actualiza el state FeaturesLayersDeployed
     * @param capa 
     */
    const removerFeatureLayer = (capa: ItemResponseTablaContenido) => {
        if (featuresLayersDeployed.length > 0) {
            const layer = featuresLayersDeployed.filter(({capa:capaDeployed}) => (capaDeployed.IDCAPA ? capaDeployed.IDCAPA : capaDeployed.capasNietas[0].IDCAPA) == (capa.IDCAPA?capa.IDCAPA:capa.capasNietas[0].IDCAPA))[0].layer;
            varJimuMapView.view.map.remove(layer);              
            setFeaturesLayersDeployed(featuresLayersDeployed.filter(item => item.capa.IDCAPA != (capa.IDCAPA ? capa.IDCAPA : capa.capasNietas[0].IDCAPA)));
            varJimuMapView.view.zoom = varJimuMapView.view.zoom -0.00000001            
        }
    }

    /**
     * Metodo que quita todas las capas pintadas en el mapa y actauliza los states FeaturesLayersDeployed, apasSelectd,
     * DataTablaContenido y SearchQuery
     * @returns 
     */
    const removeAllLayers = () => {
        featuresLayersDeployed.forEach(FL => varJimuMapView.view.map.remove(FL.layer));
        setFeaturesLayersDeployed([]);
        const {capasVisibles, clonedDataTablaContenido, apagarCapas} = recorreTodasLasCapasTablaContenido(dataTablaContenido, true);
        setCapasSelectd( capasVisibles );
        if (apagarCapas) setDataTablaContenido(clonedDataTablaContenido)
        varJimuMapView.view.zoom = varJimuMapView.view.zoom - 0.00000001;
        renderTree(dataTablaContenido);
        setSearchQuery('');
    };

    /**
     * Recorre la tabla de contenido en buscas de capas a dibujar por el parametro VISIBLE = true y las dibuja
     */
    useEffect(() => {
        const {capasVisibles} = recorreTodasLasCapasTablaContenido(dataTablaContenido);
        setCapasSelectd( capasVisibles );
        dibujaCapasSeleccionadas(capasVisibles, varJimuMapView);     
        return () => {}
    }, [dataTablaContenido])    

    /**
     * Se encarga de reordenar las capas dibujadas en el mapa segun lo modificado en el tab Orden Capas
     * @param param0 
     */
    const reorderLayers  = ({view}) => {
        let toChangeFeaturesLayersDeployed = featuresLayersDeployed;
        const layersMap = view.map.allLayers.toArray()
        const ordenCapas=[]
        layersMap.forEach((layerMap: { id: string; }, item: number) => {
            let existeEnFeaturesLayersDeployed = false;
            toChangeFeaturesLayersDeployed.forEach(FeaLayerDep => {
                if (layerMap.id == FeaLayerDep.layer.id) {
                    existeEnFeaturesLayersDeployed = true;
                }
            })
            if (!existeEnFeaturesLayersDeployed) {
                ordenCapas.push({
                    position: item,
                    layerMap
                })
            }
        })
        const nuevoOrden=[]
        layersMap.forEach((lyrMp: any, item: number) => {
            let existePosicion = false;
            ordenCapas.forEach(ordeCapa => {
                if (item == ordeCapa.position) {
                    nuevoOrden.push(ordeCapa.layerMap)
                    existePosicion = true;
                }
            })
            if (!existePosicion) {
                nuevoOrden.push(toChangeFeaturesLayersDeployed[0].layer);
                toChangeFeaturesLayersDeployed = toChangeFeaturesLayersDeployed.slice(1);
            }
        })
        nuevoOrden.forEach( (layer, i) => view.map.reorder(layer,i));
        // Forzar la actualización de la vista del mapa
        // view.refresh();  // Esta línea fuerza la actualización de la vista del mapa
        view.zoom = view.zoom -0.00000001
    }

    /**
     * Detecta cambio en banderaRefreshCapas y ejecuta la logia reorderLayers siempre y cuando exista la referencia del mapa
     */
    useEffect(() => {
      
        if (varJimuMapView) {
            reorderLayers(varJimuMapView)
        }
    
      return () => {}
    }, [banderaRefreshCapas])
    
    return (
        <div style={{height:'inherit'}}>
            <Tabs>
                <TabList>
                    <Tab>Tabla de contenido</Tab>
                    {
                        capasSelectd.length>0 && <Tab>Orden Capas</Tab>
                    }
                </TabList>

                <TabPanel>
                    <div className="tree-container" onClick={()=>setContextMenu(null)}>
                        <div className="search-bar">
                            
                            <input
                                type="text"
                                placeholder="Buscar capas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='input-search'
                            />                            
                            <div className='btnsSearch'>
                                <Button onClick={()=>setSearchQuery('')} size="sm" type="secondary" >
                                        <ClearOutlined />
                                </Button>
                                {
                                    capasSelectd.length>0 &&
                                        <Button onClick={()=>removeAllLayers()} size="sm" type="secondary" >
                                            <WrongOutlined />
                                        </Button>                                
                                }

                            </div>
                        </div>
                        <div >
                            { renderTree(dataTablaContenido)}
                        </div>
                    </div>
                </TabPanel>
                {
                    capasSelectd.length>0 &&
                        <TabPanel>
                            <div className="checked-layers tab-order-capas">
                                <DragAndDrop items={featuresLayersDeployed} setItems={setFeaturesLayersDeployed} setBanderaRefreshCapas={setBanderaRefreshCapas}/>                               
                            </div>
                        </TabPanel>            
                }
            </Tabs>            
            <ContexMenu contextMenu={contextMenu} setContextMenu={setContextMenu} varJimuMapView={varJimuMapView}/>
        </div>
    );
};
export default Widget_Tree;

/**
     * Buscas las capas que tienen la propiedad @VISIBLE para ser visualidas en el Tab "Orden Capas"
     * @param dataTablaContenido 
     */
const recorreTodasLasCapasTablaContenido = (dataTablaContenido: CapasTematicas[], apagarCapas: boolean = false) => {
    const capasVisibles: ItemResponseTablaContenido[]  = [];
    const clonedDataTablaContenido: CapasTematicas[] = JSON.parse(JSON.stringify(dataTablaContenido));
    const bucleRecursivo = (clonedDataTablaContenido) => {
        clonedDataTablaContenido.map( capa => {
            if (capa.URL && capa.VISIBLE && apagarCapas) {
                capa.VISIBLE = false;
            }
            if (capa.URL && capa.VISIBLE && !apagarCapas) {
                capasVisibles.push(capa);                    
            }
            if (capa.capasHijas) {
                bucleRecursivo(capa.capasHijas);
            }
            if (capa.capasNietas) {
                bucleRecursivo(capa.capasNietas);
            }
            if (capa.capasBisnietos) {
                bucleRecursivo(capa.capasBisnietos);
            }
        })
    };
    bucleRecursivo(clonedDataTablaContenido);
    return {capasVisibles, clonedDataTablaContenido, apagarCapas}
}
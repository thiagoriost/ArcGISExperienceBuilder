import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronDown, FaSearch, FaTimes, FaWindowClose, FaPowerOff } from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FeatureLayer from "esri/layers/FeatureLayer";
import 'rc-slider/assets/index.css'; import 'react-tabs/style/react-tabs.css';
import '../../styles/style.css';
import { CapasTematicas, InterfaceContextMenu, ItemResponseTablaContenido, Tematicas } from '../../types/interfaces';
import { ContexMenu } from './ContexMenu';
import { JimuMapView } from 'jimu-arcgis';

interface Widget_Tree_Props {
    dataTablaContenido:CapasTematicas[];
    varJimuMapView: JimuMapView;
}

const Widget_Tree: React.FC<Widget_Tree_Props> = ({ dataTablaContenido, varJimuMapView }) => {
    const [expandedItems, setExpandedItems] = useState({});
    const [checkedItems, setCheckedItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [capasSelectd, setCapasSelectd] = useState<ItemResponseTablaContenido[]>([]); // para ser renderizadas en el tab "Orden Capas"
    const [contextMenu, setContextMenu] = useState<InterfaceContextMenu>(null);
    const [featuresLayersDeployed, setFeaturesLayersDeployed] = useState([]);

    const handleExpandCollapse = (id: string | number) => {
        setExpandedItems(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const handleCheck = (capa: ItemResponseTablaContenido) => {
        const IDCAPA = capa.capasNietas ? capa.capasNietas[0].IDCAPA : capa.IDCAPA;
        setCheckedItems(prevState => ({ ...prevState, [IDCAPA]: !prevState[IDCAPA], }));
        capa.VISIBLE = !capa.VISIBLE;
        setCapasSelectd(prevState => {
            const newState = prevState.includes(capa) ? prevState.filter(item => item !== capa) : [...prevState, capa];
            return newState;
        });
        capa.VISIBLE ? dibujaCapasSeleccionadas([capa], varJimuMapView) : removerFeatureLayer(capa);
    };

    const handleReset = () => {
        setSearchQuery('');
    };

    const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, capa: ItemResponseTablaContenido) => {
        e.preventDefault();
        if (capa.URL) {
            setContextMenu({
                mouseX: e.clientX + 50,
                mouseY: e.clientY - 70,
                capa
            });
        }
    };

    const Nodo = ({ capa, level = 0 }) => {
        const isExpanded = expandedItems[capa.IDTEMATICA];
        const hasChildren =
            (capa.capasHijas?.length >= 1) ||
            (capa.capasNietas?.length > 0 && capa.IDTEMATICAPADRE > 0) ||
            (capa.capasBisnietos?.length >= 1);

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
            <div style={{ marginLeft: level * 20 + 'px' }} onContextMenu={(e) => handleRightClick(e, capa)}>
                <div>
                    <span onClick={() => handleExpandCollapse(capa.IDTEMATICA)} style={{ cursor: 'pointer' }}>
                        {hasChildren ? (isExpanded ? <FaChevronDown /> : <FaChevronRight />) : null}
                    </span>
                    {
                        ((capa.URL || (capa.capasNietas?.length < 2 && capa.IDTEMATICAPADRE == 0))) ? (
                            <input
                                type="checkbox"
                                checked={!!checkedItems[isChecked]}
                                onChange={() => handleCheck(capa)}
                            />
                        ) : null
                    }
                    {displayName}
                </div>
                {isExpanded && hasChildren && renderChildren()}
            </div>
        );
    };
    
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
                console.log({existingNode})
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
      
        return filtereddataTablaContenido;
      };
      
    /**
     * Recibe la data tabla contenido e inicia la logica, pasando primero por el filtrado de capas y despues mapa la respuesta del
     * filtro y renderizar los nodos
     * @param dataTablaContenido 
     * @returns componente Nodo donde renderizara, tematica padre, tematicas y/o capas hijas, tematicas y/o capas nietas y capas bisnietas
     */
    const renderTree = (dataTablaContenido: CapasTematicas[]) => {        
        const filteredDataTablaContenido = filterdataTablaContenido(dataTablaContenido);
        console.log(filteredDataTablaContenido)
        
        return filteredDataTablaContenido.map((capa: Tematicas) => (
            <Nodo key={capa.IDTEMATICA} capa={capa} />
        ));

    };

    const dibujaCapasSeleccionadas = (capasToRender: ItemResponseTablaContenido[], varJimuMapView: JimuMapView) => {

        console.log(capasToRender)
        capasToRender.forEach(capa =>{
            const url = capa.URL?capa.URL:capa.capasNietas[0].URL;
            const nombreCapa = capa.NOMBRECAPA?capa.NOMBRECAPA:capa.capasNietas[0].NOMBRECAPA
            const layer = new FeatureLayer({
                url: `${url}/${nombreCapa}`
            });
            varJimuMapView.view.map.add(layer);
            setFeaturesLayersDeployed(features => [...features,{capa,layer}]);
        });
    }

    const removerFeatureLayer = (capa: ItemResponseTablaContenido) => {
        const {layer} = featuresLayersDeployed.filter(({capa:capaDeployed}) => capaDeployed.IDCAPA == capa.IDCAPA)[0];
        varJimuMapView.view.map.remove(layer);
        setFeaturesLayersDeployed(featuresLayersDeployed.filter(item => item.capa.IDCAPA != capa.IDCAPA));
        console.log(capasSelectd)
        console.log(featuresLayersDeployed)
    }

    const removeAllLayers = () => {
        
        capasSelectd.forEach(capa => handleCheck(capa));

    }

    useEffect(() => {
        const capasVisibles = recorreTodasLasCapasTablaContenido(dataTablaContenido);
        setCapasSelectd( capasVisibles );
        dibujaCapasSeleccionadas(capasVisibles, varJimuMapView);        
        return () => {}
    }, [dataTablaContenido])
    
    useEffect(() => {
        console.log({varJimuMapView})
      
    
      return () => {
        
      }
    }, [varJimuMapView])
    
    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>Tabla de contenido</Tab>
                    {
                        capasSelectd.length>0 && <Tab>Orden Capas</Tab>
                    }
                </TabList>

                <TabPanel>
                    <div className="tree-container" style={{ maxHeight: '500px', overflowY: 'auto', padding: '20px', backgroundColor: '#FEFFD2', color: '#FF7D29' }}>
                        <div className="search-bar" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <FaSearch style={{ marginRight: '10px' }} />
                            <input
                                type="text"
                                placeholder="Buscar capas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <button onClick={handleReset} style={{ marginLeft: '10px', padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
                                <FaTimes />
                            </button>
                            {
                                capasSelectd.length>0 &&
                                <button onClick={()=>removeAllLayers()} style={{ marginLeft: '10px', padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
                                    <FaPowerOff />
                                </button>
                            }
                            

                        </div>
                        <div >
                            { renderTree(dataTablaContenido)}
                        </div>
                    </div>
                </TabPanel>
                {
                    capasSelectd.length>0 &&
                        <TabPanel>
                            <div className="checked-layers" style={{ padding: '20px', backgroundColor: '#f8f9fa', color: '#FF7D29' }}>
                                <ul>
                                    {capasSelectd.map(capa => (
                                        <>
                                            <li key={capa.IDCAPA}>{capa.NOMBRETEMATICA} - {capa.TITULOCAPA}</li>
                                            <hr />
                                        </>
                                    ))}
                                </ul>
                            </div>
                        </TabPanel>            
                }
            </Tabs>            
            <ContexMenu contextMenu={contextMenu} setContextMenu={setContextMenu}/>
        </>
);
};
export default Widget_Tree;


/**
     * Buscas las capas que tienen la propiedad @VISIBLE para ser visualidas en el Tab "Orden Capas"
     * @param dataTablaContenido 
     */
const recorreTodasLasCapasTablaContenido = (dataTablaContenido: CapasTematicas[]) => {

    const capasVisibles: ItemResponseTablaContenido[]  = [];

    const bucleRecursivo = (dataTablaContenido) => {
        for (const capa of dataTablaContenido) {

        if (capa.URL && capa.VISIBLE) {
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
        }
    };
    
    bucleRecursivo(dataTablaContenido);
    console.log({capasVisibles})
    // setCapasSelectd(capasVisibles);
    return capasVisibles
}
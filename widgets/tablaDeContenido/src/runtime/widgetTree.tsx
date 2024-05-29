import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronDown, FaSearch } from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const Widget_Tree = ({ nodes }) => {
    const [expandedItems, setExpandedItems] = useState({});
    const [checkedItems, setCheckedItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const handleExpandCollapse = (id) => {
        setExpandedItems(prevState => ({
        ...prevState,
        [id]: !prevState[id],
        }));
    };

    const handleCheck = (capa) => {
        const capaTemp = capa.capasNietas ? capa.capasNietas[0].IDCAPA : capa.IDCAPA;
        setCheckedItems(prevState => ({
        ...prevState,
        [capaTemp]: !prevState[capaTemp],
        }));
    };

    const Node = ({ node, level = 0 }) => {
        const isExpanded = expandedItems[node.IDTEMATICA];
        const hasChildren =
        (node.capasHijas?.length >= 1) ||
        (node.capasNietas?.length > 0 && node.IDTEMATICAPADRE > 0) ||
        (node.capasBisnietos?.length >= 1);

        const isChecked = node.capasNietas ? node.capasNietas[0].IDCAPA : node.IDCAPA;

        const displayName = ((node.capasHijas?.length >= 1)
            || (node.capasNietas?.length > 1)
            || (node.capasBisnietos?.length >= 1)
            || (node.IDTEMATICAPADRE > 0 && !node.URL))
                ? node.NOMBRETEMATICA
                : node.TITULOCAPA;

        const renderChildren = () => (
        <>
            {node.capasHijas && node.capasHijas.map(child => (
                <Node key={child.IDTEMATICA} node={child} level={level + 1} />
            ))}
            {node.capasNietas && node.capasNietas.map(child => (
                <Node key={child.IDTEMATICA} node={child} level={level + 1} />
            ))}
            {node.capasBisnietos && node.capasBisnietos.map(child => (
                <Node key={child.IDTEMATICA} node={child} level={level + 1} />
            ))}
        </>
        );

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
                {displayName}
            </div>
            {isExpanded && hasChildren && renderChildren()}
        </div>
        );
    };

    const renderTree = (nodes) => {
        
        return nodes.filter(node => {
                console.log(node)
                console.log((node.TITULOCAPA.toLowerCase().includes(searchQuery.toLowerCase()) && node.URL), searchQuery)
                return (node.TITULOCAPA.toLowerCase().includes(searchQuery.toLowerCase()) && !node.URL)
            }
        ).map(node => (
            <Node key={node.IDTEMATICA} node={node} />
        ));
    };

    return (
        <Tabs>
        <TabList>
            <Tab>Tabla de contenido</Tab>
            <Tab>Orden Capas</Tab>
        </TabList>

        <TabPanel>
            <div className="tree-container" style={{ maxHeight: '500px', overflowY: 'auto', padding: '20px', backgroundColor: '#FFBF78', color:'black' }}>
                <div className="search-bar" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <FaSearch style={{ marginRight: '10px' }} />
                    <input
                        type="text"
                        placeholder="Buscar capas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                {renderTree(nodes)}
            </div>
        </TabPanel>
        <TabPanel>
            <div className="checked-layers" style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
                <h2>Capas seleccionadas</h2>
                <ul>
                    {/* {Object.keys(checkedItems).map(key => (
                    checkedItems[key] && (
                        <li key={key}>
                        {nodes.find(node => node.IDCAPA === parseInt(key)).TITULOCAPA}
                        </li>
                    )
                    ))} */}
                </ul>
            </div>
        </TabPanel>
        </Tabs>
    );
};

export default Widget_Tree;
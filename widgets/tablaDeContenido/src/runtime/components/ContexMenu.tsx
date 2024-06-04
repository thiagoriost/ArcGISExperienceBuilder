import { Slider } from 'jimu-ui';
import React, { ChangeEvent } from 'react'
import FeatureLayer from "esri/layers/FeatureLayer";
import { JimuMapView } from 'jimu-arcgis';
import { InterfaceContextMenu } from '../../types/interfaces';

interface ContexMenu_Props {
    contextMenu: InterfaceContextMenu;
    varJimuMapView: JimuMapView;
    setContextMenu?: any;
}

export const ContexMenu: React.FC<ContexMenu_Props> = ({contextMenu, setContextMenu, varJimuMapView}) => {

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleMetadataClick = () => {
        console.log(`Metadatos de la capa: ${contextMenu.capa_Feature.capa.TITULOCAPA}`, contextMenu.capa_Feature.capa);
        handleCloseContextMenu();
    };

    const handleChangeSlider = ({target}: ChangeEvent<HTMLInputElement>): void => {
        contextMenu.capa_Feature.layer.opacity = Number(target.value)/10;
    }

  return (
    <>
        {
            contextMenu && (
                <div
                    style={{
                        position: 'absolute',
                        top: contextMenu.mouseY,
                        left: contextMenu.mouseX,
                        backgroundColor: 'white',
                        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        padding: '10px',
                        borderRadius: '5px',
                        color: 'black'
                    }}
                >
                    {contextMenu.capa_Feature.capa.VISIBLE && <Slider defaultValue={10} onChange={handleChangeSlider} size='sm' min={0} max={10} step={1}/>}
                    
                    <p onClick={handleMetadataClick}>Metadato Capa</p>
                    <p>Metadato Servicio</p>
                    <button onClick={handleCloseContextMenu} style={{ marginLeft: '10px', padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
                                cerrar
                            </button>
                </div>
            )
        }
    </>



  )
}

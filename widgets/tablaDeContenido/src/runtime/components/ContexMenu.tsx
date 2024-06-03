import { Slider } from 'jimu-ui';
import React, { ChangeEvent } from 'react'

export const ContexMenu = ({contextMenu, setContextMenu}) => {

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleMetadataClick = () => {
        console.log(`Metadatos de la capa: ${contextMenu.capa.TITULOCAPA}`, contextMenu.capa);
        handleCloseContextMenu();
    };

    const handleChangeSlider = ({target}: ChangeEvent<HTMLInputElement>): void => {
        console.log(parseInt(target.value))
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
                    {contextMenu.capa.VISIBLE && <Slider defaultValue={0} onChange={handleChangeSlider} size='sm' step={10}/>}
                    
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

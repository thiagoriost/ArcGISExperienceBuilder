import { Slider } from 'jimu-ui';
import React, { ChangeEvent, useEffect } from 'react'
import { JimuMapView } from 'jimu-arcgis';
import { InterfaceContextMenu } from '../../types/interfaces';
import { CloseCircleOutlined } from 'jimu-icons/outlined/editor/close-circle'
import '../../styles/styles_ContexMenu.css'

interface ContexMenu_Props {
    contextMenu: InterfaceContextMenu;
    varJimuMapView: JimuMapView;
    setContextMenu?: any;
}

/**
 * 
 * @param param0 
 * @returns 
 */
export const ContexMenu: React.FC<ContexMenu_Props> = ({contextMenu, setContextMenu, varJimuMapView}) => {


    /**
     * 
     * @param param0 
     */
    const handleChangeSlider = ({target}: ChangeEvent<HTMLInputElement>): void => {
        contextMenu.capa_Feature.layer.opacity = Number(target.value)/10;
    }

    const abrirMetadata = (url: string) => {        
        console.log({url})
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    useEffect(() => {
      
        console.log({contextMenu})
      return () => {}
    }, [contextMenu])
    

  return (
    <>
        {
            (contextMenu && (contextMenu?.capa_Feature?.capa.METADATOCAPA || contextMenu?.capa_Feature?.capa.METADATOSERVICIO || contextMenu.capa_Feature.capa.VISIBLE)) && (
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
                    <div className='row_contextmenu'>
                        <CloseCircleOutlined size='m' color='red' onClick={()=>setContextMenu(null)} className='pointer'/>
                        <p>{contextMenu.capa_Feature.capa.TITULOCAPA}</p>
                    </div>
                    <hr />
                    {
                        contextMenu.capa_Feature.capa.VISIBLE && 
                            <>
                                <Slider defaultValue={10} onChange={handleChangeSlider} size='sm' min={0} max={10} step={1}/>
                                <hr />
                            </>
                    }
                    {
                        contextMenu.capa_Feature.capa.METADATOCAPA &&
                            <p className='pointer' onClick={()=>abrirMetadata(contextMenu.capa_Feature.capa.METADATOCAPA)}>Metadato Capa</p>
                    }
                    {
                        contextMenu.capa_Feature.capa.METADATOSERVICIO &&
                            <p className='pointer' onClick={()=>abrirMetadata(contextMenu.capa_Feature.capa.METADATOSERVICIO)}> Metadato Servicio</p>                    
                    }
                </div>
            )
        }
    </>



  )
}

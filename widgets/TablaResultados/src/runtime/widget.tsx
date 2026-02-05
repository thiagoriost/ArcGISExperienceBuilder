import { React, type AllWidgetProps } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis' // The map object can be accessed using the JimuMapViewComponent
import { useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader } from "jimu-ui";
import { DataGrid } from "@mui/x-data-grid";
import webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils';
import { pathDataGridSIEC } from '../types/dataDG';





const TablaResultados = (props: AllWidgetProps<any>) => {

  const {view, files, setResponseBusquedaFirma, setControlForms, setFiles, setModalHeadState, setModalBodyState,
     /* rows, */
  } = props
  const [utilsModule, setUtilsModule] = useState(null)
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>()
  const [initialExtent, setInitialExtent] = useState(null)
  const [paginationModel, setPaginationModel]=useState({
      pageSize: 5,
      page: 0
    })
  const [modalDetail, setModalDetail] = useState(false);
  const [modalBody, setModalBody] = useState({})
  const [modalHead, setModalHead] = useState("")
  const [rows, setRows] = useState([])


//   const rows = JSON.parse(rowsMock)

    
  

  
  //https://developers.arcgis.com/experience-builder/guide/add-layers-to-a-map/
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (utilsModule?.logger()) console.log('Ingresando al evento objeto JimuMapView...')
    if (jmv) {
      setJimuMapView(jmv)
      setInitialExtent(jmv.view.extent) // Guarda el extent inicial
    }
  }

  function limpiarCapaMapa(){
    setResponseBusquedaFirma(null);      
    console.log("Obj Geometria =>",view);      
    if (view){
        jimuMapView.view.map.remove(view);
    }
  }

  const convertBase64 = function(file){
      //Objeto de prueba -- 2025-04-11
      file = {
          path:"C:\\SIGSIEC24\\firmas\\93_1",
          name:"FE_Campo_4_txtFirmaTEST_20240923_0920.txt"
      }
      var arrayFiles = [];
      return new Promise ((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);

          fileReader.onload = function() {
              resolve(fileReader.result);
              var base64Str = fileReader.result;
              arrayFiles.push({base64: base64Str, nombre: file.name});
          };

          fileReader.onerror = function(error){
              reject(error);
          }
      });
      //Se setea el state de archivos
      setFiles([...files, arrayFiles]);
  }

  const retornarFormulario = function() {
    if (view){
        limpiarCapaMapa();
    }
    setControlForms(false);
  }

  const downZipFirma = function(row){
    console.log("Prueba de ingreso a descarga...");
    convertBase64("FE_Campo_4_txtFirmaTEST_20240923_0920.txt");
    console.log("Files =>",files);
  }

  const setHeadModal = function(row){
      var headJSON = {
          "codSig": row.codSig
      }
      var headHTMLModal = "Firma asociada"+" "+headJSON.codSig;
      setModalHead(headHTMLModal);
  }

  const setBodyModal = function (row){
      //Conversión geometría del servicio rectangulares => decimales (Latitud, Longitud)
      var geomLatLon = webMercatorUtils.xyToLngLat(row.pointX, row.pointY);
      var bodyJSON = {
          "campa_a": row.camp,
          "ubic": row.locat,
          "proj": row.proj,
          "tMues": row.type,
          "altCover": row.alsnm,
          "instrum": row.ins,
          "ubicLat": geomLatLon[0].toFixed(3),
          "ubicLon": geomLatLon[1].toFixed(3),
          "fileSig": row.phSig
      }
      setModalBody(bodyJSON);
  }

  const openCloseModalDetail = function(row){
        console.log("Invocación Modal...",modalDetail);
        console.log("Row =>",row);
        setModalDetail(!modalDetail);
        
        //Head
        setHeadModal(row);
        
        //Body
        setBodyModal(row);
    }

  const columnsSrcSIEC = [
    {field:"id", headerName:"Object Id", width: 78},    
    {field:"type", headerName:"Cobertura", width: 150},
    {field:"codSig", headerName:"Código Firma", width: 240},
    {field:"ins", headerName:"Instrumento", width: 340},
    {field:"alsnm", headerName:"Altura snm",width: 100},
    {field:"proj", headerName:"Proyecto", width: 240},
    {field:"camp", headerName:"Campaña", width: 160},
    {field:"locat", headerName:"Ubicación", width: 340},
    {field:"phSig", headerName:"Archivo firma", width: 450},
    {field:"speInteg", headerName:"% pureza", width: 90},
    {field:"oper", headerName:"Operaciones", width: 220,
        sortable: false, 
        renderCell: ({ row }) => 
        <>
            <Button type="primary" onClick={() => downZipFirma(row)}>Descarga</Button>&nbsp;&nbsp;
            <Button type="primary" onClick={() => openCloseModalDetail(row)}>Detalles</Button>
        </>
    }
  ]

  useEffect(() => {
    if (props.hasOwnProperty('stateProps')) {
        const dataFromDispatch = JSON.parse(props.stateProps.dataFromDispatchWidget_searchSIEC)
        console.log(props, dataFromDispatch)
        setRows(dataFromDispatch.dataToRows)
    }
  
    return () => {}
  }, [props])
  

  useEffect(() => {
      // setResponseConsulta(dataPruebaResponse)
      import('../../../utils/module').then(modulo => { setUtilsModule(modulo) })
      return () => {
        // Acción a realizar cuando el widget se cierra.
        if (utilsModule?.logger()) console.log('El widget se cerrará')
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


  return (
    <div className='w-100 p-3 bg-primary'>
          {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
            <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
          )}

          {
            rows.length > 0 &&
            <>
                <Button size="sm" className="mb-1" type="primary" onClick={()=>console.log("retornarFormulario")}>
                    Tabla Resultados</Button>                   
                <DataGrid 
                    sx={{'.MuiTablePagination-root':
                        {color: '#126a92', backgroundColor: '#ffff'},
                        '.css-yseucu-MuiDataGrid-columnHeaderRow':
                        {color: '#126a92', backgroundColor: '#ffff'},
                        '.css-11dqcl8-MuiDataGrid-virtualScrollerRenderZone':
                        {color: '#126a92', backgroundColor: '#ffff'},
                    }}
                    className="css-1hr2sou-MuiTablePagination-root MuiTablePagination-root"
                    columns={columnsSrcSIEC} 
                    rows={rows}
                    pagination
                    pageSizeOptions={[2,5,8,10]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}            
                />
                <Modal
                    isOpen={modalDetail}            
                    unmountOnClose            
                >
                    <ModalHeader className="closeDet header" id="headerDet">
                        <label className="label">{modalHead}</label>
                        <Button className="closeBtn app-root-emotion-cache-ltr-xg0zwy" onClick={openCloseModalDetail}>x</Button>
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <div className="row">
                                <label className="projLab">Proyecto {modalBody.proj}</label>
                                <label className="campLab">Campaña {modalBody.campa_a}</label>
                            </div>
                            <div>
                                <label>Ubicación:</label>
                                <span className="ubicSpan">{modalBody.ubic}</span>
                            </div>
                            <div className="ubicaDataMues">
                                <label>Datos de la Muestra</label>                
                            </div>
                            <div>
                                <label>Tipo:</label>
                                <span className="tMuesSpan">{modalBody.tMues}</span>
                            </div>
                            <div>
                                <label>Altura promedio de la cobertura:</label>
                                <span className="altCoverSpan">{modalBody.altCover} m</span>                    
                            </div>
                            <div className="column">
                                <label>Instrumento:</label>
                                <span className="insSpan">{modalBody.instrum}</span>
                            </div>
                            <div className="ubicaSignDiv">
                                <label>Ubicación de la firma (Coordenadas decimales)</label>
                            </div>
                            <div>
                                <label>Latitud:</label>
                                <span className="latSpan">{modalBody.ubicLat}</span><br/>
                                <label>Longitud:</label>
                                <span className="lonSpan">{modalBody.ubicLon}</span>
                            </div>
                            <div>
                                <label>Altura de la vegetación:</label>
                                <span className="altCovSpan">{modalBody.altCover} m</span> 
                            </div>
                            <div className="column ubicaImgFile">
                                <label>Imagenes</label>
                            </div>
                            <div className="column">
                                <label>Archivo asociado</label>
                            </div>
                            <div className="column ubicaImgFile">
                                <span className="imgSIECSpan">
                                    <a href={`${pathDataGridSIEC.path}/images/${pathDataGridSIEC.folder}/${modalBody.fileSig}`} target="_blank" title="Para visualizar imagen" ><img className="imgSIEC" src={`${pathDataGridSIEC.path}/images/${pathDataGridSIEC.folder}/${modalBody.fileSig}`} alt="Img prueba"></img></a>
                                </span>
                                <span className="fileSpan"> {modalBody.fileSig}</span>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </> 
        }
    </div>
  )
}

export default TablaResultados


const rowsMock = '[{"id":32,"type":"Tipo B","codSig":"FIR-002","ins":"Instrumento B","alsnm":1200,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"photo_002.jpg","speInteg":98.5},{"id":38,"type":"Tipo B","codSig":"Envio_Firma_09","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"","speInteg":1},{"id":39,"type":"Tipo B","codSig":"Envio_Firma_09","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"","speInteg":1},{"id":40,"type":"Tipo B","codSig":"Envio_Firma_09","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"","speInteg":1},{"id":41,"type":"Tipo B","codSig":"Envio_Firma_09","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"","speInteg":1},{"id":42,"type":"Tipo B","codSig":"Envio_Firma_09","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"photo_002.png","speInteg":1},{"id":43,"type":"Tipo B","codSig":"CM_Firma_01","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"","speInteg":1},{"id":44,"type":"Tipo B","codSig":"CM_Firma_03","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":45,"type":"Tipo B","codSig":"CM_Firma_04","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":46,"type":"Tipo B","codSig":"CM_Firma_05","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":47,"type":"Tipo B","codSig":"CM_Firma_06","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":48,"type":"Tipo B","codSig":"CM_Firma_06","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":49,"type":"Tipo B","codSig":"CM_Firma_07","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":21,"type":"Tipo B","codSig":"mi_nueva_firma","ins":"Instrumento B","alsnm":1200,"proj":"Alianzas Productivas","camp":"SIGE_CAM_V","locat":"002 (02)","phSig":"photo_002.jpg","speInteg":98.5,"pointX":1942525.114342629,"pointY":7801107.278828605},{"id":66,"type":"Tipo B","codSig":"FIR-002","ins":"Instrumento B","alsnm":1200,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"photo_002.jpg","speInteg":98.5,"pointX":-8246547.877965705,"pointY":513737.4541411238},{"id":2,"type":"Tipo B","codSig":"FIR-002","ins":"Instrumento B","alsnm":1200,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"photo_002.jpg","speInteg":98.5,"pointX":-8246547.877965705,"pointY":513737.4541411238},{"id":89,"type":"Tipo B","codSig":"FIR-002","ins":"Instrumento B","alsnm":1200,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"photo_002.jpg","speInteg":98.5},{"id":90,"type":"Tipo B","codSig":"FIR-002","ins":"Instrumento B","alsnm":1200,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"photo_002.jpg","speInteg":98.5},{"id":-90,"type":"Tipo B","codSig":"FIR-002","ins":"Instrumento B","alsnm":1200,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"photo_002.jpg","speInteg":98.5},{"id":27,"type":"Tipo B","codSig":"FIR-002","ins":"Instrumento B","alsnm":1200,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"photo_002.jpg","speInteg":98.5},{"id":28,"type":"Tipo B","codSig":"FIR-002","ins":"Instrumento B","alsnm":1200,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"photo_002.jpg","speInteg":98.5},{"id":50,"type":"Tipo B","codSig":"CM_Firma_05","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":51,"type":"Tipo B","codSig":"CM_Firma_08","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":52,"type":"Tipo B","codSig":"CM_Firma_10","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":53,"type":"Tipo B","codSig":"CM_Firma_10","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":73,"type":"Tipo B","codSig":"CM_Firma_10","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":37,"type":"Tipo B","codSig":"Envio_Firma_08","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"ALI CAM 2 EDT","locat":"17001 (Caldas)","phSig":"","speInteg":1,"pointX":-8393755.938362462,"pointY":564690.0297813605},{"id":33,"type":"Tipo B","codSig":"FIR-002","ins":"Instrumento B","alsnm":1200,"proj":"Proyecto B","camp":"Campaña Y","locat":"Manizales (Caldas)","phSig":"photo_002.jpg","speInteg":98.5,"pointX":-8406041.361860314,"pointY":564855.0008075421},{"id":74,"type":"Tipo B","codSig":"CM_Firma_11","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":75,"type":"Tipo B","codSig":"CM_Firma_12","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":76,"type":"Tipo B","codSig":"CM_Firma_01","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":77,"type":"Tipo B","codSig":"CM_Firma_02","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":78,"type":"Tipo B","codSig":"CM_Firma_01","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":79,"type":"Tipo B","codSig":"CM_Firma_02","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":80,"type":"Tipo B","codSig":"CM_Firma_03","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":81,"type":"Tipo B","codSig":"CM_Firma_01","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":82,"type":"Tipo B","codSig":"CM_Firma_02","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":83,"type":"Tipo B","codSig":"CM_Firma_01","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":84,"type":"Tipo B","codSig":"CM_Firma_02","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":85,"type":"Tipo B","codSig":"CM_Firma_03","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":160,"type":"Tipo B","codSig":"1729713003418","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":169,"type":"Tipo B","codSig":"CM_Firma_03","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":170,"type":"Tipo B","codSig":"CM_Firma_66","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":173,"type":"Tipo B","codSig":"CM_Firma_11","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":185,"type":"Tipo B","codSig":"CM_Firma_2510202415","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":174,"type":"Tipo B","codSig":"CM_Firma_11","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":175,"type":"Tipo B","codSig":"CM_Firma_11","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":176,"type":"Tipo B","codSig":"CM_Firma_11","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":177,"type":"Tipo B","codSig":"CM_Firma_2510202402","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":186,"type":"Tipo B","codSig":"CM_Firma_2510202416","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":178,"type":"Tipo B","codSig":"CM_Firma_2510202403","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":179,"type":"Tipo B","codSig":"CM_Firma_2510202404","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":180,"type":"Tipo B","codSig":"CM_Firma_2510202406","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":181,"type":"Tipo B","codSig":"CM_Firma_2510202407","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":182,"type":"Tipo B","codSig":"CM_Firma_2510202408","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":183,"type":"Tipo B","codSig":"CM_Firma_2510202409","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":184,"type":"Tipo B","codSig":"CM_Firma_2510202410","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":187,"type":"Tipo B","codSig":"CM_Firma_2510202418","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":188,"type":"Tipo B","codSig":"CM_Firma_2510202419","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":189,"type":"Tipo B","codSig":"CM_Firma_2510202420","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":190,"type":"Tipo B","codSig":"CM_Firma_2510202421","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":191,"type":"Tipo B","codSig":"CM_Firma_2510202422","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":192,"type":"Tipo B","codSig":"CM_Firma_2510202424","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":193,"type":"Tipo B","codSig":"CM_Firma_2510202425","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":194,"type":"Tipo B","codSig":"CM_Firma_2510202426","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":195,"type":"Tipo B","codSig":"CM_Firma_2510202427","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":196,"type":"Tipo B","codSig":"CM_Firma_2510202428","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":197,"type":"Tipo B","codSig":"CM_Firma_2510202429","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":202,"type":"Tipo B","codSig":"CM_Firma_2510202430","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":203,"type":"Tipo B","codSig":"CM_Firma_2510202432","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":204,"type":"Tipo B","codSig":"CM_Firma_2510202433","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":205,"type":"Tipo B","codSig":"CM_Firma_2510202436","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":206,"type":"Tipo B","codSig":"CM_Firma_2510202437","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":207,"type":"Tipo B","codSig":"CM_Firma_2510202438","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":208,"type":"Tipo B","codSig":"CM_Firma_2510202439","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":209,"type":"Tipo B","codSig":"CM_Firma_2510202801","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":210,"type":"Tipo B","codSig":"CM_Firma_2510202802","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1},{"id":211,"type":"Tipo B","codSig":"CM_Firma_2510202803","ins":"Instrumento B","alsnm":21,"proj":"Proyecto B","camp":"Campaña Y","locat":"002 (02)","phSig":"PhotoCoverage","speInteg":1}]'
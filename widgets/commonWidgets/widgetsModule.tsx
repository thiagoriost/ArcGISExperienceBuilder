import React from "react"
import TablaResultados from "./TablaResultados/TablaResultados"
import InputSelect from "./InputSelect/InputSelect"
import InputTextArea from "./InputTextArea/InputTextArea"
import ModalComponent from "./modal/ModalComponent"
import TabIndicadores from "./TabIndicadores/TabIndicadores"



const TABLARESULTADOS = ({rows, columns, jimuMapView, lastGeometriDeployed,
    LayerSelectedDeployed, graphicsLayerDeployed ,setLastGeometriDeployed,
    setMostrarResultadoFeaturesConsulta}) => (
    <TablaResultados
        rows={rows}
        columns={columns}
        jimuMapView={jimuMapView}
        lastGeometriDeployed={lastGeometriDeployed}
        LayerSelectedDeployed={LayerSelectedDeployed} 
        graphicsLayerDeployed={graphicsLayerDeployed}
        setLastGeometriDeployed={setLastGeometriDeployed}
        setMostrarResultadoFeaturesConsulta={setMostrarResultadoFeaturesConsulta}
    />
)

const INPUTSELECT = (dataArray, onChange, value, label, campo) => (
    <InputSelect dataArray={dataArray} onChange={onChange}
        value={value} label={label} campo={campo}
    />
)

const INPUT_TEXTAREA = (value, onChange, label) => (
    <InputTextArea
        value={value}
        onChange={onChange}
        label={label}
    />
)
/**
 * 
 * @param mensajeModal {deployed:boolean, tittle: string, body:string, type:, subBody:string}
 * @param setMensajeModal 
 * @returns 
 */
const MODAL = (mensajeModal, setMensajeModal) => (
    <ModalComponent
        mensajeModal={mensajeModal}
        setMensajeModal={setMensajeModal}
    />
)

const FILTROS_INDICADORES = (dispatch, departamentos, jimuMapView) => (
    <TabIndicadores dispatch={dispatch} departamentos={departamentos} jimuMapView={jimuMapView}/>
)



export {
    TABLARESULTADOS,
    INPUTSELECT,
    INPUT_TEXTAREA,
    MODAL,
    FILTROS_INDICADORES
}
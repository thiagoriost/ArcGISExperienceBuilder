import React from "react"
import TablaResultados from "./TablaResultados/TablaResultados"
import InputSelect from "./InputSelect/InputSelect"
import InputTextArea from "./InputTextArea/InputTextArea"
import ModalComponent from "./modal/ModalComponent"



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

const INPUTSELECT = (dataArray, onChange, value, label) => (
    <InputSelect dataArray={dataArray} onChange={onChange}
        value={value} label={label} 
    />
)

const INPUT_TEXTAREA = (value, onChange, label) => (
    <InputTextArea
        value={value}
        onChange={onChange}
        label={label}
    />
)

const MODAL = (mensajeModal, setMensajeModal) => (
    <ModalComponent
        mensajeModal={mensajeModal}
        setMensajeModal={setMensajeModal}
    />
)



export {
    TABLARESULTADOS,
    INPUTSELECT,
    INPUT_TEXTAREA,
    MODAL
}
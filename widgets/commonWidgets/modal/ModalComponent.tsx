
import { React} from "jimu-core";
import { Button, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Alert } from 'jimu-ui'; // import components
import { interfaceMensajeModal } from "./interfaces";
import './style.css'


interface Modal_Props {
    mensajeModal: interfaceMensajeModal;
    setMensajeModal: any;
}

/**
 * Renderiza el modal, los metododos comentados quedean pendientes para futuras mejoras comportamiento
 * @param param0 
 * @returns 
 */
const ModalComponent: React.FC<Modal_Props> = ({mensajeModal, setMensajeModal}) => {
  return (
    <div>
        <Modal
            // onClosed={()=>{console.log(111)}}
            // onEnter={()=>{console.log(222)}}
            // onExit={()=>{console.log(3333)}}
            // onOpened={()=>{console.log(444)}}
            toggle={(e)=>{console.log(e); setMensajeModal({...mensajeModal, deployed:false})}}
            isOpen={mensajeModal.deployed}
            >
            <ModalHeader
                closeIcon={<Icon icon="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; fill=&quot;none&quot; viewBox=&quot;0 0 16 16&quot;><path fill=&quot;#000&quot; d=&quot;m8.745 8 6.1 6.1a.527.527 0 1 1-.745.746L8 8.746l-6.1 6.1a.527.527 0 1 1-.746-.746l6.1-6.1-6.1-6.1a.527.527 0 0 1 .746-.746l6.1 6.1 6.1-6.1a.527.527 0 0 1 .746.746z&quot;></path></svg>" />}
                toggle={(e)=>{setMensajeModal({...mensajeModal, deployed:false})}}
            >
                {mensajeModal.tittle}
            </ModalHeader>
            <ModalBody>
                <Alert
                    aria-live="polite"
                    buttonType="default"
                    // closable
                    form="basic"
                    onClose={function noRefCheck(){}}
                    open
                    size="medium"
                    text={mensajeModal.body}
                    type={mensajeModal.type}
                    withIcon
                />
                {
                    mensajeModal.subBody && 
                        <Alert
                        aria-live="polite"
                        buttonType="default"
                        // closable
                        form="basic"
                        onClose={function noRefCheck(){}}
                        open
                        size="medium"
                        text={mensajeModal.subBody}
                        type="info"
                        withIcon
                        className="mt-2"
                        />
                }
                    
                </ModalBody>
            <ModalFooter>
                <Button onClick={(e)=>{console.log(e); setMensajeModal({...mensajeModal, deployed:false})}}>
                    X
                </Button>
                {' '}
               {/*  <Button
                onClick={(e)=>{console.log(e); setMensajeModal('')}}
                type="primary"
                >
                Do Something
                </Button> */}
                {/* <Label>Intituto Geográfico Agustin Codazzy</Label> */}
            </ModalFooter>
        </Modal>
    </div>
  )
}

export default ModalComponent
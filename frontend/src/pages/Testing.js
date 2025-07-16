import React from 'react'
import { Modal } from 'react-bootstrap'
import ChatBoxx from '../components/ChatBoxx'

function Testing(props) {
    return (
        <div>
            <Modal show={props.showChatBox} size='xl' onHide={() => props.setShowChatBox(false)} scrollable backdrop="static">
                <Modal.Header closeButton>
                    <h4>Friends Zone</h4>
                </Modal.Header>
                <Modal.Body>
                    <ChatBoxx/>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Testing

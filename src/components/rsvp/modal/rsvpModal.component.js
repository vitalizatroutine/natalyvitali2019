import React, {Component} from 'react';
import Modal from 'react-modal';
import './rsvpModal.component.css';

class RSVP extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }


    handleOpenRsvpModal = () => {
        this.setState({
            isOpen: true
        });
    };

    handleCloseRsvpModal = () => {
        this.setState({
            isOpen: false
        });
    };

    render() {
        const {isOpen} = this.state;

        return (
            <div className='rsvp rsvp--fixed'>
                <div className='rsvp_toggle' onClick={this.handleOpenRsvpModal}>
                    <button className='button button--teal button--tall'>RSVP</button>
                </div>
                <Modal
                    isOpen={isOpen}
                    onRequestClose={this.handleCloseRsvpModal}
                    portalClassName={`modal modal--general ${isOpen ? 'modal--open' : ''}`}
                    className='modal_container'
                    overlayClassName='modal_mask'
                    bodyOpenClassName='body--modal-open'
                    htmlOpenClassName='html--modal-open'
                >
                    <p>Rsvp</p>
                </Modal>
            </div>
        );
    }
}

export default RSVP;
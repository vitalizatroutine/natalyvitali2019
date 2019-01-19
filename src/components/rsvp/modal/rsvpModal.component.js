import React, {Component} from 'react';
import Button from '../../button/button.component';
import Modal from '../../modal/modal.component';
import './rsvpModal.component.css';

class RSVP extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false
        };
    }


    handleOpenModal = () => {
        this.setState({
            isModalOpen: true
        });
    };

    handleCloseModal = () => {
        this.setState({
            isModalOpen: false
        });
    };

    render() {
        const {isModalOpen} = this.state;

        return (
            <div className='rsvp'>
                <div className='rsvp_toggle'>
                    <Button label='RSVP' onButtonClick={this.handleOpenModal}/>
                </div>
                
                <Modal visible={isModalOpen} onHide={this.handleCloseModal}>
                    <p>Hello</p>
                </Modal>
            </div>
        );
    }
}

export default RSVP;
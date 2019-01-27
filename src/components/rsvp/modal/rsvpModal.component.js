import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '../../button/button.component';
import Modal from '../../modal/modal.component';
import Field from '../../form/field/field.component';
import './rsvpModal.component.css';

class RSVP extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: props.initialIsOpen || false,

            form: {
                first_name: '',
                last_name: '',
                party_size: 0,
                email: '',
                song_request: '',
                note: ''
            }
        };
    }
    
    handleModalOpen = () => {
        this.setState({
            isModalOpen: true
        });
    };

    handleModalClose = () => {
        this.setState({
            isModalOpen: false
        });
    };

    handleFieldChange = (event, value) => {
        const name = event.target.name;
        const form = {
            ...this.state.form,
            [name]: value
        };

        this.setState({
            form,
            isValid: this.getIsValid(form)
        });
    };

    handleSubmit = () => {
        const {onSubmit} = this.props;
        const {form, isValid} = this.state;

        if (!isValid) {
            return;
        }

        onSubmit(form);
    };

    getIsValid = (form) => {
        const {first_name, last_name, party_size, email} = form;
        let isValid = true;

        if (!first_name || !last_name || !party_size || !email) {
            isValid = false;
        }

        return isValid;
    };

    render() {
        const {isModalOpen, isValid} = this.state;

        return (
            <div className='rsvp'>
                <div className='rsvp_toggle'>
                    <Button label='RSVP' onButtonClick={this.handleModalOpen}/>
                </div>
                
                <Modal visible={isModalOpen} onHide={this.handleModalClose}>
                    <div className='rsvp_wrap'>
                        <div className='rsvp_envelope-back'/>
                        <div className='rsvp_envelope-view'>
                            <section className='rsvp_letter'>
                                <header className='rsvp_header'>
                                    <h2 className='rsvp_title'>RSVP</h2>
                                    <h3 className='rsvp_subtitle'>Join us on September 7th, 2019, our special day.</h3>
                                    <div className='rsvp_spacer'/>
                                </header>
                                <div className='rsvp_form'>
                                    <Field
                                        type='text'
                                        size='half'
                                        label='First Name'
                                        id='rsvp_first_name'
                                        name='first_name'
                                        placeholder='John'
                                        onChange={this.handleFieldChange}
                                    />
                                    <Field
                                        type='text'
                                        size='half'
                                        label='Family Name'
                                        id='rsvp_last_name'
                                        name='last_name'
                                        placeholder='Wick'
                                        onChange={this.handleFieldChange}
                                    />
                                    <Field
                                        type='number'
                                        size='half'
                                        label='Part Size'
                                        id='rsvp_party-size'
                                        name='party_size'
                                        placeholder='Specify amount'
                                        onChange={this.handleFieldChange}
                                    />
                                    <Field
                                        type='text'
                                        size='half'
                                        label='Email'
                                        id='rsvp_email'
                                        name='email'
                                        placeholder='bearded_assass1n@gmail.com'
                                        onChange={this.handleFieldChange}
                                    />
                                    <Field
                                        type='text'
                                        size='full'
                                        label='Song Request(s)'
                                        id='rsvp_song_request'
                                        name='song_request'
                                        placeholder='J.Cole - Love Yourz'
                                        onChange={this.handleFieldChange}
                                    />
                                    <Field
                                        type='textarea'
                                        size='full'
                                        label='Leave a Note'
                                        id='rsvp_note'
                                        name='note'
                                        placeholder='I am allergic to...'
                                        onChange={this.handleFieldChange}
                                    />
                                </div>
                                <footer className='rsvp_footer'>
                                    <Button
                                        theme='transparent'
                                        tall={true}
                                        wide={true}
                                        label='Cancel'
                                        onButtonClick={this.handleModalClose}
                                    />
                                    <Button
                                        theme='pale-grey'
                                        tall={true}
                                        wide={true}
                                        label='Submit'
                                        disabled={!isValid}
                                        onButtonClick={this.handleSubmit}
                                    />
                                </footer>
                            </section>
                        </div>
                        <div className='rsvp_envelope-flap rsvp_envelope-flap--bottom'/>
                        <div className='rsvp_envelope-flap rsvp_envelope-flap--top'/>
                    </div>
                </Modal>
            </div>
        );
    }
}

RSVP.propTypes = {
    initialIsOpen: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired
};

export default RSVP;
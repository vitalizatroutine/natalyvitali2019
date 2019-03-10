import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {getClassName} from '../../utils/react.util';
import './modal.component.css';

/**
 * Modal Component
 */
class Modal extends PureComponent {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            isBeingHidden: false
        };

        this.appBodyContainer = document.getElementsByTagName('body')[0];
        this.modalContainer = document.createElement('div');
        this.modalContainer.className = 'modal-portal';

        if (props.visible) {
            this.appBodyContainer.classList.add('overflow-hidden');
            this.appBodyContainer.appendChild(this.modalContainer);
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    /**
     * ComponentDidUpdate
     * Recalculate noData state if a new set of options is provided
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        const {visible} = this.props;

        if (!prevProps.visible && visible) {
            this.handleOpen();
        }

        if (prevProps.visible && !visible) {
            this.handleStartHide();
        }
    };

    /**
     * ComponentWillUnmount
     * Destroy modal portal as to note pollute the DOM
     */
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);

        if (this.props.visible) {
            this.appBodyContainer.removeChild(this.modalContainer);
        }
    }

    /**
     * Handle keydown event
     * @param event
     */
    handleKeyDown = (event) => {
        event = event || window.event;

        switch (event.key) {
            case 'Escape':
            case 'Esc':
                return this.handleStartHide();
            default:
                return;
        }
    };

    /**
     * Handle Modal collapse
     */
    handleOpen = () => {
        this.appBodyContainer.classList.add('overflow-hidden');
        this.appBodyContainer.appendChild(this.modalContainer);
    };

    /**
     * Handle start of Modal isBeingHidden process
     * This is done to provide a fadeout animation
     */
    handleStartHide = () => {
        const {isBeingHidden} = this.state;

        if (isBeingHidden) {
            return;
        }

        this.setState({
            isBeingHidden: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    isBeingHidden: false
                });

                this.handleHide();
            }, 350);
        });
    };

    /**
     * Handle Modal collapse
     */
    handleHide = () => {
        this.appBodyContainer.classList.remove('overflow-hidden');
        this.appBodyContainer.removeChild(this.modalContainer);
    };

    /**
     * Render Modal Component
     * @returns {*}
     */
    render() {
        const {children, className, fullscreen, onHide} = this.props;
        const {isBeingHidden} = this.state;

        const baseClassName = getClassName('modal', [
            {condition: className, trueClassName: className},
            {condition: fullscreen, trueClassName: 'modal--fullscreen'},
            {condition: isBeingHidden, trueClassName: 'modal--hiding'}
        ]);

        return ReactDOM.createPortal((
            <div className={baseClassName}>
                <div className='modal_mask' onClick={onHide}/>
                <div className='modal_container'>
                    {children}
                </div>
            </div>
        ), this.modalContainer);
    }
}

Modal.propTypes = {

    /**
     * A custom className to add to the component
     */
    className: PropTypes.string,

    /**
     * Used to show / hide the Modal component
     */
    visible: PropTypes.bool.isRequired,

    /**
     * Used to paint the Modal component in full-screen
     */
    fullscreen: PropTypes.bool,

    /**
     * A callback for when the user attempts to hide the Modal component
     */
    onHide: PropTypes.func.isRequired
};

Modal.defaultProps = {
    targetOrigin: 'bottom-left',
    modalOrigin: 'top-left',
    offsetMargin: 10,
    theme: 'light-grey'
};

export default Modal;
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {getClassName} from '../../utils/react.util';
import './popover.component.css';

/**
 * Popover Component
 */
class Popover extends PureComponent {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            hiding: false
        };

        this.appBodyContainer = document.getElementsByTagName('body')[0];
        this.popoverContainer = document.createElement('div');
        this.popoverContainer.className = 'popover-portal';

        if (props.visible) {
            this.appBodyContainer.classList.add('overflow-hidden');
            this.appBodyContainer.appendChild(this.popoverContainer);
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
     * Destroy popover portal as to note pollute the DOM
     */
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);

        if (this.props.visible) {
            this.appBodyContainer.removeChild(this.popoverContainer);
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
     * Handle Popover collapse
     */
    handleOpen = () => {
        this.appBodyContainer.classList.add('overflow-hidden');
        this.appBodyContainer.appendChild(this.popoverContainer);
    };

    /**
     * Handle start of Popover hiding process
     * This is done to provide a fadeout animation
     */
    handleStartHide = (event) => {
        const {hiding} = this.state;
        const {onHide} = this.props;

        if (hiding) {
            return;
        }

        this.setState({
            hiding: true
        }, () => {
            setTimeout(() => {
                onHide && onHide(event);
            }, 150);
        });
    };

    /**
     * Handle Popover collapse
     */
    handleHide = () => {
        this.appBodyContainer.classList.remove('overflow-hidden');
        this.appBodyContainer.removeChild(this.popoverContainer);
    };

    /**
     * Get Popover styles
     * @returns {Object}
     */
    getStyles = () => {
        const {popoverOrigin, width, height, offsetMargin, padding, maskOpacity, maskColor, zIndex} = this.props;

        const popoverPositionProperties = this.getPopoverPositionProperties();

        return {
            mask: {
                backgroundColor: maskColor,
                opacity: maskOpacity,
                zIndex
            },
            anchor: {
                ...this.getAnchorPositionProperties(),
                transformOrigin: popoverOrigin.replace('-', ' ')
            },
            inner: {
                [popoverPositionProperties.horizontal]: 0,
                [popoverPositionProperties.vertical]: 0,
                width,
                height,
                margin: offsetMargin,
                padding,
                transform: popoverPositionProperties.transform,
                zIndex
            }
        };
    };

    /**
     * Get Target's coordinates based on origin prop
     * @returns {{left: number, top: number}}
     */
    getAnchorPositionProperties = () => {
        const {targetReference, targetOrigin} = this.props;
        const TargetComponentRect =  targetReference.current && targetReference.current.getBoundingClientRect();
        const {top, left, width, height} = TargetComponentRect;

        const coordinates = {
            left,
            top: top + height
        };

        switch (targetOrigin) {
            case 'top-left':
                coordinates.left = left;
                coordinates.top = top;
                break;
            case 'top':
            case 'top-center':
                coordinates.left = left + (width / 2);
                coordinates.top = top;
                break;
            case 'top-right':
                coordinates.left = left + width;
                coordinates.top = top;
                break;
            case 'left':
            case 'center-left':
                coordinates.left = left;
                coordinates.top = top + (height / 2);
                break;
            case 'center':
                coordinates.left = left + (width / 2);
                coordinates.top = top + (height / 2);
                break;
            case 'right':
            case 'center-right':
                coordinates.left = left + width;
                coordinates.top = top + (height / 2);
                break;
            case 'bottom-left':
                coordinates.left = left;
                coordinates.top = top + height;
                break;
            case 'bottom':
            case 'bottom-center':
                coordinates.left = left + (width / 2);
                coordinates.top = top + height;
                break;
            case 'bottom-right':
                coordinates.left = left + width;
                coordinates.top = top + height;
                break;
            default:
        }

        return coordinates;
    };

    /**
     * Get Popover Position CSS Properties based on origin prop
     * @returns {{horizontal: string, vertical: string}}
     */
    getPopoverPositionProperties = () => {
        const properties = {
            horizontal: 'left',
            vertical: 'top'
        };

        switch (this.props.popoverOrigin) {
            case 'top-left':
                properties.horizontal = 'left';
                properties.vertical = 'top';
                break;
            case 'top':
            case 'top-center':
                properties.horizontal = 'left';
                properties.vertical = 'top';
                properties.transform = 'translateX(-50%)';
                break;
            case 'top-right':
                properties.horizontal = 'right';
                properties.vertical = 'top';
                break;
            case 'left':
            case 'center-left':
                properties.horizontal = 'left';
                properties.vertical = 'top';
                properties.transform = 'translateY(-50%)';
                break;
            case 'center':
                properties.horizontal = 'left';
                properties.vertical = 'top';
                properties.transform = 'translate(-50%, -50%)';
                break;
            case 'right':
            case 'center-right':
                properties.horizontal = 'right';
                properties.vertical = 'top';
                properties.transform = 'translateY(-50%)';
                break;
            case 'bottom-left':
                properties.horizontal = 'left';
                properties.vertical = 'bottom';
                break;
            case 'bottom':
            case 'bottom-center':
                properties.horizontal = 'left';
                properties.vertical = 'bottom';
                properties.transform = 'translateX(-50%)';
                break;
            case 'bottom-right':
                properties.horizontal = 'right';
                properties.vertical = 'bottom';
                break;
            default:
        }

        return properties;
    };

    /**
     * Render Popover Component
     * @returns {*}
     */
    render() {
        const {targetReference, children, className, theme, visible, disabled} = this.props;

        if (!targetReference || !targetReference.current || !children) {
            return null;
        }

        const {hiding} = this.state;
        const styles = this.getStyles();

        const popoverClassName = getClassName('popover', [
            {condition: className, trueClassName: className},
            {condition: visible, trueClassName: 'popover--visible'},
            {condition: hiding, trueClassName: 'popover--hiding'},
            {condition: disabled, trueClassName: 'popover--disabled'},
            {condition: theme, trueClassName: `popover--${theme}`}
        ]);

        return ReactDOM.createPortal((
            <div className={popoverClassName}>
                <div className='popover_mask' style={styles.mask} onClick={this.handleStartHide}/>
                <div className='popover_anchor' style={styles.anchor}>
                    <div className='popover_inner' style={styles.inner}>
                        {children}
                    </div>
                </div>
            </div>
        ), this.popoverContainer);
    }
}

Popover.propTypes = {
    /**
     * The Target component / element that the popover will attach to
     * Failure to supply a valid reference will result in no render of the component
     */
    targetReference: PropTypes.object.isRequired,

    /**
     * The target component / element's point of origin that the popover will use as an anchor
     * Default value is bottom-left
     */
    targetOrigin: PropTypes.oneOf([
        'top-left', 'top', 'top-center', 'top-right',
        'left', 'center-left', 'center', 'center-right', 'right',
        'bottom-left', 'bottom', 'bottom-center', 'bottom-right'
    ]).isRequired,

    /**
     * The popover component's point of origin from which the popover will render
     * Default value is top-left
     */
    popoverOrigin: PropTypes.oneOf([
        'top-left', 'top', 'top-center', 'top-right',
        'left', 'center-left', 'center', 'center-right', 'right',
        'bottom-left', 'bottom', 'bottom-center', 'bottom-right'
    ]).isRequired,

    /**
     * Used to determine Popover offset by applying margin styling
     * Default value is 10px
     */
    offsetMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * A custom className to add to the component
     */
    className: PropTypes.string,

    /**
     * Used to paint the Popover using a specific theme
     */
    theme: PropTypes.string,

    /**
     * The width of the Popover component
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * The height of the Popover component
     */
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * The padding of the Popover component's inner container
     */
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * The color used to pain the Popover component's mask
     * The mask is visible when the Popover is visible
     */
    maskColor: PropTypes.string,

    /**
     * Opacity for the Popover component's mask
     * The mask is visible when the Popover is visible
     */
    maskOpacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * The z-index of the Popover component
     * Default is Modal level one
     */
    zIndex: PropTypes.number,

    /**
     * Used to show / hide the Popover component
     */
    visible: PropTypes.bool.isRequired,

    /**
     * Used to disable interaction with the Popover component
     */
    disabled: PropTypes.bool,

    /**
     * A callback for when the user attempts to hide the Popover component
     */
    onHide: PropTypes.func.isRequired
};

Popover.defaultProps = {
    targetOrigin: 'bottom-left',
    popoverOrigin: 'top-left',
    offsetMargin: 10,
    theme: 'light-grey'
};

export default Popover;
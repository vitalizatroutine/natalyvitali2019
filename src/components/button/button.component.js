import React, {PureComponent, Link} from 'react';
import PropTypes from 'prop-types';
import {getClassName} from '../../utils/react.util';
import './button.component.css';

/**
 * Button Component
 */
class Button extends PureComponent {

    /**
     * Handle start of Button hiding process
     * This is done to provide a fadeout animation
     */
    handleClick = (event) => {
        const {onButtonClick} = this.props;

        event.target && event.target.blur();
        onButtonClick && onButtonClick(event);
    };

    /**
     * Render Button Component
     * @returns {*}
     */
    render() {
        const {
            className, link, label, icon,
            theme, tall, wide, circle, square,
            loading, invisible, hidden, disabled
        } = this.props;

        const baseClassName = getClassName('button', [
            {condition: className, trueClassName: className},
            {condition: theme, trueClassName: `button--${theme}`},
            {condition: tall, trueClassName: 'button--tall'},
            {condition: wide, trueClassName: 'button--wide'},
            {condition: circle, trueClassName: 'button--circle'},
            {condition: square, trueClassName: 'button--square'},
            {condition: loading, trueClassName: 'button--loading'},
            {condition: invisible, trueClassName: 'button--invisible'},
            {condition: hidden, trueClassName: 'button--hidden'},
            {condition: disabled, trueClassName: 'button--disabled'}
        ]);

        return link ? (
            <Link className={baseClassName} to={link} onClick={this.handleClick}>
                {icon && <i className={`button_icon ${icon}`}/> }
                {label && <span className='button_label'>{label}</span> }
            </Link>
        ) : (
            <button className={baseClassName} onClick={this.handleClick}>
                {icon && <i className={`button_icon ${icon}`}/> }
                {label && <span className='button_label'>{label}</span> }
            </button>
        );
    }
}

Button.propTypes = {
    /**
     * A custom className to add to the component
     */
    className: PropTypes.string,

    /**
     * Used to transform the button into a Link component
     * Note: prop provides link url
     */
    link: PropTypes.string,

    /**
     * Used to provide the button with an icon
     */
    icon: PropTypes.string,

    /**
     * Used to provide the button with a label
     */
    label: PropTypes.string,

    /**
     * Used to paint the Button using a specific theme
     */
    theme: PropTypes.string,

    /**
     * Used to modify the Button component with various modifiers
     */
    tall: PropTypes.bool,
    square: PropTypes.bool,
    circle: PropTypes.bool,
    wide: PropTypes.bool,

    /**
     * Used to paint the Button component with a pulsing loader
     */
    loading: PropTypes.bool,

    /**
     * Used to hide the Button component with opacity
     */
    invisible: PropTypes.bool,

    /**
     * Used to hide the Button component with display: none
     */
    hidden: PropTypes.bool,

    /**
     * Used to disable interaction with the Button component
     */
    disabled: PropTypes.bool,

    /**
     * A callback for when the user clicks the Button component
     */
    onButtonClick: PropTypes.func.isRequired
};

Button.defaultProps = {
    link: null,
    theme: 'rain',
    tall: true
};

export default Button;
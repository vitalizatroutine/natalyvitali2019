import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {getClassName} from '../../../utils/react.util';
import './field.component.css';

class Field extends PureComponent {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            value: props.initialValue ? props.initialValue : ''
        };
    }

    /**
     * Handle input change
     * @param event
     */
    handleInputChange = (event) => {
        const {onChange} = this.props;
        const target = event.target;
        const value = target.value;

        this.setState({
            value
        });

        onChange && onChange(value, event);
    };

    /**
     * Render Field's Input
     * @param type
     * @param value
     * @returns {*}
     */
    renderInput = (type, value) => {
        const {name, id, minLength, maxLength, placeholder, disabled} = this.props;
        let input = null;

        switch (type) {
            case 'textarea':
                input = (
                    <textarea
                        className='field_input'
                        name={name}
                        id={id}
                        value={value}
                        disabled={disabled}
                        placeholder={placeholder}
                        onChange={this.handleInputChange}
                    />
                );
                break;
            case 'number':
            case 'text':
            default:
                input = (
                    <input
                        className='field_input'
                        type={type}
                        name={name}
                        id={id}
                        value={value}
                        minLength={minLength}
                        maxLength={maxLength}
                        disabled={disabled}
                        placeholder={placeholder}
                        onChange={this.handleInputChange}
                    />
                );
        }

        return input;
    };

    /**
     * Render Field Component
     * @returns {*}
     */
    render() {
        const {className, type, theme, size, label, id, disabled} = this.props;
        const {value} = this.state;

        const componentClass = getClassName('field', [
            {condition: className, trueClassName: className},
            {condition: type, trueClassName: `field--${type}`},
            {condition: theme, trueClassName: `field--${theme}`},
            {condition: size, trueClassName: `field--${size}`},
            {condition: disabled, trueClassName: `field--disabled`},
            {condition: value, falseClassName: 'field--empty'}
        ]);

        return (
            <div className={componentClass}>
                {label && <label className='field_label' htmlFor={id}>{label}</label>}
                {this.renderInput(type, value)}
            </div>
        );
    }
}

Field.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    theme: PropTypes.string,
    size: PropTypes.oneOf(['full', 'half', 'third', 'short', 'shorter', 'shortest']),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    initialValue: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
};

Field.defaultProps = {
    type: 'text',
    initialValue: '',
    minLength: 1,
    maxLength: 32
};

export default Field;
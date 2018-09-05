import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './checkbox.component.css';

/**
 * Checkbox Component
 */
class Checkbox extends Component {

    /**
     * Handle Checkbox input change
     * @param event
     */
    handleChange = (event) => {
        this.props.onChange(event.target.checked);
    };

    /**
     * Render Checkbox Component
     * @return {XML}
     */
    render() {
        const {className, theme, size, isChecked, id, disabled} = this.props;
        let {label, labelLeft, labelRight} = this.props;

        const baseClass = [
            className,
            'checkbox',
            theme ? `checkbox--${theme}` : '',
            size ? `checkbox--${size}` : '',
            isChecked ? `checkbox--checked` : '',
            disabled ? `checkbox--disabled` : ''
        ].join(' ');

        if (labelLeft) {
            label = null;
            labelRight = null;
        }

        return (
            <div className={baseClass}>
                {labelLeft && <label className='checkbox_label checkbox_label--left' htmlFor={id}>{labelLeft}</label>}
                <input className='checkbox_input'
                       type='checkbox'
                       id={id}
                       checked={!!isChecked}
                       onChange={this.handleChange}
                       disabled={disabled}
                />
                {(label || labelRight) && <label className='checkbox_label checkbox_label--right' htmlFor={id}>{label || labelRight}</label>}
            </div>
        );
    }
}

Checkbox.propTypes = {
    id: PropTypes.string.isRequired,
    isChecked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    theme: PropTypes.string,
    size: PropTypes.string,
    label: PropTypes.string,
    labelLeft: PropTypes.string,
    labelRight: PropTypes.string
};

export default Checkbox;
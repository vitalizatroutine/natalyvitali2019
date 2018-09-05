import React, {Component} from 'react';
import PropTypes from 'prop-types';

class DatePickerInput extends Component {

    render() {
        return (
            <input
                className='date-picker_input'
                onClick={this.props.onClick}
                value={this.props.value}
                readOnly={true}
                placeholder={this.props.placeholderText}
            />
        );
    }
}

DatePickerInput.propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string,
    placeholderText: PropTypes.string
};

export default DatePickerInput;
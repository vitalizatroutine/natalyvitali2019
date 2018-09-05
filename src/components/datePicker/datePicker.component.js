import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import DatePickerInput from './input/datePickerInput.component';
import './datePicker.component.css';

class DatePickerComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: props.selected ? props.selected : null
        };
    }

    handleChange = (date) => {
        this.setState({selected: date});
        this.props.onChange && this.props.onChange(date);
    };

    render() {
        const {selected} = this.state;
        const {disabled} = this.props;

        return (
            <div className={`date-picker ${disabled ? 'date-picker--disabled' : ''}`}>
                <DatePicker
                    className='date-picker_component'
                    customInput={<DatePickerInput placeholderText={'Select Date'}/>}
                    placeholderText={'Testing one two'}
                    selected={selected}
                    onChange={this.handleChange}
                    popperClassName='date-picker_popper'
                    popperPlacement='bottom-start'
                    {...this.props}
                />
            </div>
        );
    }
}

export default DatePickerComponent;
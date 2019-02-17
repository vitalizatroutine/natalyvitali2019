import React, {PureComponent} from 'react';
import PropType from 'prop-types';
import moment from 'moment';
import './weddingTimer.component.css';

class WeddingTimer extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            daysToWedding: moment('07-09-2019', 'DD-MM-YYYY').diff(moment(), 'days')
        };
    }

    getDays = () => {
        const {daysToWedding} = this.state;
        let days = [0, 0, 0];

        if (!daysToWedding) {
            return days;
        }

        const daysString = daysToWedding.toString();

        switch (daysString.length) {
            case 1:
                return [0, 0, daysString[0]];
            case 2:
                return [0, daysString[0], daysString[1]];
            case 3:
            default:
                return [daysString[0], daysString[1], daysString[2]];

        }
    };

    render() {
        const days = this.getDays();

        if (!days || !days.length) {
            return null;
        }

        if (this.props.stringOnly) {
            return (
                <span className='wedding-timer wedding-timer--string'>{days.join('')}</span>
            );
        }

        return (
            <section className='wedding-timer'>
                <div className='wedding-timer_inner'>
                    <div className='wedding-timer_day-list'>
                        {days.map((dayBlock) => <li className='wedding-timer_day-block'>{dayBlock}</li>)}
                    </div>
                    <div className='wedding-timer_message'>
                        <span className='wedding-timer_text'>days until</span>
                        <span className='wedding-timer_text wedding-timer_text--large'>I do</span>
                    </div>
                </div>
            </section>
        );
    }
}

WeddingTimer.propTypes = {
    stringOnly: PropType.bool
};

export default WeddingTimer;
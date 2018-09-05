import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './switch.component.css';

class Switch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isChecked: props.isChecked
        };
    }

    onSwitchChange = () => {
        const isChecked = !this.state.isChecked;

        this.setState({
            isChecked
        });

        this.props.onChange(isChecked);
    };

    /**
     * Render Switch Component
     */
    render() {
        const {className, theme, labelLeft, labelRight, label, disabled} = this.props;
        const {isChecked} = this.state;

        const baseClass = [
            'switch',
            theme ? `switch--${theme}` : '',
            disabled ? `switch--disabled` : ''
        ].join(' ');

        return (
            <div className={`${className} switch-root`}>
                <div className={baseClass} onClick={this.onSwitchChange}>
                    {(label || labelLeft) &&
                        <span className={isChecked ? 'switch_label' : 'switch_label switch_label--active'}>{label || labelLeft}</span>
                    }
                    <div className='switch_input'>
                        <div className='switch_bar'/>
                        <div className={`switch_icon ${isChecked ? 'switch_icon--checked' : ''}`}/>
                    </div>
                    {labelRight &&
                        <span className={isChecked ? 'switch_label switch_label--active' : 'switch_label'}>{labelRight}</span>
                    }
                </div>
            </div>
        );
    }
}

Switch.propTypes = {
    onChange: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired
};

export default Switch;

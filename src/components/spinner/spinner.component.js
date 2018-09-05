import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './spinner.component.css';

/**
 * Spinner Component
 */
class Spinner extends Component {

    /**
     * Render Spinner
     * @returns {*}
     */
    render() {
        const {fixed, theme, mask, maskOpacity, maskColor} = this.props;

        const className = [
            'spinner',
            fixed ? 'spinner--fixed' : '',
            mask ? 'spinner--masked' : '',
            theme ? `spinner--${theme}` : ''
        ].join(' ').trim();

        const styles = {
            backgroundColor: maskColor ? maskColor : '#000000',
            opacity: maskOpacity ? maskOpacity : 0.25
        };

        return (
            <div className={className}>
                <div className='spinner_inner'/>
                {mask && (
                    <div className='spinner_mask' style={styles}/>
                )}
            </div>
        );
    }
}

Spinner.propTypes = {
    fixed: PropTypes.bool,
    theme: PropTypes.string,
    mask: PropTypes.bool,
    maskOpacity: PropTypes.number,
    maskColor: PropTypes.string
};

export default Spinner;
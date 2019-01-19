import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import './stars.component.css';

class Stars extends PureComponent {
    render() {
        const {count} = this.props;

        if (!count) {
            return null;
        }

        const stars = Array(count).fill('');

        return (
            <div className='stars'>
                {stars.map((selectionIndex, index) => {
                    const style = {
                        top: `${parseInt(100 * Math.random(), 10)}%`,
                        left: `${parseInt(100 * Math.random(), 10)}%`,
                        animationDelay: `${parseInt(10 * Math.random(), 10)}s`
                    };

                    return (
                        <span key={`stars-node--${index}`} className='stars_node' style={style}/>
                    );
                })}
            </div>
        );
    }
}

Stars.propTypes = {
    count: PropTypes.number.isRequired
};

export default Stars;
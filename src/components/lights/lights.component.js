import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import './lights.component.css';

class Lights extends PureComponent {

    getPositionStyles = () => {
        const rail = [
            {top: '-20vh', left: null},
            {top: null, left: '120vw'},
            {top: '120vh', left: null},
            {top: null, left: '-20vw'}
        ][parseInt(4 * Math.random(), 10)];

        return {
            top: rail.top ? rail.top : `${120 - parseInt(140 * Math.random(), 10)}vh`,
            left: rail.left ? rail.left : `${120 - parseInt(140 * Math.random(), 10)}vw`
        };
    };

    render() {
        const {count} = this.props;

        if (!count) {
            return null;
        }

        const lights = Array(count).fill('');

        return (
            <div className='lights'>
                {lights.map((selectionIndex, index) => {
                    const modifier = ['blue', 'pink', 'gold'][parseInt(3 * Math.random(), 10)];
                    const style = {
                        ...this.getPositionStyles(),
                        animationDelay: `${parseInt(10 * Math.random(), 10)}s`
                    };

                    return (
                        <span
                            key={`lights-node--${index}`}
                            className={`lights_node lights_node--${modifier}`}
                            style={style}
                        />
                    );
                })}
            </div>
        );
    }
}

Lights.propTypes = {
    count: PropTypes.number.isRequired
};

export default Lights;
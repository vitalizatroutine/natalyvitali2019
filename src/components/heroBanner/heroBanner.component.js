import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './heroBanner.component.css';
import ScrollingPhrase from '../scrollingPhrase/scrollingPhrase.component';

class HeroBanner extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        };
    }

    render() {
        const {selectedIndex} = this.state;
        const {heroes, phrases} = this.props;

        const styles = {
            image: {
                backgroundImage: heroes[selectedIndex] && `url(${heroes[selectedIndex].source})`,
            }
        };

        return (
            <section className='hero-banner'>
                <div className='hero-banner_image' style={styles.image}/>
                <div className='hero-banner_inner'>
                    <ScrollingPhrase
                        phrases={phrases}
                        beforeText={'We are'}
                        afterText={'for life.'}
                        colors={['#3498db', '#1abc9c', '#f1af0f', '#e74c3c', '#a4305e']}
                        loop={true}
                        transitionTime={2000}
                        delay={1000}
                    />
                </div>
            </section>
        );
    }
}

HeroBanner.propTypes = {
    heroes: PropTypes.array.isRequired,
    phrases: PropTypes.array
};

export default HeroBanner;
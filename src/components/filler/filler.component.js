import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './filler.component.css';

class Filler extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        };
    }

    render() {
        const {image, text, size} = this.props;

        const styles = {
            image: {
                backgroundImage: image && `url(${image})`
            }
        };

        return (
            <section className={`filler ${size ? `filler--${size}` : 'filler--default'}`}>
                <div className='filler_image'  style={styles.image}/>
                {text && <h3 className='filler_text'>{text}</h3>}
            </section>
        );
    }
}

Filler.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string,
    size: PropTypes.string
};

export default Filler;
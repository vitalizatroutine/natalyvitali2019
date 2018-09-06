import React, {Component} from 'react';
import SlideShow from '../../components/slideshow/slideshow.component';
import './root.container.css';

class Root extends Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            images: [
                'https://i.imgur.com/9V1Yf17.jpg',
                'https://i.imgur.com/fx4ZmJM.png',
                'https://i.imgur.com/hH9QGGH.png',
                'https://i.imgur.com/YgwlIk3.jpg',
                'https://i.imgur.com/rUgN1Hi.jpg',
                'https://i.imgur.com/QNJ0UxN.jpg',
                'https://i.imgur.com/PcVBZaC.jpg',
            ]
        };
    }

    /**
     * Render
     * @returns {XML}
     */
    render() {
        const {images} = this.state;

        return (
            <div className='root-container'>
                <SlideShow images={images}/>
            </div>
        );
    }
}

export default Root;
import React, {Component} from 'react';
import './root.container.css';

class Root extends Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            images: []
        };
    }

    /**
     * Render
     * @returns {XML}
     */
    render() {
        const {images} = this.state;

        return (
            <div className='root_container'>

            </div>
        );
    }
}

export default Root;
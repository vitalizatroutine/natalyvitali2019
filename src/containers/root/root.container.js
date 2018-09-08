import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import HomeContainer from '../Home/Home.container';
import SlideShowContainer from '../SlideShow/SlideShow.container';

class Root extends Component {

    render() {
        return (
            <div className='root-container'>
                <Router>
                    <div className='root-container_inner'>
                        <Route exact path='/' component={() => <HomeContainer/>}/>
                        <Route exact path='/slideshow' component={() => <SlideShowContainer/>}/>
                    </div>
                </Router>
            </div>
        );
    }
}

export default Root;

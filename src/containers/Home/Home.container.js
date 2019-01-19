import React, {Component} from 'react';
import {loadPhotoset} from '../../utils/photo.util';
import HeroBanner from '../../components/heroBanner/heroBanner.component';
import Lights from '../../components/lights/lights.component';
import Stars from '../../components/stars/stars.component';
import Spinner from "../../components/spinner/spinner.component";
import RSVP from "../../components/rsvp/modal/rsvpModal.component";

class HomeContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            heroes: [],
            phrases: ['co-workers', 'best-friends', 'pranksters', 'partners']
        };
    }

    componentDidMount() {
        loadPhotoset('72157704381452905', (photos) => {
            this.setState({
                heroes: photos
            });
        });
    }

    render() {
        const {heroes} = this.state;
        const noData = !heroes.length;

        if (noData) {
            return (
                <Spinner/>
            );
        }

        return (
            <div className='home-container'>
                <HeroBanner heroes={heroes}>
                    <Lights count={15}/>
                    <Stars count={50}/>
                </HeroBanner>

                <RSVP/>
            </div>
        );
    }
}

export default HomeContainer;

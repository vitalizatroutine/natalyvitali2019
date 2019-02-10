import React, {Component} from 'react';
import {loadPhotoset} from '../../utils/photo.util';
import HeroBanner from '../../components/heroBanner/heroBanner.component';
import Lights from '../../components/lights/lights.component';
import Stars from '../../components/stars/stars.component';
import Spinner from '../../components/spinner/spinner.component';
import RSVP from '../../components/rsvp/modal/rsvpModal.component';
import WeddingTimer from '../../components/weddingTimer/weddingTimer.component';

class HomeContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isRSVPModalOpen: false,

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

    handleRSVPSubmit = (form) => {
        console.log('RSVP Form Submition', form);
    };

    handleRSVPModalOpen = () => {
        this.setState({
            isRSVPModalOpen: true
        });
    };

    handleRSVPModalClose = () => {
        this.setState({
            isRSVPModalOpen: false
        });
    };

    render() {
        const {isRSVPModalOpen, heroes} = this.state;
        const noData = !heroes.length;

        if (noData) {
            return (
                <Spinner/>
            );
        }

        return (
            <div className='home-container'>
                <HeroBanner heroes={heroes}>
                    <Lights count={isRSVPModalOpen ? 0 : 10}/>
                    <Stars count={isRSVPModalOpen ? 0 : 30}/>
                </HeroBanner>

                <WeddingTimer/>

                <RSVP
                    onModalOpen={this.handleRSVPModalOpen}
                    onModalClose={this.handleRSVPModalClose}
                    onSubmit={this.handleRSVPSubmit}
                />
            </div>
        );
    }
}

export default HomeContainer;

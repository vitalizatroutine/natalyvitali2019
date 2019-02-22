import React, {Component} from 'react';
import {loadPhotoset} from '../../utils/photo.util';
import TableTop from '../../components/tableTop/tableTop.component';
import HeroBanner from '../../components/heroBanner/heroBanner.component';
import Lights from '../../components/lights/lights.component';
import Stars from '../../components/stars/stars.component';
import Spinner from '../../components/spinner/spinner.component';
import RSVP from '../../components/rsvp/modal/rsvpModal.component';

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

                <TableTop
                    size={[3,3]}
                    startingPos={[0, 0]}
                    panes={[{
                        id: '0', x: 0, y: 0
                    }, {
                        id: '1', x: 1, y: 0
                    }, {
                        id: '2', x: 2, y: 0
                    }, {
                        id: '3', x: 0, y: 1
                    }, {
                        id: 'heroBanner',
                        x: 1,
                        y: 1,
                        view: (
                            <HeroBanner heroes={heroes}>
                                <Lights count={isRSVPModalOpen ? 0 : 10}/>
                                <Stars count={isRSVPModalOpen ? 0 : 30}/>
                            </HeroBanner>
                        )
                    }, {
                        id: '6', x: 2, y: 1
                    }, {
                        id: '7', x: 0, y: 2
                    }, {
                        id: '8', x: 1, y: 2
                    }, {
                        id: '9', x: 2, y: 2
                    }]}
                />


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

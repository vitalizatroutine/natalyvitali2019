import React, {Component} from 'react';
import {pushToSheets, loadPhotoset} from '../../utils';
import {HeroBanner, WeddingDetail, WeddingTimer, Lights, Stars, Spinner, RSVP} from '../../components';

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
        pushToSheets(form, (error) => {
            if (error) {
                console.log('error', error);
            }

            this.handleRSVPModalClose();
        });
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
                    <WeddingDetail
                        details={[{
                            key: 'venue',
                            title: 'Venue',
                            text: 'daVinci Banquet Hall'
                        }, {
                            key: 'date',
                            title: 'Date',
                            text: '09.07.19'
                        }, {
                            key: 'daysLeft',
                            title: 'Days Until "I Do"',
                            text: (
                                <WeddingTimer stringOnly={true}/>
                            )
                        }]}
                    />
                </HeroBanner>

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

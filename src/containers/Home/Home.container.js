import React, {Component} from 'react';
import request from 'request';
import {API_KEY, USER_ID} from '../../config';
import Navigation from '../../components/navigation/navigation.component';
// import RSVP from '../../components/rsvp/modal/rsvpModal.component';
import HeroBanner from '../../components/heroBanner/heroBanner.component';
import PhotoTimeline from '../../components/photoTimeline/photoTimeline.component';
import Filler from '../../components/filler/filler.component';

class HomeContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chapters: [],
            photos: [],
            heroes: [],
            fillers: [],
            phrases: ['co-workers', 'best-friends', 'pranksters', 'partners', 'engaged']
        };

        this.timeline = React.createRef();
    }

    componentDidMount() {
        this.loadPhotos();
    }

    loadPhotos = () => {
        const params = {
            url: 'https://api.flickr.com/services/rest',
            method: 'GET',
            qs: {
                method: 'flickr.photosets.getPhotos',
                api_key: API_KEY,
                user_id: USER_ID,
                extras: 'description, url_m, url_o, tags',
                format: 'json',
                photoset_id: '72157699202803674',
                nojsoncallback: 1
            }
        };

        request(params, (error, response, body) => {
            const photoset = body && JSON.parse(body).photoset;

            if (!photoset || !photoset.photo) {
                return;
            }

            const filteredPhotos = photoset.photo.filter((photo) => photo.tags && photo.tags.length).map((photo) => {
                return {
                    id: photo.id,
                    title: photo.title,
                    description: photo.description && photo.description._content,
                    thumbnail: photo.url_m,
                    source: photo.url_o,
                    tags: photo.tags.split(' '),
                    chapter: photo.tags[0]
                };
            });


            const {photos, chapters, heroes, fillers} = this.parsePhotos(filteredPhotos);

            this.setState({
                photos,
                chapters,
                heroes,
                fillers
            });
        });
    };

    parsePhotos = (items) => {
        if (!items || !items.length) {
            return {
                photos: [],
                chapters: [],
                heroes: [],
                fillers: []
            };
        }

        let photos = [];
        let chapters = [];
        let heroes = [];
        let fillers = [];

        items.forEach((photo) => {
            const tags = photo.tags;

            if (!tags.length) {
                return;
            }

            if ((tags[0].indexOf('hero') > -1)) {
                heroes.push(photo);
                return;
            }

            if ((tags[0].indexOf('filler') > -1)) {
                fillers.push(photo);
                return;
            }

            if ((tags[0].indexOf('cover') > -1)) {
                chapters.push(photo);
            } else {
                photos.push(photo);
            }
        });

        return {
            photos,
            chapters,
            heroes,
            fillers
        };
    };

    render() {
        const {photos, chapters, heroes, phrases, fillers} = this.state;

        return (
            <div className='home-container'>
                <Navigation
                    items={[{
                        label: 'Home',
                        scrollTarget: 0
                    }, {
                        label: 'Timeline',
                        scrollTarget: this.timeline
                    }]}
                    comingSoon={true}
                />

                {/*<RSVP/>*/}

                <HeroBanner heroes={heroes} phrases={phrases}/>
                <PhotoTimeline
                    ref={this.timeline}
                    photos={photos}
                    chapters={chapters}
                />

                {(fillers.length > 0) && (
                    <Filler
                        image={fillers[0].source}
                        text={fillers[0].description}
                        size='full'
                    />
                )}
            </div>
        );
    }
}

export default HomeContainer;

import React, {Component} from 'react';
import request from 'request';
import {API_KEY, USER_ID} from '../../config';
import SlideShow from '../../components/slideshow/slideshow.component';

class SlideShowContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            photos: []
        };
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

            this.setState({
                photos: photoset.map((photo) => photo.url_o)
            });
        });
    };

    render() {
        const {photos} = this.state;

        return (
            <div className='slideshow-container'>
                <SlideShow images={photos}/>
            </div>
        );
    }
}

export default SlideShowContainer;

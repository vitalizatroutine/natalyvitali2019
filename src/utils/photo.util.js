import {API_KEY, USER_ID} from '../config';
import request from 'request';

export const loadPhotoset = (id, callback) => {
    const params = {
        url: 'https://api.flickr.com/services/rest',
        method: 'GET',
        qs: {
            method: 'flickr.photosets.getPhotos',
            api_key: API_KEY,
            user_id: USER_ID,
            extras: 'description, url_m, url_o, tags',
            format: 'json',
            photoset_id: id,
            nojsoncallback: 1
        }
    };

    request(params, (error, response, body) => {
        const photoset = body && JSON.parse(body).photoset;

        if (!photoset || !photoset.photo || !photoset.photo.length) {
            return;
        }

        const photos = photoset.photo.map((photo) => {
            return {
                id: photo.id,
                title: photo.title,
                description: photo.description && photo.description._content,
                thumbnail: photo.url_m,
                source: photo.url_o,
                tags: photo.tags.split(' ')
            };
        });

        callback && callback(photos);
    });
};
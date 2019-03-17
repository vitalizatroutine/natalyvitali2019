import {API_URL} from '../config';
import request from 'request';

/**
 * Post to google sheets
 * @param form
 * @param callback
 */
export const pushToSheets = (form, callback) => {
    request.post(`${API_URL}/googleapis/sheets`, {form}, (error) => {
        callback && callback(error);
    });
};
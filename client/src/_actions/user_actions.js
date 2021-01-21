import axios from 'axios';
import {
    AUTH_USER,
} from './types';

export function auth() {
    console.log('dispatch(auth())')
    const request = axios.get(`/api/users/auth`)
        .then(response => {
            console.log('axios result', response.data)
            return response.data
        });

    return {
        type: AUTH_USER,
        payload: request
    }
}


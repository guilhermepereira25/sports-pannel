'use strict'

import axios from 'axios';

const baseApiUrl = 'http://localhost:3000';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function login (username, password) {
    console.log('auth_service.js: login()');

    const response = await axiosClient.post('/api/login', {
        username: username,
        password: password
    }).then(response => {
        console.log('auth_service.js: login() response: ', response.data);
        return response.data;
    }).catch(error => {
        return error.response;
    });

    return response;
}

export async function logout () {
    await axios.post(baseApiUrl + '/api/logout')
    .then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
}
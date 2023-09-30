'use strict'

import axios from 'axios';

const baseApiUrl = 'http://localhost:3000';

const axiosClient = axios.create({
    baseURL: baseApiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function login(username, password) {
    const response = await axiosClient.post('/api/login', {
        username: username,
        password: password
    }).then(response => {
        return response.data;
    }).catch(error => {
        return error.response;
    });

    return response;
}

export async function logout() {
    const response = await axiosClient.post('/api/logout')
    .then(response => {
        return response.data;
    }).catch(error => {
        return error.response;
    });

    return response;
}
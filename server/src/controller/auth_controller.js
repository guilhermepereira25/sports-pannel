'use strict'

import bycrypt from 'bcrypt';
import { IncomingMessage } from 'http';
import { responseBody } from '../constants/controller/responseBody.js';
import { defaultUsernameAuth } from '../constants/controller/auth.js';

async function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            const data = Buffer.concat(chunks).toString();

            try {
                resolve(JSON.parse(data));
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', err => {
            reject(err);
        });
    });
}

/**
 * Authenticates a user by checking their username and password against the server.
 * @async
 * @function login
 * @param {IncomingMessage} req - The request object containing the user's credentials.
 */
export async function login(req) {
    if (req.method !== 'POST') {
        responseBody.statusCode = 400;
        responseBody.body.message = 'invalid request method';
        return responseBody;
    }

    const { username, password } = await getRequestBody(req);

    if (!username || !password) {
        responseBody.statusCode = 400;
        responseBody.body.message = 'username or password is undefined';
        return responseBody;
    }

    try {
        if (username === defaultUsernameAuth.username && 
            bycrypt.compare(password, defaultUsernameAuth.password)
        ) {
            let token = bycrypt.hashSync(username, 10);

            responseBody.statusCode = 200;
            responseBody.body.success = true;
            responseBody.body.message = 'success';
            responseBody.body.data = {
                username,
                password,
                token
            };

            req.session.username = { username };
        } else {
            responseBody.statusCode = 401;
            responseBody.body.message = 'unauthorized';
        }
    } catch (err) {
        console.error(err);
        responseBody.data = err;
        responseBody.message = 'error';
    }

    return responseBody;
}

/**
 * Authenticates a user by checking their username and password against the server.
 * @async
 * @function logout
 * @param {IncomingMessage} req - The request object containing the user's credentials.
 */
export async function logout(req) {
    if (req.method !== 'POST') {
        responseBody.statusCode = 400;
        responseBody.body.message = 'invalid request method';
        return responseBody;
    }

    try {
        req.session = null;
        responseBody.body.success = true;
        responseBody.statusCode = 200;
        responseBody.body.message = 'success';
    } catch (err) {
        console.error(err);
        responseBody.data = err;
        responseBody.message = 'error';
    }

    return responseBody;
}
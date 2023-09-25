'use strict'

import { IncomingMessage, ServerResponse } from 'http';

/**
 * @param {IncomingMessage} req
 */
export async function createUser(req) {
    return {
        statusCode: 200,
        body: "Hello World!"
    }
}

/**
 * @param {IncomingMessage} req 
 */
export async function getUser(req) {
    return {
        statusCode: 200,
        body: "Hello World!"
    }
}
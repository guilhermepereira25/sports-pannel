'use strict'

import { login, logout } from "./auth_controller.js";
import { getLeague, getStandings } from "./api_controller.js";
import { IncomingMessage } from 'http';
import { parse } from "url";

function getRoutes() {
    return {
        '/api/get-base': {
            handler: baseRequest
        },
        '/api/get-league': {
            handler: getLeague
        },
        '/api/get-standings': {
            handler: getStandings
        },
        '/api/login': {
            handler: login
        },
        '/api/logout': {
            handler: logout
        }
    }
}

function verifyUrlParsed(url) {
    const parsedUrl = parse(url, true);

    if (parsedUrl.pathname === '/api/login' || 
        parsedUrl.pathname === '/api/logout'
    ) {
        return parsedUrl.pathname;
    }

    const urlPattern = /^\/api\/get-(.+?)(?:\/(\w+)\/(\w+))?$/;
    const urlMatch = parsedUrl.pathname.match(urlPattern);

    if (urlMatch) {
        const baseUrl = '/api/get-';
        const correctPathName = urlMatch[1];

        if (urlMatch[2] !== undefined && urlMatch[3] !== undefined) {
            const query = urlMatch[2] + '=' + urlMatch[3];
            return {
                pathname: baseUrl + correctPathName,
                url: baseUrl + correctPathName + '?' + query
            }
        }

        return correctPathName.endsWith('/') ?
            baseUrl + correctPathName.replace(correctPathName, '') : baseUrl + correctPathName;
    }

    return false;
}

/**
 * @param {IncomingMessage} req
 */
export async function handle(req) {    
    const parsedUrl = verifyUrlParsed(req.url);

    if (!parsedUrl) { throw new Error('Invalid request URL'); }

    let requestUrl = '';
    if (typeof parsedUrl === 'object') {
        req.url = parsedUrl.url;
        requestUrl = parsedUrl.pathname;
    } else {
        requestUrl = parsedUrl;
    }

    const routes = getRoutes();
    if (!routes[requestUrl] || typeof routes[requestUrl].handler !== 'function') {
        throw new Error('Invalid route');
    }

    try {
        let response = await routes[requestUrl].handler(req);

        if (!response) {
            throw new Error('Invalid response');
        }

        return response;
    } catch (err) {
        console.error(err);
    }
}

/**
 * @param {IncomingMessage} req 
 */
async function baseRequest(req) {
    return {
        statusCode: 200,
        body: {
            success: true,
            message: null,
            data: {
                'hello': 'world'
            },
        }
    }
}
'use strict'

import { debug } from 'console';
import { IncomingMessage } from 'http';
import { parse } from "url";

const options = {
    url: process.env.API_ENDPOINT, 
    path: '', // path is set in the function that calls this
    params: {}, // params are set in the function that calls this
    method: 'GET', // is never a post request so setting this to GET
    headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': process.env.API_RAPIDAPI_HOST,
        'X-RapidAPI-Key': process.env.API_RAPIDAPI_KEY,
    },
}

const responseBody = {
    statusCode: 500,
    body: {
        success: false,
        message: null,
        data: {},
    }
}

const leagues = [
    'Brasileirão',
    'Premier League',
    'La Liga'
];

async function makeRequest(options) {
    let url = options.url + options.path;

    try {
        const response = await fetch(url, {
            method: options.method,
            headers: options.headers,
            params: options.params,
        });

        debug(`makeRequest response: ${response}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();

        debug(`makeRequest data: ${data}`);

        return data;
    } catch (err) {
        console.error(err);
    }
}

/** 
 * @param {IncomingMessage} req

 * @returns {Object} An object containing the HTTP status code and response body.
 */
export async function getLeague(req) {
    if (! req.session.username) {
        responseBody.statusCode = 401;
        responseBody.body.message = 'Unauthorized';
        return responseBody;
    }

    let leagueName = undefined;
    
    if (typeof req.url === 'string') {
        let urlParsed = parse(req.url, true);
        leagueName = urlParsed.query.name;
    } else {
        let urlParsed = req.url;
        leagueName = urlParsed.query.name;
    }

    if (leagueName == undefined) {
        responseBody.statusCode = 400;
        responseBody.body.message = 'league_name is undefined';
    } else {
        if (!leagues.includes(leagueName)) { // just for limit call purposes
            responseBody.statusCode = 400;
            responseBody.body.message = `${leagueName} is not a valid league`;
            return responseBody;
        }

        options.path = '/leagues';
        options.params = {
            name: leagueName,
        }
    
        const data = await makeRequest(options);
    
        responseBody.statusCode = 200;
        responseBody.body.data = data.response;
        responseBody.body.success = true;
    }

    return responseBody;
}

/**
 * Retrieves the standings for a given league.
 * 
 * @param {IncomingMessage} req - The request object.
 * 
 * @returns {Object} An object containing the HTTP status code and response body.
 */
export async function getStandings(req) {
    if (! req.session.username) {
        responseBody.statusCode = 401;
        responseBody.body.message = 'Unauthorized';
        return responseBody;
    }

    let leagueId = undefined;
    
    if (typeof req.url === 'string') {
        let urlParsed = parse(req.url, true);
        leagueId = urlParsed.query.id;
    } else {
        let urlParsed = req.url;
        leagueId = urlParsed.query.id;
    }

    if (leagueId === undefined) { return { statusCode: 400, body: 'league_id is undefined' } };

    options.path = '/standings';
    options.params = {
        league: leagueId,
    }

    try {
        const data = await makeRequest(options);
        debug(`getStandings data: ${data}`);

        responseBody.statusCode = 200;
        responseBody.body.data = data.response;
        responseBody.body.success = true;
    } catch (err) {
        console.error(err);
        responseBody.data = err;
        responseBody.message = 'error';
    }

    return responseBody;
}
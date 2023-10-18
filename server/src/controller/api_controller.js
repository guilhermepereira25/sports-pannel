'use strict'

import { debug } from 'console';
import { IncomingMessage } from 'http';
import { parse } from "url";
import { setRedisKey, getRedisKey } from '../services/redis_services.js';
import { options } from '../constants/controller/options.js';
import { responseBody } from '../constants/controller/responseBody.js';
import { leagues } from '../constants/controller/leagues.js';

async function makeRequest(requestParams) {
    let url = requestParams.url + requestParams.path;

    try {
        const response = await fetch(url, {
            method: requestParams.method,
            headers: requestParams.headers,
            params: requestParams.params,
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

        const redisData = await getRedisKey(leagueName);

        if (! redisData) {
            options.path = '/leagues';
            options.params = {
                name: leagueName,
            }
        
            const data = await makeRequest(options);

            try {
                await setRedisKey(leagueName, JSON.stringify(data.response));
            } catch (err) {
                console.error(err);
                responseBody.data = err;
                responseBody.message = 'error';
                return responseBody;
            }
        }

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

    let responseData = undefined;
    const redisData = await getRedisKey(leagueId);

    if (! redisData) {
        options.path = '/standings';
        options.params = {
            league: leagueId,
        }

        try {
            const data = await makeRequest(options);
            responseData = data.response;
            await setRedisKey(leagueId, JSON.stringify(data.response));
            debug(`getStandings data: ${data}`);
        } catch (err) {
            console.error(err);
            responseBody.data = err;
            responseBody.message = 'error';
            return responseBody;
        }
    } else {
        responseData = redisData;
    }

    responseBody.statusCode = 200;
    responseBody.body.data = responseData;
    responseBody.body.success = true;
    return responseBody;
}
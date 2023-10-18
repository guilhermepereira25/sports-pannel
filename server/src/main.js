import { IncomingMessage, ServerResponse, createServer } from 'http';
import dotenv from 'dotenv';
import { handle } from '../src/controller/input_controller.js';
import session from 'cookie-session';
import { defaultHost, appPort } from './constants/main.js';
dotenv.config();

/**
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res
 */
async function serve(req, res) {
    session({
        name: 'session',
        keys: [process.env.SESSION_KEY],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    try {
        if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
        }

        let thisResponseData = await handle(req);
        
        if (thisResponseData) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = thisResponseData.statusCode;
            res.end(JSON.stringify(thisResponseData.body));
        }
    } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({
            success: false,
            body: 'internal_server_error'
        }));
        console.error(err);
    }
}

async function main() {
    process.on('uncaughtException', (err) => {
        console.error(err);
        process.exit(1);
    });

    const server = createServer((req, res) => {
        serve(req, res);
    });
    
    server.listen(appPort, () => {
        console.log(`Server running at: ${defaultHost}:${appPort}`);
    });
}

main();
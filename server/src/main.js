import { IncomingMessage, ServerResponse, createServer } from 'http';
import dotenv from 'dotenv';
import { handle } from '../src/controller/input_controller.js';
dotenv.config();

const defaultHost = process.env.DEFAULT_HOST;
const appPort = process.env.APP_PORT || 3000; // always use 3000 for dev

/**
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res
 */
async function serve(req, res) {
    try {
        let thisResponseData = await handle(req);
        
        if (thisResponseData) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
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
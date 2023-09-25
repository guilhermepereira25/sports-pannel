'use strict'

import { debug } from 'console';
import fs from 'fs';
import path from 'path';

export async function getApiResponseExample(filePath) {
    const filePath = path.join(filePath);
    debug(`getApiResponseExample: ${filePath}`);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
        }

        debug(`getApiResponseExample: ${data}`);
        return data;
    });
}
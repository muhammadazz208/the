const { Readable } = require('stream');

async function bodyParser(req) {
    return new Promise((resolve, reject) => {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                // JSONni parslashdan oldin to'g'ri formatni tekshirib oling
                resolve(JSON.parse(data));
            } catch (error) {
                reject(new Error('Invalid JSON'));
            }
        });

        req.on('error', err => {
            reject(err);
        });
    });
}

module.exports = { bodyParser };
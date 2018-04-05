const redis = require('redis');

let client = null;
try {
    client = redis.Client();
}
catch (err) {};

module.exports = client;

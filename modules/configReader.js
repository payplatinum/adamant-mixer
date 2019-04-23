const jsonminify = require('jsonminify');
const fs = require('fs');
const log = require('./log');
let config = {};

try {
    config = JSON.parse(jsonminify(fs.readFileSync('./config.json', 'utf-8')));
    if (!config.node) {exit('Not defined required value node!');}
    if (!config.address) {exit('Not defined required value address!');}
    if (!config.port) {config.port = 36670;}

} catch (e) {
    console.log('Err config:' + e);
    exit('Create config: ' + e);
}

module.exports = config;

function exit (msg) {
    log.error(msg);
    process.exit(-1);
}
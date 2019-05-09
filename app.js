const api = require('./modules/api');
const log = require('./modules/log');
const config = require('./modules/configReader');
const iterat = require('./modules/iterat');

const {
    dbMixerAccounts,
    dbSystem
} = require('./modules/DB');

setTimeout(() => {
    init();
}, 1000);

async function init () {
    log.info('Start Adamant-Mixer ' + config.address);
    require('./modules/sendTransfers');

    dbMixerAccounts.findOne({account: config.address}, (err, acc) => {
        if (!acc) {
            dbMixerAccounts.insert({
                account: config.address,
                passphrase: config.passPhrase
            });
        }
    });

    dbSystem.findOne({}, (err, system) => {
        if (!system) {
            const lastBlock = api.get('uri', 'blocks').blocks[0];
            dbSystem.insert({lastBlock});
        }
    });

    setInterval(iterat, 4000);
}

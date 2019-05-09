const api = require('./api');
const config = require('./configReader');
const log = require('./log');
const {
    dbSystem
} = require('./DB');
const checkTrans = require('./checkTrans');

let lastHeigth;

module.exports = async () => {
    try {
        if (!lastHeigth) {
            lastHeigth = (await dbSystem.syncFindOne({})).lastBlock.height;
        }
        const tx = api.get('uri', 'chats/get/?recipientId=' + config.address + '&orderBy=timestamp:desc&fromHeight=' + lastHeigth).transactions;

        if (!tx.length) {
            return;
        }
        const lastBlock = api.get('uri', 'blocks').blocks[0];
        dbSystem.update({}, {
            lastBlock
        });

        tx.forEach(t => {
            lastHeigth = t.height;
            checkTrans(t);
        });
    } catch (e) {
        log.error('app iterat: ' + e);
    }
};
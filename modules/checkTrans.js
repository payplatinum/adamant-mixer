const {
    dbTransfers
} = require('./DB');
const $u = require('../helpers/utils');
const breakAmount = require('../helpers/breakAmount');
const api = require('./api');
const config = require('./configReader');
const log = require('./log');

module.exports = (t) => {
    try {
        if (t.amount) { // transfer
            const satAmount = t.amount / 100000000;
            const chat = t.asset.chat;
            const recipientId = api.decodeMsg(chat.message, t.senderPublicKey, config.passPhrase, chat.own_message).trim().toUpperCase();
            const amount = breakAmount(satAmount);
            const transfer = {
                senderId: t.senderId,
                recipientId,
                total_amount: satAmount,
                amount,
                time: $u.unix()
            };
            log.info('New tranfer!');

            dbTransfers.insert(transfer);
        } else { // message

        }
    } catch (e) {
        log.error('CheckTrans: ' + e);
    }
};
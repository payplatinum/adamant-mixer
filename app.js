const api = require('./modules/api');
const log = require('./modules/log');
const config = require('./modules/configReader');
const db = require('./modules/DB').dbTransfers;
const _ = require('underscore');
const breakAmount = require('./helpers/breakAmount');

let height = 0;
init();

async function app() {
    try {
        const tx = api.get('uri', 'chats/get/?recipientId=' + config.address + '&orderBy=timestamp:desc&fromHeight=' + height).transactions;

        if (!tx.length) {
            return;
        }

        tx.forEach(t => {
            height = t.height;

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
                    time: uTime()
                };
                log.info('New tranfer!');

                db.insert(transfer);
            } else { // message

            }

        });
    } catch (e) {
        log.error('app iterat: ' + e);
    }
}

function init() {
    log.info('Start Adamant-Mixer ' + config.address);
    require('./modules/sendTransfers');

    setTimeout(() => {
        height = api.get('uri', 'blocks/getHeight').height;
        app();
    }, 2000);

    setInterval(() => {
        app();
    }, 10000);
}

function uTime() {
    return +(new Date().getTime());
}
const api = require('./modules/api');
const log = require('./modules/log');
const config = require('./modules/configReader');
const db = require('./modules/DB').dbTransfers;
const _ = require('underscore');

let height = 0;
log.info('Start Adamant-Mixer ' + config.address);
setTimeout(() => {
    height = api.get('uri', 'blocks/getHeight').height;
    app();
}, 2000);

async function app() {
    try {
        const tx = api.get('uri', 'chats/get/?recipientId=U10666556853857590034&orderBy=timestamp:desc&fromHeight=' + height).transactions;
		
		if (!tx.length) return;
		
		tx.forEach(t => {
            height = t.height;
            if (!t.amount) return;
            const chat = t.asset.chat;
            const recipientId = api.decodeMsg(chat.message, t.senderPublicKey, config.passPhrase, chat.own_message).trim().toUpperCase();
            const transfer = {
                senderId: t.senderId,
                recipientId,
                amount: t.amount / 100000000 - 0.5 - config.comission || 0,
                time: uTime()
			}
            db.insert(transfer);
            log.info('newTransfer');
		});
		} catch (e) {
        log.error('app iterat: ' + e);
	}
}

async function send() {
    try {
        const transfers = await db.syncFind({});
        console.log('Всего', transfers.length);
        
        if (transfers.length < config.count_transfers) return;
		
        _.shuffle(transfers).forEach(t => {
            console.log('отправляем ', t);
            const trans = api.send(config.passPhrase, t.recipientId, t.amount);
            if (!trans || !trans.success) {
                log.info('Error send transfer!');
                return;
			}
            const trans_id = trans.transactionId;
            api.send(config.passPhrase, t.recipientId, 'Mixer: Transfer from ' + t.senderId + ' ' + t.amount + ' ADM. TxId: ' + trans_id, 'message');
            api.send(config.passPhrase, t.senderId, 'Mixer: You transfer to ' + t.recipientId + ' ' + t.amount + ' ADM send. TxId: ' + trans_id, 'message');
            db.remove({
                _id: t._id
			});
		});
		} catch (e) {
        log.error(' Send: ' + e);
	}
	
}

setInterval(() => {
    app();
    send();
}, 10000);

function uTime() {
    return +(new Date().getTime() / 1000).toFixed(0);
}
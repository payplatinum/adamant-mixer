const {
    dbTransfers,
    dbIncomingTxs
} = require('./DB');
const $u = require('../helpers/utils');
const breakAmount = require('../helpers/breakAmount');
const api = require('./api');
const config = require('./configReader');
const log = require('./log');

module.exports = (t) => {
    try {
        if (t.amount && t.type === 8) { // transfer
            const chat = t.asset.chat;
            const msg = api.decodeMsg(chat.message, t.senderPublicKey, config.passPhrase, chat.own_message).toUpperCase();
            prepTrasfer(t, msg);
            
        } else { // message

        }
    } catch (e) {
        log.error('CheckTrans: ' + e);
    }
};



async function prepTrasfer (tx, msg) {
    //TODO: regexp valid t
    const not_valid = null;

    const data = msg.split(',');
    const delay = Number(data.shift().trim()) || 0;

    const recepients_exceed = data.length > 100;

    let not_enough_fee = data.reduce((s, r) => {
        return s + +r.split(' ')[2];
    }, 0) > tx.amount / 100000000;

    const order = {
        txid: tx.id,
        date: $u.unix(),
        block_id: tx.blockId,
        encrypted_content: msg,
        sender: tx.senderId,
        recepient: tx.recipientId,
        total_received: tx.amount, // полученная общая сумма
        not_valid, // не удалось разобрать транзакцию, default null
        // processed // если транзакция обработана в payments
        recepients_exceed, // если кол-во пар Address-Amount больше 100
        fee_total: null, // сколько получили fee, default null
        not_enough_fee, // не достаточно прикрепили токенов, default null // TODO:
        blacklisted: null, // находится ли отправитель в черном листе, default null // TODO:
        need_to_send_back: recepients_exceed || not_valid || not_enough_fee, // если нужно вернуть отправителю, default null
        sent_back_tx: null, // ID транзакции возврата, default null
        sent_back_date: null, // unixtime возврата, default null
        unable_to_send_back: null //если вернуть не удалось из-за fee, default null
    };

    let error = '';
    if (recepients_exceed) {
        error += ' Too many recipients';
    }
    if (not_valid) {
        error += ' Not valid message';
    }
    if (not_enough_fee) {
        error += ' Not enough fee';
    }

    if (error.length) {
        order.errorTxt = error;
        log.error(error);
    }

    dbIncomingTxs.insert(order, (err, o) => {
        if (!error.length) {
            log.info('Success push tx: ' + tx.id);
            const order_id = o._id;
            data.forEach(r => {
                createTransfer(r, order_id, tx.senderId, delay);
            });
        }
    });
}

function createTransfer (r, order_id, senderId, delay) {
    const [recipientId, total_amount] = r.trim().split(' ');
    const amount = breakAmount(total_amount);
    const transfer = {
        senderId,
        recipientId,
        total_amount: +total_amount,
        amount,
        order_id,
        delay_mls: delay * 60000,
        time: $u.unix(),
        isFinished: false
    };
    dbTransfers.insert(transfer);
}

const {
    dbIncomingTxs
} = require('./DB');
const api = require('./api');
const log = require('./log');
const config = require('./configReader');
const $u = require('../helpers/utils');

function senderBack () {
    dbIncomingTxs.find({need_to_send_back: true}, (err, txs)=>{
        txs.forEach(t=>{
            const amount = t.total_received / $u.satosh;
            const msgBack = `${t.sender} ${amount} ADM`;
            log.warn('Send back! ' + msgBack);
            const trans = api.send(config.passPhrase, t.sender, amount - 0.5);
            
            if (!trans || !trans.success) {
                log.error('Error send transfer back ' + msgBack);
                return;
            }
            api.send(config.passPhrase, t.sender, `Mixer Transfer error: \n "${t.encrypted_content}" ${amount} ADM. \n Error: ${t.errorTxt}`, 'message');

            t.sent_back_tx = trans.transactionId;
            t.sent_back_date = $u.unix();
        });
    });
}

setInterval(senderBack, 60000);
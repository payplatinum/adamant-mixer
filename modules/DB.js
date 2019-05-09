const syncNedb = require('./syncNedb');
const Datastore = require('nedb');

module.exports = {

    dbTransfers: syncNedb(new Datastore({
        filename: 'db/transfers',
        autoload: true
    }), 60),

    dbIncomingTxs: syncNedb(new Datastore({
        filename: 'db/incoming_txs',
        autoload: true
    }), 60),

    dbMixerAccounts: syncNedb(new Datastore({
        filename: 'db/mixer_accounts',
        autoload: true
    }), 60),

    dbPayments: syncNedb(new Datastore({
        filename: 'db/payments',
        autoload: true
    }), 60),

    dbSystem: syncNedb(new Datastore({
        filename: 'db/system ',
        autoload: true
    }), 60)

};
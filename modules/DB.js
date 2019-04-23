const syncNedb = require('./syncNedb');
const Datastore = require('nedb');

module.exports={
	
	dbTransfers:syncNedb(new Datastore({
		filename: 'db/transfers',
		autoload: true
	}), 60)	
	
}	


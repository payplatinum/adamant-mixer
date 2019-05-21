
/**
 * @description http watched DB tables
 */

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./modules/DB');
const port = 36669;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.get('/db', (req, res) => {
    const tb = db[req.query.tb];
    if (!tb){
        res.json({err: 'tb not find'});
        return;
    }
    tb.find({}, (err, docs) => res.json(docs || {err}));
});

app.listen(port, () => console.info('Server listening on port ' + port + ' http://localhost:' + port));
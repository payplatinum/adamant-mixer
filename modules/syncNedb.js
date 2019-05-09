module.exports = (db, compact) => {
	
    db.__proto__.syncInsert = async function (q) {
        return new Promise((resolve) => {
            this.insert(q, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    }

    db.__proto__.syncFind = async function (q) {
        return new Promise((resolve) => {
            this.find(q, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    };

    db.__proto__.syncFindOne = async function (q) {
        return new Promise((resolve) => {
            this.findOne(q, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    };

    db.__proto__.syncUpdate = async function (a, b, c = {}) {
        return new Promise((resolve) => {
            this.update(a, b, c, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    };

    if (compact) {
        db.persistence.setAutocompactionInterval(compact * 1000 * 60);
    }

    return db;
};
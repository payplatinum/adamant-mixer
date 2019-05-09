/**
 * @description random break amount for paths
 */
const config = require('../modules/configReader');
const _ = require('underscore');

module.exports = amount => {
    return [amount];
    
    const countPath = _.random(...(config.countPath || '2-5')
        .split('-')
        .map(n => Number(n)));

    let i = 0;
    let allAmount = 0;
    const arrAmount = [];

    while (i < countPath - 1) {
        let amountPath = _.random(0, 100 / countPath) * amount / 100 - 0.5 - config.comission || 0;
        if (amountPath < 1) {
            amountPath = 1;
        }
        allAmount += amountPath;
        arrAmount.push(amountPath);
        i++;
    };

    arrAmount.push(amount - allAmount);
    return arrAmount;
};
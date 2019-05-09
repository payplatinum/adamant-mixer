module.exports = {
    unix () {
        return +(new Date().getTime());
    }
};
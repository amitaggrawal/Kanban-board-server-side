const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    encryptPassword: function (password) {
        return bcrypt.hashSync(password, saltRounds);
    },

    compare: function(password, encryptedPassword){
        return bcrypt.compareSync(password, encryptedPassword);
    }
}

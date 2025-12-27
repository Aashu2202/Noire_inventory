const bcrypt = require('bcryptjs');

const UserHelper = {
    // Manually hash password
    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },

    // Manually compare password
    matchPassword: async (enteredPassword, hashedPassword) => {
        return await bcrypt.compare(enteredPassword, hashedPassword);
    }
};

module.exports = UserHelper;
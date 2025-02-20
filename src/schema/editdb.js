const { UserPass } = require('./table');

//display info in UserPass table
const displayUser = async() => {
    // const response = await UserPass.findAll();
    return await UserPass.findAll();
}

//register user
const register = async (user, email, pass) => {
    return await UserPass.create(
        {
            username: user,
            email,
            password: pass
        }
    );
}

module.exports = {displayUser, register};
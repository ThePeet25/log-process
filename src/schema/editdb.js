const Users = require('./table');

//display info in UserPass table
const displayUser = async() => {
    // const response = await UserPass.findAll();
    return await Users.findAll();
}

//register user
const register = async (user, email, number) => {
    return await Users.create(
        {
            username: user,
            email,
            number
        }
    );
}

module.exports = {displayUser, register};
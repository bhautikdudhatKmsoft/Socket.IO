const User = require('../model/user.model');

module.exports = class userServices {

    // add user 

    async addUser(body) {
        try {
            return await User.create(body);
        } catch (error) {
            console.log(error);
            return error.message;
        }
    };

    // get user 

    async getUser(body) {
        try {
            return await User.findOne(body);
        } catch (error) {
            console.log(error);
            return error.message;
        }
    };

    // get user by id 

    async getUserById(id) {
        try {
            return await User.findOne({ userId: id }); 
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }
    

    // update user 

    async updateUser(id, body, pushData = false) {
        try {
            const updateQuery = pushData
                ? { $push: body } // Push message into the chats array
                : { $set: body }; // Normal update
    
            return await User.findOneAndUpdate({ userId: id }, updateQuery, { new: true });
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }    
    
    
}
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    userId : {
        type : String,
        required : true
    },

    joinDate : {
        type : Date,
        default : Date.now
    },

    joinTime : {
        type : String,
        default : () => new Date().toLocaleTimeString()
    },

    chats : {
        type : [String]
    },

    leaveDate : {
        type : Date
    },
    
    leaveTime : {
        type : String
    },
});

module.exports = mongoose.model('user',userSchema);
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin:d2e0e0p4@cluster0.ilnw4gc.mongodb.net/paytm");

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true,
        trim : true,
        maxLength : 30,
        minLength : 3,
        unique : true,
        lowercase : true
    },
    firstname: {
        type : String,
        required : true,
        trim : true,
        maxLength : 50
    },
    lastname: {
        type : String,
        required : true,
        trim : true,
        maxLength : 50
    },
    password: {
        type : String,
        required : true,
        minLength : 6
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    balance: {
        type : Number,
        required : true
    }
});

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);
module.exports = {
    User,
    Account
};
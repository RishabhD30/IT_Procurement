const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        email :{type : String , 
        required : true,
        },
        password : {
            type: String,
            required : true,
        },
        role : {
            type : String,
            required : true
        }
    },{timestamp:true});

const UserModel = mongoose.model('UserModel' , UserSchema)

module.exports = UserModel;
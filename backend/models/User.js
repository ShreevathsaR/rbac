const mongoose = require("mongoose")


const UserSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true 
    },
    password:{
        type: String,
        reqiured: true
    }
})

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
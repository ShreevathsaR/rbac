const express = require("express")
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://c2cconnect:p4BnARVJxyzi0cju@3eapp.v79u0ru.mongodb.net/3EAPP')

app.get('/users', (req, res) => {
    UserModel.find({}).then(function(users){
        res.json(users)
    }).catch(function (err){
        console.log(err)
    })
})

app.post('/createUser', (req,res)=>{
    const user = req.body;
    const newUser =new UserModel(user);

})

app.listen(5000, () => {
    console.log("Server is running on port 5000!!")
})
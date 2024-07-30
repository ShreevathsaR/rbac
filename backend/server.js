const express = require("express")
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const cors = require('cors')
const app = express();

app.use(express.json());

app.use(cors())

mongoose.connect('mongodb+srv://c2cconnect:p4BnARVJxyzi0cju@3eapp.v79u0ru.mongodb.net/3EAPP')

app.get('/users', (req, res) => {
    UserModel.find({}).then(function(users){
        res.json(users)
    }).catch(function (err){
        console.log(err)
    })
})

app.post('/createUser', async (req,res)=>{

    const newUser = new UserModel(req.body);
    await newUser.save()
    .then(user =>{
        res.status(201).json(user)
    })
    .catch(err =>{
        console.log(err)
        res.status(400).send('Bad Request')
    })

})

app.post('/login', async (req,res)=>{
    const {email, password} = req.body;
    await UserModel.findOne({email: email})
    .then(user => {
        if(user){
            if(user.password == password){
                res.send(`Successfully logged in ${user.email}!!`)
            } else {
                res.status(404).send("Invalid password or username try again!!")
            }
        }
        else{
            res.send("User not found")
        }
    })
    .catch(err=>{
        res.status(404).json({
            "msg": "Username or Password wrong!!"
        });
    })
}) 

app.listen(5000, () => {
    console.log("Server is running on port 5000!!")
})
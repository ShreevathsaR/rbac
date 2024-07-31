const express = require("express")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require("./models/User");
const cors = require('cors')
const jwt = require('jsonwebtoken');
const verifyToken = require("./middlewares/authMiddleware");
const app = express();
require('dotenv').config();


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

    const {email, password} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({...req.body,password:hashedPassword} );
    await newUser.save()
    .then(user =>{
        res.status(201).json(user)
    })
    .catch(err =>{
        console.log(err)
        res.status(400).send('Bad Request')
    })

})

const PRIVATE_KEY = process.env.JWT_SECRET
console.log(PRIVATE_KEY)

app.post('/login', async (req,res)=>{
    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({email})
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                const accessToken = jwt.sign({id:user._id, email:user.email}, process.env.JWT_SECRET)
                res.json({accessToken})
            }else{
                res.status(400).json({message:'Login Failed!!'})
            }
        }
        else{
            res.status(400).json({message:'User not found!!'})
        }
    } catch (error) {
        console.log(error)
    }
})

app.get('/protected', verifyToken, (req, res) => {
    res.json({
        message: 'You are in protected route',
        user: req.body
    })
})

app.listen(5000, () => {
    console.log("Server is running on port 5000!!")
})
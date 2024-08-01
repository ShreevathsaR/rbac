const express = require("express")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require("./models/User");
const ProjectModel = require("./models/Projects");
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
// console.log(PRIVATE_KEY)

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

app.post('/createproject', async (req, res) => {
    const { name, owner, collaborators } = req.body;

    if (!mongoose.Types.ObjectId.isValid(owner) || collaborators.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).send('Invalid ObjectId format');
    }

    const newProject = new ProjectModel({ name, owner, collaborators });

    try {
        const project = await newProject.save();
        // console.log(`This is project owner id: ${project.owner}`);
        // console.log(`This is project collaborators id: ${project.collaborators}`);

        const projectOwnerId = project.owner;
        const projectCollaboratorsId = project.collaborators;

        const ownerData = await UserModel.findById(projectOwnerId).exec();
        const ownerEmail = ownerData ? ownerData.email : 'Owner email not found';

        const collaboratorsData = await UserModel.find({ _id: { $in: projectCollaboratorsId } }).exec();
        const collaboratorsEmails = collaboratorsData.map(collaborator => collaborator.email);

        res.status(201).json({
            project,
            ownerEmail,
            collaboratorsEmails
        });

        // console.log('Owner Email:', ownerEmail);
        // console.log('Collaborators Emails:', collaboratorsEmails);
    } catch (err) {
        console.error('Error saving project or fetching user emails:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/projects', async (req, res) => {  // Server request for fetching the projects of a user
    const ownerId = req.query.id;  // Use req.query to extract the query parameter

    
    if (!ownerId) {
        return res.status(400).json({ message: "Owner ID is required" }); // Handle missing owner ID
    }

    try {
        const projectData = await ProjectModel.find({ owner: ownerId }).exec();

        if (projectData.length === 0) {
            return res.status(404).json({ message: "No projects found for this owner" }); // Handle case where no projects are found
        }

        const projectDetails = await Promise.all(projectData.map(async project => {
            const ownerData = await UserModel.findById(project.owner).exec();
            const ownerEmail = ownerData ? ownerData.email : 'Owner email not found';

            const collaboratorsData = await UserModel.find({ _id: { $in: project.collaborators } }).exec();
            const collaboratorsEmail = collaboratorsData.map(collaborator => collaborator.email);

            return {
                ...project._doc, // spread the project document data
                ownerEmail,
                collaboratorsEmail
            };
        }));

        console.log(projectDetails);
        res.json(projectDetails);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000!!")
})
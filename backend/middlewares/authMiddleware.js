const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = (req, res, next) => {
    const accessToken = req.headers['authorization']
    if(!accessToken){
        return res.status(401).json({
            message: 'No token, authorization denied'
        })
    }
    try{
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        req.body = decoded
    }catch(err){
        return res.status(401).json({
            message: 'Token is not valid'
        })
    }
    return next();
};

module.exports = verifyToken
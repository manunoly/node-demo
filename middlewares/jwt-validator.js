const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const validateJWT = async (req = request, res = response, next) => {
    let token = '';
    let bearerToken = req.header('Authorization');
    if (bearerToken && bearerToken.startsWith("Bearer ")) {
        token = bearerToken.substring(7, bearerToken.length);
    }

    if (!token) {
        return res.status(401).json({
            msg: 'Not token found'
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        let user = await User.findById(id);
        user.id = id;

        if (!user) {
            return res.status(401).json({
                msg: 'Not valid token or user not exists'
            })
        }

        if (!user.active) {
            return res.status(401).json({
                msg: 'Not valid token or user not active'
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("🚀 ~ file: jwt-validator.js ~ line 38 ~ validateJWT ~ error", error)
        res.status(500).json({
            msg: "Unexpected error",
            details: error?.message
        });
    }

}


module.exports = {
    validateJWT
}
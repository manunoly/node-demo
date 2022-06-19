const { response, request } = require("express")

const User = require("../models/user");

const checkConnection = (req = request, res = response) => {
    return res.json({
        msg: 'Connection Success'
    })
}

const checkConnectionDB = async (req = request, res = response) => {
    try {
        await User.findOne();
        return res.json({
            msg: 'Connection Success to DB'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error connecting to DB",
        });
    }
}

module.exports = {
    checkConnection,
    checkConnectionDB
}
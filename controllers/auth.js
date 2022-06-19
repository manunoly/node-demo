const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const { generateJWT } = require("../helpers/jwt-generator");

const login = async (req = request, res = response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: "User don't exists",
            });
        }

        if (!user.active) {
            return res.status(400).json({
                msg: "User inactive",
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Not valid password",
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Unexpected error",
        });
    }
};

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existsUser = await User.findOne({ email });
        if (existsUser) {
            return res.status(400).json({
                msg: "The user's email exists",
            });
        }
        const user = new User({ name, email, password, role });

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        await user.save();

        res.status(200)
            .send({
                message: "User Registered successfully",
                user
            })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Unexpected error",
        });
    }
};

module.exports = {
    login,
    signup,
};

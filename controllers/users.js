const { response, request } = require("express")

const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 5, from = 0, search = '', active = undefined } = req.query;
        let query = active != undefined ? { active: active } : {};
        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [{ name: regex }, { email: regex }];
        }

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(from))
                .limit(Number(limite))
        ]);

        res.json({
            total,
            users
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Unexpected error",
            details: error?.message,
        });
    }
}

const getUserByID = async (req = request, res = response) => {
    const user = await User.findById(req.params.id);
    return res.json({ msg: "Success", user })
}


const setUser = async (req = request, res = response) => {
    try {

        const { name, email, password, role, active = undefined } = req.body;

        const existsUser = await User.findOne({ email });
        if (existsUser) {
            return res.status(400).json({
                msg: "The user's email exists",
            });
        }

        const user = new User({ name, email, password, role });

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        user.active = active != undefined ? active : true;

        await user.save();

        res.status(201).json({
            msg: "User created",
            user
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Unexpected error",
            details: error?.message
        });
    }
}

const updateUser = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, google, email, ...userData } = req.body;

        const existsUser = await User.findById(id);
        if (!existsUser) {
            return res.status(400).json({
                msg: "The user do not exists",
            });
        }

        if (existsUser._id != req.user.id && req.user.role != 'ADMIN') {
            return res.status(400).json({
                msg: `Not allow to perform this operation, not admin or is not your user`,
            });
        }

        if (password) {
            const salt = bcryptjs.genSaltSync();
            userData.password = bcryptjs.hashSync(password, salt);
        }

        const user = await User.findByIdAndUpdate(id, userData, { new: true });

        res.json({ msg: "User updated", user });
    } catch (error) {
        return res.status(500).json({
            msg: "Unexpected error",
            details: error?.message,
        });
    }
}


const deleteUser = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { active: false }, { new: true });

        res.json({ msg: "User set inactive", user });

    } catch (error) {
        return res.status(500).json({
            msg: "Unexpected error",
            details: error?.message,
        });
    }
}

const existEmail = async (req = request, res = response) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                msg: "The user's email exists",
                exist: true
            });
        }

        return res.status(200).json({
            msg: "Email not exists",
            exist: false
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Unexpected error",
            details: error?.message,
        });
    }
}

module.exports = {
    getUsers,
    setUser,
    updateUser,
    deleteUser,
    existEmail,
    getUserByID
}
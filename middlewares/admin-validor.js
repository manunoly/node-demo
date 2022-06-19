const { validationResult } = require('express-validator');

const isAdmin = (req, res, next) => {
    if (req.user.role != 'ADMIN') {
        return res.status(401).json({ msg: 'Operation not allowed for this user' });
    }
    next();
}

const hasRole = (...roles) => {
    return (req, res = response, next) => {

        if (!req.user) {
            return res.status(500).json({
                msg: 'Token must be validate first'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `Operation not allowed for this role ${req.user.role}`
            });
        }

        next();
    }
}

module.exports = {
    isAdmin,
    hasRole
}

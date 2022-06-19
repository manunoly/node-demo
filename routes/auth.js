const { Router } = require('express');
const { check } = require('express-validator');

const { fieldsValidations } = require('../middlewares/fields-validator');

const { login, signup } = require('../controllers/auth');


const router = Router();

router.post('/login', [
    check('email', 'Required').isEmail(),
    check('password', 'Required').not().isEmpty(),
    fieldsValidations
], login);

router.post('/signup', [
    check('name', 'Required').notEmpty(),
    check('email', 'Required').isEmail(),
    check('password', 'Required').not().isEmpty(),
    fieldsValidations
], signup);

module.exports = router;
const { Router } = require('express');

const { check } = require('express-validator');
const { fieldsValidations } = require('../middlewares/fields-validator');

const { getUsers, existEmail, getUserByID, setUser, updateUser, deleteUser } = require('../controllers/users');
const { validateJWT } = require('../middlewares/jwt-validator');
const { isAdmin, hasRole } = require('../middlewares/admin-validor');

const router = new Router();

router.get('/', [
    validateJWT,
    isAdmin,
    check('active').optional().isBoolean(),
    fieldsValidations
], getUsers);

router.get('/:id', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('id', 'Not valid ID').isMongoId(),
    fieldsValidations
], getUserByID);

router.post('/', [
    validateJWT,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be at least 6 letters').isLength({ min: 6 }),
    check('email', 'Not valid email').isEmail(),
    fieldsValidations
], setUser);

router.put('/:id', [
    validateJWT,
    check('id', 'Not valid ID').isMongoId(),
    fieldsValidations
], updateUser);


router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Not valid ID').isMongoId(),
    fieldsValidations
], deleteUser);

router.get('/email/:email', [
    check('email', 'Required').isEmail(),
    fieldsValidations
], existEmail);

module.exports = router;

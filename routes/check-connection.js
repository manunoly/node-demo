const { Router } = require('express');
const { checkConnection, checkConnectionDB } = require('../controllers/check-connection');


const router = new Router();


router.get('/', checkConnection);
router.get('/db', checkConnectionDB);

module.exports = router;

var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/userController');

router.get('/', user_controller.user_logout_get);
router.post('/', user_controller.user_logout_post);

module.exports = router;

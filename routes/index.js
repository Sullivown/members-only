var express = require('express');
var router = express.Router();

const post_controller = require('../controllers/postController');

/* GET home page. */
router.get('/', post_controller.post_list);

router.post('/', post_controller.post_create_post);

module.exports = router;

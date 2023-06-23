const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const schema  =require('../middlewares/schema/schema')
const {validate,authentication,authorization} = require('../middlewares/user.middleware')
const {getLogs} = require('../controllers/logs.controller');

router.get('/getLogs',authentication,authorization,getLogs)

module.exports = router;
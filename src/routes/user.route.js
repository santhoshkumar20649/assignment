const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const schema  =require('../middlewares/schema/schema')
const {validate,authentication,authorization} = require('../middlewares/user.middleware')
const {createUser,loginUser,deleteUser,getUsers,updateUser} = require('../controllers/user.controller')

router.post('/login',validate(checkSchema(schema.login)),loginUser)
router.post('/createUser',authentication,validate(checkSchema(schema.createUser)),authorization,createUser)
router.delete('/deleteUser',authentication,validate(checkSchema(schema.updateUser)),authorization,deleteUser)
router.put('/updateUser',authentication,validate(checkSchema(schema.updateUser)),authorization,updateUser)
router.get('/getUsers',authentication,getUsers)
module.exports = router;
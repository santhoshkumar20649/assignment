const {User} = require('../models/user.entity')
const constant = require('../utilities/constant')
const jwt = require('jsonwebtoken');
const { v4} = require('uuid');
const {logger} = require('../utilities/logger')

async function loginUser(req,res) {
    logger(req.user,req.originalUrl)
    try {
        const {email,password} = req.body;
        // const [getUser] = await  User.findOne({email:email,password:password})
        const [getUser] = await  User.query(constant.queries.getUserByEmailAndPassword,[email,password])
        if(getUser) {
            const payload = {
                id: getUser.id,
                name: getUser.name,
                role: getUser.role,
                email: getUser.email
            }
            const token = jwt.sign(payload,constant.jwt.secretKey, constant.jwt.expiresIn);
            res.send({status:constant.successMessages.loggedIn,accessToken: token,user:getUser}).status(200)
        } else {
            const [getRegisteredUSer] = await  User.query(constant.queries.getUserByEmail,[email])
            if(getRegisteredUSer) {
                res.send({error:constant.errorMessages.invalidPassword}).status(400)
            } else {
                res.send({error:constant.errorMessages.userNotFound}).status(400)
            }
        }
    } catch (error) {
        console.log(err);
        res.send(error)
    }
}
async function createUser(req,res) {
    logger(req.user,req.originalUrl)
    const { email,password,name,role} = req.body;
    const [getUserByEmail] = await User.query(constant.queries.getUserByEmail,[email]);
    if(getUserByEmail) {
        res.send({error:constant.errorMessages.emailAlreadyExist}).status(200)
    }
    const user = new User()
    user.email = email;
    user.password = password;
    user.name = name;
    user.role = role;
    user.id = v4()
    user.createdAt = new Date();
    user.updatedAt = new Date();
    const savedUser = await user.save()
    res.send({status: constant.successMessages.created,user: savedUser}).status(200)
}

async function updateUser(req,res) {
    logger(req.user,req.originalUrl)
    console.log('updateUser')
    const { email,password,name,role,id} = req.body;
    const [getUserById] = await User.query(constant.queries.getUserById,[id]);
    if(getUserById) {
        if((getUserById.role === 'BASIC' &&  ['SUPER_ADMIN','ADMIN'].includes(req.user.role)) ||
        (getUserById.role === 'ADMIN' &&  ['SUPER_ADMIN',].includes(req.user.role)) || (getUserById.role != 'SUPER_ADMIN')) {
            if(email) {
                const [getUserByEmail] = await User.query(constant.queries.getUserByEmail,[email]);
                if(getUserByEmail) {
                    res.send({error:constant.errorMessages.emailAlreadyExist}).status(400)
                }
            }
            getUserById.name = name ? name : getUserById.name;
            getUserById.email = email ? email : getUserById.email;
            getUserById.password = password ? password : getUserById.password;
            getUserById.role = role ? role : getUserById.role;
            getUserById.updatedAt = new Date()
            const update = await User.update({id:id},getUserById);
            if(update.affected) {
                return res.send({status:constant.successMessages.updated,user:getUserById}).status(400)
            }
        } else {
            return res.send({error:constant.errorMessages.unauthorized}).status(400)
        }
        
    } else {
        return res.send({error:constant.errorMessages.userNotFound}).status(400)
    }
    
}

async function deleteUser(req, res) {
    logger(req.user,req.originalUrl)
    const { id } = req.body;
    const [getUserById] = await User.query(constant.queries.getUserById,[id])
    if(!getUserById) {
        res.send({error: constant.errorMessages.userNotFound}).status(404);
    } else {
        if((getUserById.role === 'BASIC' &&  ['SUPER_ADMIN','ADMIN'].includes(req.user.role)) ||
        (getUserById.role === 'ADMIN' &&  ['SUPER_ADMIN',].includes(req.user.role)) || 
        (getUserById.role != 'SUPER_ADMIN')) {
            await User.query(constant.queries.deleteUserById,[id])
            res.send({status:constant.successMessages.deleted}).status(200)
        } else {
            return res.send({error:constant.errorMessages.unauthorized}).status(400)
        }
        
    }
}

async function getUsers(req,res) {
    logger(req.user,req.originalUrl)
    if(req.user.role != 'SUPER_ADMIN') {
        res.send({error:constant.errorMessages.unauthorized}).status(400)
    } else {
        const users = await User.find()
        res.send({data:users}).status(200)
    }
}
module.exports = {createUser,loginUser,deleteUser,updateUser,getUsers};
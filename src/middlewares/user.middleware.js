const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user.entity');
const constant = require('../utilities/constant');


const validate = validations => {
    return async (req, res, next) => {
      await Promise.all(validations.map(validation => {
       return validation.run(req)
      }));  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }  
      let errorPayload = {
        error: errors.array()[0].msg 
      }
      console.log(errorPayload)
      return res.status(400).json(errorPayload);
    };  
};

function authentication(req,res,next) {
    const token = req.headers.authorization.split(' ')[1]
    if(!token) return res.send({ error: constant.errorMessages.unauthorized }).status(401);

    jwt.verify(token, constant.jwt.secretKey,async  (err, decoded) => {
      if (err) return res.send({ error: constant.errorMessages.unauthorized }).status(401); 
        const [isValidUser] = await User.query(constant.queries.getUserById,[decoded.id])
        if(isValidUser) {
            req.user = isValidUser;
            next();
        } else {
            return res.send({ error: constant.errorMessages.unauthorized }).status(401);
        }
    });

}

function authorization(req,res,next) {
    const {role} = req.user;
    const superAdminAccessiblePaths = [
        '/user/createUser',
        '/user/deleteUser',
        '/user/updateUser',
        '/user/login',
        '/user/getUsers',
        '/feed/createFeed',
        '/feed/updateFeed',
        '/feed/deleteFeed',
        '/feed/updateFeedAccess',
        '/logs/getLogs'
    ]
    const adminAccessiblePaths = [
        '/user/createUser',
        '/user/deleteUser',
        '/feed/updateFeedAccess'
    ]

    const basicUserAccessiblePaths = [
        '/feed/getFeeds'
    ]

    switch (role) {
        case 'SUPER_ADMIN':
            if(!superAdminAccessiblePaths.includes(req.originalUrl)) 
                return res.send({error:constant.errorMessages.unauthorized}).status(400);
            break;
        case 'ADMIN':
            if(!adminAccessiblePaths.includes(req.originalUrl))
                return res.send({error:constant.errorMessages.unauthorized}).status(400);
            break;
        case 'BASIC':
            if(!basicUserAccessiblePaths.includes(req.originalUrl))
                return res.send({error:constant.errorMessages.unauthorized}).status(400);
            break;
        default:
            return res.send({error:constant.errorMessages.unauthorized}).status(400);
            break;
    }
    
    next()
}


module.exports = {validate,authentication,authorization}
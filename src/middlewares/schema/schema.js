const {User} = require('../../models/user.entity')
const constant = require('../../utilities/constant')
const emailValidation = {
    notEmpty: {
      errorMessage: 'Email should not be empty',
      bail: true,
    },
    isEmail: {
      errorMessage: 'Please provide valide email',
      bail: true,
    },
    bail: true,
    trim: true,
    toLowerCase: true,
}
const passwordvalidation = {
    notEmpty: {
        errorMessage: 'Password should not be empty',
        bail: true,
    },
    isLength: {
        errorMessage: 'Password should be min 6 and max 20 characters', //fieldTenantNameLen
        options: { min: 6, max:20 },
        bail: true,
    },
    bail: true,
    trim: true,
    toLowerCase: true,
}
const nameValidation = {
    notEmpty: {
        errorMessage: 'Name should not be empty',
        bail: true,
    },
    bail: true,
    trim: true,
    toLowerCase: true,
}
module.exports = {
    createUser:{
        email: emailValidation,
        name: nameValidation,
        password: passwordvalidation,
        role: {
            notEmpty: {
                errorMessage: 'Role should not be empty',
                bail: true,
            },
            custom: {
                errorMessage: 'Role should be ADMIN or BASIC', 
                options: (value,{req}) =>{
                    return ['ADMIN','BASIC'].includes(value)
                },
            },
            custom: {
                errorMessage: constant.errorMessages.unauthorized, 
                options: (value,{req}) =>{
                    return req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN'
                },
            },
            bail: true,
            trim: true,
            toUpperCase: true,
        }
    },
    login: {
        email: emailValidation,
        password: passwordvalidation,
        bail: true,
        trim: true,
        toLowerCase: true,
    },
    updateUser: {
        id: {
            notEmpty: {
                errorMessage: 'Please provide id in req.body',
                bail: true,
            },
        }
    },


    createdFeed:{
        name:{
            notEmpty: {
                errorMessage: constant.errorMessages.provideFeedName,
                bail: true,
            },
        },
        url:{
            notEmpty: {
                errorMessage: constant.errorMessages.provideFeedUrl,
                bail: true,
            },
        },
        description:{
            notEmpty: {
                errorMessage: constant.errorMessages.provideFeedDescription,
                bail: true,
            },
        }
    },
    updateFeed:{
        id: {
            notEmpty: {
                errorMessage: constant.errorMessages.proviceFeedId,
                bail: true,
            },
        }
    },
    deleteFeed:{
        id: {
            notEmpty: {
                errorMessage: constant.errorMessages.proviceFeedId,
                bail: true,
            },
        }
    }
}
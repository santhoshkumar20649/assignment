module.exports.jwt = {
    secretKey: 'MysecretKey',
    expiresIn: {
        expiresIn: '5h'
    },
}
module.exports.errorMessages= {
    internalServerError: 'Internal server error',
    invalidPassword: 'Invalid password',
    userNotFound: 'User not found',
    unauthorized:'Unauthorized',
    emailAlreadyExist: 'User already registered with given email',
    provideFeedName: 'Please provide feed name',
    proviceFeedId:'Please provide id',
    provideFeedUrl: 'Please provide feed Url',
    provideFeedDescription: 'Please provide feed description',
    feedNotFound: 'Feed not found',
    somethingWentWrong: 'something went wrong'

}

module.exports.queries = {
    getUserByEmailAndPassword: `select * from user where email=? and password=?`,
    getUserByEmail: `select * from user where email=?`,
    getUserById: `select * from user where id=?`,
    deleteUserById: `Delete from user where id=?`,

    getFeedById: 'select * from feed where id=?',
    getFeedAccessByUserId: 'select * from feedaccess where userId=?',
    getFeedsWithAccess: `select * from feed f inner join feedacess fa fa.feedId=f.id where fa.userId=? and fa.hasAccess is true order by f.createdAt desc`,
    getAllFeeds: 'select * from feed order by createdAt desc'
}

module.exports.successMessages = { 
    loggedIn: 'Successfully logged in',
    updated: 'Successfully updated',
    deleted: 'Successfully Deleted',
    created: 'Successfully created'
}
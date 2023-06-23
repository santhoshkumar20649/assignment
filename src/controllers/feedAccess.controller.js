const {User} = require('../models/user.entity')
const {FeedAccess} = require('../models/feedAccess.entity');
const {Feed} = require('../models/feed.entity')
const { queries, successMessages, errorMessages } = require('../utilities/constant');
const { v4} = require('uuid');
async function updateFeedAccess(req, res) {
    try {
        logger(req.user,req.originalUrl)
        let {user, body} = req;
        let {feedId, hasDeleteAccess = null, hasAccess = null, userId = null} = body;
        let {id} = user;

        let [[getUserById],[getAuthoorizedUserFeedAccess],[isValidFeed],[isValidUser]] = await Promise.all([
            await User.query(queries.getUserById,[id]),
            await FeedAccess.query(queries.getFeedAccessByUserId,[id]),
            await Feed.query(queries.getFeedById,[feedId]),
            await User.query(queries.getUserById,[userId])
        ])
        if(getUserById.role === 'ADMIN'){if(!getAuthoorizedUserFeedAccess || (getAuthoorizedUserFeedAccess && !Boolean(getAuthoorizedUserFeedAccess.hasAccess)))
                res.send({error: 'dont have accss'}).status(400)};
        if(!isValidFeed) res.send({error:errorMessages.feedNotFound}).status(400);
        if(!isValidUser) res.send({error:errorMessages.userNotFound}).status(400); 

            let [getFeedAccess] = await FeedAccess.query(`select fa.* from feedaccess fa inner join user u on u.id=fa.userId
            where feedId = ? and userId = ?`, [feedId, userId]);
            if(getFeedAccess) {
                getFeedAccess.hasDeleteAccess = hasDeleteAccess ? hasDeleteAccess : getFeedAccess.hasDeleteAccess;
                getFeedAccess.hasAccess = hasAccess ? hasAccess : getFeedAccess.hasAccess;
                getFeedAccess.updatedAt = new Date();
                const update = await FeedAccess.update({id:getFeedAccess.id},getFeedAccess)
                if(update.affected) {
                    res.send({status:successMessages.updated})
                }
            } else {
                let feedAccess = {};
                feedAccess.id = v4();
                feedAccess.hasDeleteAccess = hasDeleteAccess
                feedAccess.hasAccess = hasAccess
                feedAccess.userId = userId
                feedAccess.feedId = feedId
                feedAccess.createdAt = new Date()
                feedAccess.updatedAt = new Date()
                await FeedAccess.save(feedAccess)
                let [getFeedAccess] = await FeedAccess.query(`select fa.* from feedaccess fa inner join user u on u.id=fa.userId
                where feedId = ? and userId = ? and id = ?`, [feedId, userId, feedAccess.id])
                if(getFeedAccess) return res.send({status:successMessages.created})
                else res.send({status:errorMessages.somethingWentWrong})
            }
            

    } catch (error) {
        logger(req.user,error)
        res.send({error:errorMessages.internalServerError,errorData:error}).status(500)
    }
}

module.exports = {updateFeedAccess}
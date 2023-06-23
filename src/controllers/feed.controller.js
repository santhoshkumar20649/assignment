const {Feed} = require('../models/feed.entity');
const { v4} = require('uuid');
const {logger} = require('../utilities/logger')
const {errorMessages,successMessages,queries} = require('../utilities/constant');
const { FeedAccess } = require('../models/feedAccess.entity');
async function createFeed(req,res) {
    try {
        logger(req.user,req.originalUrl)
        const {name,url,description} = req.body;

        let feed = new Feed();
        feed.id = v4();
        feed.name = name;
        feed.url = url;
        feed.description = description;
        feed.createdAt = new Date();
        feed.updatedAt = new Date();
        const savedFeed = await feed.save();
        res.send({status:successMessages.created,data:savedFeed}).status(200)
    } catch (error) {
        logger(req.user,error)
        res.send({error:errorMessages.internalServerError}).status(500)
    }
}
async function updateFeed(req,res) {
    try {
        logger(req.user,req.originalUrl)
        const {id,name,url,description} = req.body;
        let [getFeedById] = await Feed.query(queries.getFeedById,[id]);
        if(!getFeedById) return res.send({error:errorMessages.feedNotFound}).status(400);
        getFeedById.name = name ? name : getFeedById.name;
        getFeedById.url = url ? url : getFeedById.url;
        getFeedById.description = description ? description : getFeedById.description;
        getFeedById.updatedAt = new Date();

        const update = await Feed.update({id:getFeedById.id},getFeedById);
        if(update.affected) 
        return res.send({status:successMessages.updated,feed:getFeedById});
    } catch (error) {
        logger(req.user,error)
        res.send({error:errorMessages.internalServerError,errorData:error}).status(500)
    }
}

async function deleteFeed(req,res) {
    try {
        logger(req.user,req.originalUrl)
        const {id} = req.body;
        let [getFeedById] = await Feed.query(queries.getFeedById,[id]);
        if(!getFeedById) return res.send({error:errorMessages.feedNotFound}).status(400);

        await Feed.delete({id:getFeedById.id});
        res.send({status:successMessages.deleted});
    } catch (error) {
        logger(req.user,error)
        res.send({error:errorMessages.internalServerError,errorData:error}).status(500)
    }
}

async function getFeeds(req, res) {
    try {
        logger(req.user,req.originalUrl)
        const {role,id} = req.user;
        feeds = await FeedAccess.query( role != 'SUPER_ADMIN' ? queries.getFeedsWithAccess : queries.getAllFeeds,[id])
        return res.send({feeds})
    } catch (error) {
        logger(req.user,error);
        res.send({error:errorMessages.internalServerError,errorData:error}).status(500)
    }
}

module.exports = {createFeed,deleteFeed,updateFeed,getFeeds}
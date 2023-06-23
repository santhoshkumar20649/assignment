const express = require('express');
const router = express.Router();
const schema  =require('../middlewares/schema/schema')
const { checkSchema } = require('express-validator');
const {validate,authentication,authorization} = require('../middlewares/user.middleware')
const {createFeed,updateFeed,deleteFeed,getFeeds} = require('../controllers/feed.controller')
const { updateFeedAccess} = require('../controllers/feedAccess.controller')

router.post('/createFeed',authentication,validate(checkSchema(schema.createdFeed)),authorization,createFeed);
router.put('/updateFeed',authentication,validate(checkSchema(schema.updateFeed)),authorization,updateFeed);
router.delete('/deleteFeed',authentication,authentication,validate(checkSchema(schema.updateFeed)),authorization,deleteFeed)
router.get('/getFeeds',authentication,authentication,getFeeds)
router.post('/updateFeedAccess',authentication,authorization,updateFeedAccess)
module.exports = router;
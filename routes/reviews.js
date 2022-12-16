const express = require('express');
const session = require('express-session');
const router = express.Router();
const data = require('../data');
const userData = data.userData;
const eventData = data.eventData;
const reviewData = data.reviewData;

router
    .route('/:id/delete')
    .get(async(req,res) =>{
        try{
            let isDeleted = await reviewData.removeReview(req.params.reviewId);
            if (isDeleted){
                return res.redirect('/event/' + req.params.eventId);
            }
            else {
                res.status(404).send();
            }
        }catch(e){
            res.status(500).json({error:e});
        }
    })

router
    .route('/:eventId/add')
    .post(async(req,res) =>{
        if (!req.session.user){
            res.redirect('/');
        }
        let userName = req.session.user;
        let userId = await userData.getUserByName(userName).toString();
        const input = req.body;
        const rating = input.rating;
        const text = input.text;
        let isCreat = await reviewData.createReview(req.params.eventId, userId, text, rating);
        if (isCreat){
            res.redirect('/user/myProfile');
        }
        else {
            res.render('event',{
                title:'event',
                error:true,
                error_message:'can not create this review'
            })
        }
    })


module.exports = router;
const express = require('express');
const session = require('express-session');
const router = express.Router();
const data = require('../data');
const userData = data.userData;
const eventData = data.eventData;
const reviewData = data.reviewData;

router
    .route('/')
    .get(async (req, res) =>{
        if (!req.session.user){
            res.redirect('/managerLogin');
        }
        else {
            res.render('/manageEvent');
        }
    })

router
    .route('/managerLogin')
    .get(async(req, res) =>{
        res.render('managerLogin');
    })
    .post(async(req, res) => {
        let managername = req.body.managerInput;
        let managerpassword = req.body.managerpasswordInput;
        try{
            let result = await managerData.checkManager(managername,managerpassword);
            if (result.authenticatedUser){
                req.session.user = username;
                return res.redirect('/manageEvent');
            }
            else {
                res.status(500).render('managerLogin',{
                    title:'Login',
                    erroe:true,
                    error_message:"Internal Server Error"
                })
            }
        }catch(e){
            res.status(400).render('managerLogin',{
                title:'Login',
                error:true,
                error_message:e
            })
        }
    })

router
    .route('/manageEvent')
    .get(async (req, res) => {
        let events = await eventData.getAllEvents();
        res.render('manageEvent',{
            events:events
        });
    })
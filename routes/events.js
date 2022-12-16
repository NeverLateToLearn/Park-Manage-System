const express = require('express');
const session = require('express-session');
const router = express.Router();
const data = require('../data');
const userData = data.userData;
const eventData = data.eventData;
const reviewData = data.reviewData;

router
    .route('/')
    .get(async (req,res) =>{
        try{
            let userLoggedIn = false;
            if (req.session.user){
                let userName = req.session.user;
                userLoggedIn = true;
            }
            let eventsList = await eventData.getAllEvents();
            let newEventList = [];
            for (let event of eventsList){
                newEventList.push(event);
            }
            res.render('events', {events:newEventList, userLoggedIn:userLoggedIn})
        }catch(e){
            res.status(400).render('events',{
                title:'events',
                error:true,
                error_message : e
            })
        }
    })

router
    .route('/:id')
    .get(async(req,res) => {
        try{
            let userLoggedIn = false;
            if (req.session.user){
                let userName = req.session.user;
                userLoggedIn = true;
            }
            else{
                return res.render('userLogin',{title:'userLogin', error:true, error_message:'login to check event'});
            }

            let event = await eventData.getEventById(req.params.id);
            let reviewList = [];
            
            for (let review of event.reviews){
                review.user = await userData.getUserById(review.userId).username;
                reviewList.push(review);
            }
            let isUser = false;
            if (req.session.user){
                for (UserName of event.registerUsers){
                    if (UserName == userName){
                        isUser = true;
                    }
                }
            }
            res.status(200).render('event', {event:event,reviews:reviewList,userLoggedIn: userLoggedIn,isUser:isUser})
        }catch(e){
            res.status(400).redirect('/',{error:true, error_message:e});
        }
    })

router
    .route('/sport')
    .get(async (req,res) =>{
        try{
            let userLoggedIn = false;
            if (req.session.user){
                let userName = req.session.user;
                userLoggedIn = true;
            }
            let eventsList = await eventData.getEventsByType("sports");
            let newEventList = [];
            for (event of eventsList){
                newEventList.push(event);
            }
            res.render('events', {events:newEventList, userLoggedIn:userLoggedIn})
        }catch(e){
            res.status(400).render('events',{
                title:'events',
                error:true,
                error_message : e
            })
        }
    })

router
    .route('/art')
    .get(async (req,res) =>{
        try{
            let userLoggedIn = false;
            if (req.session.user){
                let userName = req.session.user;
                userLoggedIn = true;
            }
            let eventsList = await eventData.getEventsByType("art");
            let newEventList = [];
            for (event of eventsList){
                newEventList.push(event);
            }
            res.render('events', {events:newEventList, userLoggedIn:userLoggedIn})
        }catch(e){
            res.status(400).render('events',{
                title:'events',
                error:true,
                error_message : e
            })
        }
})

router
    .route('/concert')
    .get(async (req,res) =>{
        try{
            let userLoggedIn = false;
            if (req.session.user){
                let userName = req.session.user;
                userLoggedIn = true;
            }
            let eventsList = await eventData.getEventsByType("concert");
            let newEventList = [];
            for (event of eventsList){
                newEventList.push(event);
            }
            res.render('events', {events:newEventList, userLoggedIn:userLoggedIn})
        }catch(e){
            res.status(400).render('events',{
                title:'events',
                error:true,
                error_message : e
            })
        }
})

router
    .route('/searchEventByName')
    .post(async (req, res) => {
        let input = req.body.searchByEventName;
        try{
            let userLoggedIn = false;
            if (req.session.user){
                let userName = req.session.user;
                userLoggedIn = true;
            }
            let event = await eventData.searchByEventName(input);
            let reviewList = [];
            if (!event){
                return res.redirect('/home',{
                    title:'event',
                    error:true,
                    error_message:'no such event'
                });
            }
            
            for (let review of event.reviews){
                review.user = await userData.getUserById(review.userId).username;
                reviewList.push(review);
            }
            let isUser = false;
            if (req.session.user){
                for (UserName of event.registerUsers){
                    if (UserName == userName){
                        isUser = true;
                    }
                }
            }
            res.render('event',{event:event,reviews:reviewList,userLoggedIn: userLoggedIn,isUser:isUser});
        }catch(e){
            res.status(400).render('home',{
                title:'event',
                error:true,
                error_message:e
            })
        }
    })

router
    .route('/searchByDate')
    .post(async(req,res) =>{
        let input = req.body.searchByDate;
        try{
            let userLoggedIn = false;
            if (req.session.user){
                let userName = req.session.user;
                userLoggedIn = true;
            }
            let event = await eventData.searchByDate(input);
            let reviewList = [];
            if (!event){
                return res.redirect('/home',{
                    title:'event',
                    error:true,
                    error_message:'there is no event at that date'
                });
            }
            
            for (let review of event.reviews){
                review.user = await userData.getUserById(review.userId).username;
                reviewList.push(review);
            }
            let isUser = false;
            if (req.session.user){
                for (UserName of event.registerUsers){
                    if (UserName == userName){
                        isUser = true;
                    }
                }
            }

            res.render('event',{event:event,reviews:reviewList,userLoggedIn: userLoggedIn,isUser:isUser});
        }catch(e){
            res.status(400).render('home',{
                title:'event',
                error:true,
                error_message:e
            })
        }
    })

router
    .route('/add')
    .post(async (req,res) => {
        const body = req.body;
        try{
            let added = await eventData.addEvent(body.type, body.name, body.capacity, body.date);
            if (!added){
                res.redirect('/manager/manageEvent',{
                    error:true,
                    error_message:'could not add event'
                });
            }
            else {
                res.redirect('/manager/manageEvent',{
                    error:true,
                    error_message:'add event successfully'
                })
            }
        }catch(e){
            res.redirect('/manager/manageEvent',{
                error:true,
                error_message:e
            })
        }
    })

router
    .route('/edit/:eventId/')
    .get(async(req,res) =>{
        let event = await eventData.getEventById(req.params.eventId);
        res.render('editEvent',{
            event:event,
            userLoggedIn:true
        });
    })

router
    .route('/edit')
    .post(async(req,res) => {
        const body = req.body;
        try{
            let isUpdate = await eventData.upDateEvent(body.type,body.name,body.capacity,body.date);
            if (isUpdate){
                res.redirect('/manager/manageEvent',{
                    error:true,
                    error_message:'upDate successfully'
                })
            }
            else {
                res.redirect('/manager/manageEvent',{
                    error:true,
                    error_message:'can not update'
                })
            }
        }catch(e){
            res.redirect('/manager/manageEvent',{
                error:true,
                error_message:e
            })
        }
    })

    /*
router
    .route('/registerEvent')
    .get(async(req.res) ={
        
    })
    */

router
    .route('/:id/registerEvent')
    .get(async(req,res) =>{
        if (!req.session.user){
            res.redirect('/');
        }
        else {
            try{
                let userName = req.session.user;
                let eventName = await getEventById(req.params.id).name;
                let isAdded = await eventData.addUerOfEvent(eventName,userName);
                let addIntoUser = await userData.userRegisterEvent(userName,eventName);
                if (isAdded && addIntoUser){
                    res.redirect('/',{error:true,error_message:'register successfully'});
                }
                else{
                    res.redirect('/',{error:true,error_message:'could not register this event'});
                }
            }catch(e){
                res.status.redirect('/',{error:true,error_message:e});
            }
        }
    })
module.exports = router;
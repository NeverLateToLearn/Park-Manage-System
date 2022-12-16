const express = require('express');
const session = require('express-session');
const router = express.Router();
const data = require('../data');
const userData = data.userData;
const eventData = data.eventData;
const reviewData = data.reviewData;

router
    .route('/')
    .get(async(req, res) => {
        res.render('home', {title : 'welcome to register event'});
    })
router
    .route('/userlogin')
    .get(async(req,res) =>{
        res.render('userLogin');
    })
    .post(async(req, res) => {
        if (req.session.user){
            res.redirect("/users/profile");
        }
        let username = req.body.usernameInput;
        let password = req.body.passwordInput;
        try{
            let result = await userData.checkUser(username,password);
            if (result.authenticatedUser){
                req.session.user = username;
                return res.redirect("/users/profile");
            }
            else {
                res.status(500).render('/userLogin',{
                    title:'Login',
                    erroe:true,
                    error_message:"Internal Server Error"
                })
            }
        }catch(e){
            res.status(400).render('userLogin',{
                title:'Login',
                error:true,
                error_message:e
            })
        }
    })

router
    .route('/register')
    .post(async (res, req) => {
        try{
            let userName = req.body.usernameInput;
            let password = req.body.passwordInput;
            let firstName = req.body.firstname;
            let lastName = req.body.lastname;
            let age = req.body.age;
            const createUser = await userData.createUser(userName,password,firstName,lastName,age);
            if (createUser){
                res.render('userLogin',{error:true,error_message:"register successfully"});
            }
            else {
                res.status(500).render('userLogin',{
                    title:'Login',
                    error:true,
                    error_message:"can not crear user"
                })
            }

          }catch(e){
            res.status(400).render('userLogin', {
              title:'Register',
              error:true,
              error_message : e,
            });
          }
    })

router
    .route('/logout')
    .get(async(req,res) =>{
        if (req.session.user){
            res.clearCookie('AuthCookie');
            res.render('logout',{title:'Logout'});
        }
        else{
            res.redirect('/');
        }
    })

    /*
router
    .route('/registerEvent')
    .post(async ( req,res) => {
        if (!req.session.user){
            return res.redirect('/userlogin');
        }
        else {
            let eventName = req.body;
            let userName = req.session.user;
            try{
                let output = await eventData.addUerOfEvent(eventName, userName);
                let output1 = await userData.userRegisterEvent(userName,ventName);
                if (output && output1){
                    res.render('userProfile', {title:'userProfile'});
                }
                else{
                    res.status(500).render('userProfile',{
                        title:'registerEvent',
                        error:true,
                        error_message:`Internal Server Error`
                    })
                }
            }catch(e){
                res.status(400).render('userProfile',{
                    title:'registerEvent',
                    error:true,
                    error_message:e
                })
            }
        }
    })
    */

router
    .route('/userProfile')
    .get(async(req,res) => {
        if (!req.session.user){
            res.status(403).render('/userLogin',{
                title:'login',
                error:true,
                error_message:"please login"
            });
        }
        else {
            let userName = req.session.user;
            let user = await userData.getUserByUserName(userName);
            let reviews = [];
            for (let i = 0; i < user.reviews.length;i++){
                let reviewFromUser = user.reviews[i];
                let curEvent = await eventData.getEventById(reviewFromUser.eventId);
                let reviewDetail = {
                    review:reviewFromUser,
                    event:curEvent
                }
                reviews.push(reviewDetail);
            }
            res.render('profile',{
                name: userName,
                firstName: user.firstName,
                lastName:user.lastName,
                age:user.age,
                reviews:reviews,
                userLoggedIn:true
            })
        }
    })

router
    .route('/myProfile')
    .get(async(req,res) =>{
        if (!req.session.user){
            return res.redirect('/user/userLogin');
        }
        else {
            const curUser = await userData.getUerByName(req.session.user);
            return res.render('myprofile', {
              userName : req.session.user,
              firstName: curUser.firstName,
              lastName: curUser.lastName,
              age: curUser.age,
              reviews:curUser.reviews,
              isEditing: false,
              userLoggedIn: true});
        }
    })
    .post(async(req,res) =>{
        let userLoggedIn = false;
        if (req.session.user){
            let userName = req.session.user;
            userLoggedIn = true;
        }
        let reqData = req.body;
        let firstName = reqData.firstName;
        let lastName = reqData.lastName;
        let age = reqData.age;
        let editedUser = {
            firstName:firstName,
            lastName:lastName,
            age:age
        }
        try{
            const updateUser = await userData.updateUser(req.session.user, editedUser.firstName,editedUser.lastName,editedUser.age);
            if (!updateUser){
                return res.status(500).render('myprofile',{
                    title:'myProfile',
                    error:true,
                    error_message:'could not update user'
                })
            }
            return res.render('myprofile',{
                userName:req.session.user,
                firstName:editedUser.firstName,
                lastName:editedUser.lastName,
                age:editedUser.age,
                userLoggedIn:true
            });
        }catch(e){
            res.status(400).json({message:e});
        }
    })
module.exports = router;
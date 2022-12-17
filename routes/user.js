const express = require('express');
const session = require('express-session');
const router = express.Router();
const data = require('../data');
const userData = data.userData;
const eventData = data.eventData;
const reviewData = data.reviewData;
const xss = require('xss');

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
            res.redirect("/user/userProfile");
        }
        let username = req.body.usernameInput;
        let password = req.body.passwordInput;
        try{
            let result = await userData.checkUser(username,password);
            if (result.authenticatedUser){
                req.session.user = username;
                return res.redirect("/user/userProfile");
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
            let body = req.req.body;
            let userName = body.usernameInput;
            let password = body.passwordInput;
            let firstName = body.firstname;
            let lastName = body.lastname;
            let age = body.age;
            const createUser = await userData.createUser(xss(userName),xss(password),xss(firstName),xss(lastName),Number(xss(age)));
            if (createUser){
                res.res.render('userLogin',{error:true,error_message:"register successfully"});
            }
            else {
                res.res.status(500).render('userLogin',{
                    title:'Login',
                    error:true,
                    error_message:"Internal Server Error"
                })
            }

          }catch(e){
            res.res.status(400).render('userLogin', {
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
            res.redirect('../');
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
            res.status(403).redirect('/user/userLogin');
        }
        else {
            try{
                let userName = req.session.user;
                let user = await userData.getUerByName(userName);
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
                    userName: userName,
                    firstName: user.firstName,
                    lastName:user.lastName,
                    age:user.age,
                    reviews:reviews,
                    userLoggedIn:true
                })
            }catch(e){
                res.status(400).redirect('/user/userLogin');
            }

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
            return res.render('myProfile', {
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
        /*
        if (typeof(age) !== 'number'){
            res.status(400).redirect('/user/Profile',{error:true,error_message:'age must be a number'});
        }
        */
        let editedUser = {
            firstName:firstName,
            lastName:lastName,
            age:age
        }
        try{
            const updateUser = await userData.updateUser(req.session.user, editedUser.firstName,editedUser.lastName,Number(editedUser.age));
            if (!updateUser){
                return res.status(500).render('profile',{
                    title:'myProfile',
                    error:true,
                    error_message:'could not update user'
                })
            }
            return res.render('profile',{
                error:true,
                error_message:'update successfully',
                userName:req.session.user,
                firstName:editedUser.firstName,
                lastName:editedUser.lastName,
                age:editedUser.age,
                userLoggedIn:true
            });
        }catch(e){
            res.status(400).render('profile',{
                title:'myprofile',
                error:true,
                error_message:e
            })
        }
    })
module.exports = router;
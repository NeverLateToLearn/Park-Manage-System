const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.userData;

router
    .route('/')
    .get(async(req, res) => {
        render('home', {title : 'welcome to register event'});
    })
router
    .route('/userlogin')
    .post(async(req, res) => {
        let username = req.body.usernameInput;
        let password = req.body.passwordInput;
        try{
            let result = await userData.checkUser(username,password);
            if (result.authenticatedUser){
                req.session.user = username;
                return res.redirect('/');
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
            let result = await userData.createUser(username,password);
            if (result.userInserted){
              return res.redirect('/');
            }
            else{
              res.status(500).render('userRegister', {
                title: 'Register',
                error: true,
                error_message: `Internal Server Error`
              })
            }
          }catch(e){
            res.status(400).render('userRegister', {
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


module.exports = router;
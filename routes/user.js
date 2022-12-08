const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.userData;

router
    .route('/')
    .get(async(req, res) => {
        
    })
router
    .route('/login')
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

module.exports = router;
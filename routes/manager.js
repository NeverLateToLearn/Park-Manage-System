const express = require('express');
const router = express.Router();
const data = require('../data');
const { route } = require('./user');
const managerData = data.managerData;

router
    .route('/managerLogin')
    .post(async(req, res) => {
        let username = req.body.usernameInput;
        let password = req.body.passwordInput;
        try{
            let result = await managerData.checkManager(username,password);
            if (result.authenticatedUser){
                req.session.user = username;
                return res.redirect('/manageEvent');
            }
            else {
                res.status(500).render('/managerLogin',{
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
        .route('/manageEvent')
        .post(async(req,res) => {
            
        })
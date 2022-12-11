const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.eventData;

router
    .route('/sport')
    .get(async (req,res) =>{
        try{
            let ans = await eventData.getSportsEvents();
            res.render('sports',{title:'sports'});
            
        }catch(e){
            res.status(400).render('sports',{
                title:'sports',
                error:true,
                error_message:e
            })
        }
    })

router
    .route('/art')
    .get(async (req,res) =>{
        try{
            let ans = await eventData.getArtEvents();
            res.render('art',{title:'art'});
            
        }catch(e){
            res.status(400).render('art',{
                title:'art',
                error:true,
                error_message:e
            })
        }
})

router
    .route('/concert')
    .get(async (req,res) =>{
        try{
            let ans = await eventData.getConcertEvents();
            res.render('concert',{title:'concert'});
            
        }catch(e){
            res.status(400).render('concert',{
                title:'concert',
                error:true,
                error_message:e
            })
        }
})

router
    .route('/searchEventByName')
    .post(async (req, res) => {
        let input = req.body;
        try{
            let output = eventData.searchByEventName(input);
            res.render('searchEventByName',{title:'event'});
        }catch(e){
            res.status(400).render('searchEventByName',{
                title:'event',
                error:true,
                error_message:e
            })
        }
    })

router
    .route('/searchByDate')
    .post(async(req,res) => {
        let intput = req.body;
        try{
            let output = envetData.searchByDate(input);
            res.render('searchByDate', {title:'envet'});
        }catch(e){
            res.status(400).render('searchByDate',{
                title:'event',
                error:true,
                error_message:e
            })
        }
    })
const mongoCollections = require('../config/mongoCollections');
const eventCollection = mongoCollections.event_collection;
const {objectId} = require('mongodb');
const { ObjectID } = require('bson');

//users can opreate
const getSportsEvents = async(

) => {}

const getArtEvents = async(

) => {}

const getConcertEvents = async(

) => {}

const searchByDate = async(
    date
) => {}

const searchByEventName = async(
    name
) => {}


//manager can opreate
const addEvent = async(
    type,
    name,
    capacity,
    date
) => {
    //check all undefined error
    if(typeof type === 'undefined'){
        throw 'type is undefined'
    }
    if(typeof name  === 'undefined'){
        throw 'name is undefined'
    }
    if(typeof capacity === 'undefined'){
        throw 'capacity is undefined'
    }
    if(typeof date === 'undefined'){
        throw 'date is undefined'
    }

    if(typeof type !== 'string'){
        throw 'type is not string'
    }
    if(typeof name !== 'string'){
        throw 'name is not string'
    }
    if(typeof capacity !== 'number'){
        throw 'capacity is not number'
    }

    type = type.trim().toLocaleLowerCase();
    if(type !== 'sport' && type !== 'art' && type !== 'concert'){
        throw 'type of event is not correct'
    }
    if(capacity < 5 || capacity > 50){
        throw 'capacity only allow 5 to 50'
    }
    //check the event name is already in datebase or not
    name = name.trim().toLocaleLowerCase();
    const collection  = await eventCollection();
    let event = await collection.findOne({name: name});
    if(await event!= null){
      throw 'eventName is already in the database';
    }

    //check the date 
    let DA = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if(date.indexOf('/') == -1){
        return false;
    }
    let arrD = date.split('/');
    if(arrD.length != 3){
        return false;
    }
    let m = parseInt(arrD[0],10);
    let d = parseInt(arrD[1],10);
    let y = parseInt(arrD[2],10);
    if(isNaN(m) || isNaN(d) || isNaN(y)){
        throw 'the date is invaild';
    }
    let curDate = new Date();
    let curYear = curDate.getFullYear()
    let curMonth = curDate.getMonth();
    let curDay = curDate.getDay();

    if(y < curYear){
        throw 'the year of date cannot be past'
    }
    if(y === curYear && m < curMonth){
        throw 'the month of date cannot be past'
    }
    if(y === curYear && m === curMonth && d < curDay){
        throw 'the day of date cannot be past'
    }
    let gap = (y - curYear)*356 + (m - curMonth)*30 + (d - curDay);
    if(gap <= 30){
        throw 'sorry we only can add the event within 30 days'
    }
    let ans = {
        type : type,
        name : name,
        capacity : capacity,
        date : date,
        space : capacity,
        reviews: [],
        overallRating: 0
    }

    const createInfo = await event.insertOne(ans);
    if(createInfo.insertedCount === 0){
        throw 'Could not create'
      }
    
    const newId = createInfo.insertedId.toString();
    //
    
}

const deleteEvent = async(
    id
) => {}

const updateEvent = async(
    type,
    name,
    capacity,
    date,
    spaces
) => {
    
}

const addUerOfEvent = async(
    eventName,
    userName
)
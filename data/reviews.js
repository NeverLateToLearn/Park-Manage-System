//post review for events
const mongoCollections = require('../config/mongoCollections');
const userCollection = mongoCollections.user_collection;
const bcrypt = require('bcrypt');
const saltRounds = 16;

const createReview = async (
    userId,
    eventId,
    review,
    rating
  ) => {
    //check all undefined error
    if(typeof userName === 'undefined'){
      throw 'userName is undefined'
    }
    if(typeof eventName === 'undefined'){
      throw 'eventName is undefined'
    }
    if(typeof review === 'undefined'){
      throw 'review is undefined'
    }
    if(typeof rating === 'undefined'){
      throw 'rating is undefined'
    }

    //check all the data type
    if(typeof userName !== 'string'){
      throw 'userName is not a string'
    }
    if(typeof eventName !== 'string'){
      throw 'eventName is not a string'
    }
    if(typeof review !== 'string'){
      throw 'review is not a string'
    }
    if(typeof rating === 'number'){
      throw 'rating is not a number'
    }

    //check is the userName 
  }

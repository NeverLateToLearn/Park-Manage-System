//post review for events
const eventFunction = require('./event');
const mongoCollections = require('../config/mongoCollections');
const userCollection = mongoCollections.user_collection;
const eventCollection = mongoCollections.event_collection;
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { arrayBuffer } = require('stream/consumers');
const saltRounds = 16;

const createReview = async (
    eventId,
    userId,
    text,
    rating,
  ) => {
    //check all undefined error
    if(typeof eventId === 'undefined'){
      throw 'userName is undefined'
    }
    if(typeof userId === 'undefined'){
      throw 'eventName is undefined'
    }
    if(typeof text === 'undefined'){
      throw 'review text is undefined'
    }
    if(typeof rating === 'undefined'){
      throw 'rating is undefined'
    }

    //check all the data type
    if(typeof eventId !== 'string'){
      throw 'review is not a string'
    }
    if(typeof rating === 'number'){
      throw 'rating is not a number'
    }
    if (typeof eventId !== 'string') {
        throw "eventId is not a string or is empty";
    }
    if (typeof text !== 'string' || text.trim().length === 0) {
        throw "review is not a string or is empty";
    }
    if(text.trim().length > 50){
        throw "review is too long";
    }
    if(!ObjectId.isValid(eventId)) {
        throw "eventId is not a Key";
    }
    if(!ObjectId.isValid(userId)) {
        throw "eventId is not a Key";
    }
    //check the event table registerusers attribute have or not have the userId
    const events = await eventCollection();
    const eId = ObjectId(eventId);

    const event = await events.findOne({_id: eId});
    if(event === null){
        throw 'No event with this id'
    }
    let pre  = false;
    let resigterUsers = await event.registerUsers;
    await resigterUsers.forEach(element => {
        if(element.toString() == userId){
            pre = true;
        }
    });
    if(pre === false){
        throw 'the user did not register this event';
    }
    //check is this user already give the review and rating
    const users = await userCollection();
    const uId = ObjectId(userId);
    const user = await users.findOne({_id: uId});
    if(user === null){
        throw 'No user with this id'
    }
    pre = true;
    let userReview = await user.reviews;
    await userReview.forEach(element => {
        if(element.eventId.toString() === eventId){
            pre = false;
        }
    });
    if(pre === false){
        throw 'the user already give this event review and rating'
    }

    //check the rating
    if(rating > 5 || rating < 1){
        throw 'rating is invaild';
    }
    if (!Number.isInteger(rating) && rating != rating.toFixed(1)) {
        throw "invalid rating";
    }
    //this is the list update to the eventcollection and also the usercollection
    const newreviews = {
        _id:ObjectId(),
        eventId: eventId,
        userId: userId,
        text: text,
        rating: rating
    };
    const updatedInfo = await eventCollection.updateOne({_id: eId}, {$push: {reviews: newreviews}});
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update review!';
    }
    const updatedInfo_2 = await userCollection.updateOne({_id: uId}, {$push: {reviews: newreviews}});
    if (updatedInfo_2.modifiedCount === 0) {
        throw 'could not update review';
    }
    //now change the overrate of the event
    let sum = 0;
    let count = 0;
    const newreview = await eventFunction.getEventById(eventId.toString());
    for(let x of newreview.reviews){
        sum = sum + x.rating;
        count++;
    }
    if(count != 0){
        const updatedInfo_3 = await eventCollection.updateOne(
            {_id: eId},
            {$set :{overallRating : parseFloat((sum / count).toFixed(1))}}
        );
        if(updatedInfo_3.modifiedCount === 1){
            return true;
        }
        else{
            throw 'can not create the review'
        }
    }
    else{
        throw 'can not create the review'
    }
}


const getReviewById = async (
    reviewId,
    userId
) => {
    //check the data type
    if(typeof reviewId == 'undefined'){
        throw 'reviewId is undefined';
    }
    if(typeof reviewId !== 'string' || reviewId.trim().length === 0){
        throw 'reviewId is is not a string or is empty'
    }
    if (!ObjectId.isValid(reviewId)) {
        throw "reviewId is not Key";
    }
    if(typeof userId == 'undefined'){
        throw 'userId is undefined';
    }
    if(typeof userId !== 'string' || userId.trim().length === 0){
        throw 'userId is is not a string or is empty'
    }
    if (!ObjectId.isValid(userId)) {
        throw "userId is not Key";
    }
    const users = await userCollection();
    let id = ObjectId(userId);
    const user = await users.findOne({_id:id})
    if (user == null){
        throw 'no user with this id'
    }
    let pre = false;
    const reviews = await user.reviews;
    await reviews.forEach(element => {
        if(element._id.toString() === reviewId){
            pre = true;
            //return json object;
            element['_id'] = element['_id'].toString();
            return element;
        }
        else{
            throw 'this user do not have the review with this review id'
        }
    });
}
  


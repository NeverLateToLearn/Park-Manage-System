//users can opreate
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const events = mongoCollections.events;
const { ObjectId } = require('mongodb');
//const validation = require('../validation');

const validation = (string) => {
    if (!string) throw 'No date found'
    if (string === undefined) throw 'undefined date'
    if (typeof string === 'string') throw 'Invalid date type'
    string = string.trim();
    if (string.length === 0) throw 'Invalid date'
}

const dateValidation = (date) => {
    let DA = [ 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if (date.indexOf('/') == -1) {
        return false;
    }
    let arrD = date.split('/');
    if (arrD.length != 3) {
        return false;
    }
    let m = parseInt(arrD[ 0 ], 10);
    let d = parseInt(arrD[ 1 ], 10);
    let y = parseInt(arrD[ 2 ], 10);
    if (isNaN(m) || isNaN(d) || isNaN(y)) {
        throw 'the date is invaild';
    }
    let curDate = new Date();
    let curYear = curDate.getFullYear()
    let curMonth = curDate.getMonth();
    let curDay = curDate.getDay();

    if (y < curYear) {
        throw 'the year of date cannot be past'
    }
    if (y === curYear && m < curMonth) {
        throw 'the month of date cannot be past'
    }
    if (y === curYear && m === curMonth && d < curDay) {
        throw 'the day of date cannot be past'
    }
    let gap = (y - curYear) * 356 + (m - curMonth) * 30 + (d - curDay);
    if (gap <= 30) {
        throw 'sorry we only can add the event within 30 days'
    }
}


const getSportsEvents = async (

) => {
    const eventCollection = await events()
    const sportEvents = eventCollection.find({ type: "sports" })
    if (!sportEvents || !sportEvents.length === 0) throw 'No sports events found'
    return sportEvents;
}

const getArtEvents = async () => {
    const eventCollection = await events()
    const artEvents = eventCollection.find({ type: "art" })
    if (!artEvents || !artEvents.length === 0) throw 'No arts events found'
    return artEvents;
}

const getConcertEvents = async (

) => {
    const eventCollection = await events()
    const concertEvents = eventCollection.find({ type: "concert" })
    if (!concertEvents || !concertEvents.length === 0) throw 'No concerts events found'
    return concertEvents;
}

const searchByDate = async (
    date
) => {
    dateValidation(date)

    const eventCollection = await events()
    const eventsByDate = eventCollection.find({ date: date })
    if (!eventsByDate || !eventsByDate.length === 0) throw 'No sports events found'
    return eventsByDate;
}

const searchByEventName = async (
    name
) => {
    validation(name)

    const eventCollection = await events()
    const eventsByName = eventCollection.find({ name: name })
    if (!eventsByName || !eventsByName.length === 0) throw 'No sports events found'
    return eventsByName;
}


//manager can opreate
const addEvent = async (
    type,
    name,
    capacity,
    date
) => {
    validation(type)
    validation(name)
    dateValidation(date)

    //checking capacity
    if (!capacity) throw 'No date found'
    if (capacity === undefined) throw 'undefined date'
    if (typeof capacity === 'number') throw 'Invalid date type'

    const collection = await eventCollection();
    let event = await collection.findOne({ name: name });
    if (await event != null) {
        throw 'eventName is already in the database';
    }

    let ans = {
        type: type,
        name: name,
        capacity: capacity,
        date: date,
        space: capacity,
        resigterUsers: [],
        reviews: [],
        overallRating: 0
    }

    const createInfo = await event.insertOne(ans);
    if (createInfo.insertedCount === 0) {
        throw 'Could not create'
    }

    return { message: "Event created successfully" }
}

const deleteEvent = async (
    id
) => {
    //checking id
    if (id === undefined) throw 'Invalid id'
    if (typeof id !== 'string') throw 'Invalid id'
    id = id.trim();
    if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;

    const eventCollection = await events();
    const deletionInfo = await eventCollection.deleteOne({ _id: ObjectId(id) });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with id of ${id}`;
    }
    return true;
}

const updateEvent = async (
    id,
    type,
    name,
    capacity,
    date
) => {

    validation(type)
    validation(name)
    dateValidation(date)

    //checking capacity
    if (!capacity) throw 'No date found'
    if (capacity === undefined) throw 'undefined date'
    if (typeof capacity === 'number') throw 'Invalid date type'

    //checking id
    if (id === undefined) throw 'Invalid id'
    if (typeof id !== 'string') throw 'Invalid id'
    id = id.trim();
    if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;

    let userUpdateInfo = {
        type: type,
        name: name,
        capacity: capacity,
        date: date,
        space: capacity,
    };

    const eventCollection = await events();
    const updateInfo = await eventCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update failed';
    return { message: "Event updated successfully" };
}

const addUerOfEvent = async (
    eventName,
    userName
) => {
    validation(eventName)
    validation(userName)
}

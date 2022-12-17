const mongoCollections = require('../config/mongoCollections');
const userCollection = mongoCollections.user_collection;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const { ObjectId } = require('mongodb');


//createUser
const createUser = async (
    userName, 
    passWord,
    firstName,
    lastName,
    age
  ) => {
    //all undefined error check
    if(typeof(userName) === 'undefined'){
      throw 'username is undefined'
    }
    if(typeof(passWord) === 'undefined'){
      throw 'password is undefined'
    }
    if(typeof(firstName) === 'undefined'){
      throw 'firstName is undefined'
    }
    if(typeof(lastName) === 'undefined'){
      throw 'lastName is undefined'
    }
    if(typeof(age) === 'undefined'){
      throw 'age is undefined'
    }


    //check all not string error 
    if(typeof(userName) !== 'string'){
      throw 'username is not a string'
    }
    if(typeof(passWord) !== 'string'){
      throw 'password is not a string'
    }
    if(typeof(firstName) !== 'string'){
      throw 'firstName is not a string'
    }
    if(typeof(lastName) !== 'string'){
      throw 'lastName is not a string'
    }
    if(typeof(age) !== 'number'){
      throw 'age is not a number'
    }
    //username and the password RE
    userName = userName.trim();
    passWord = passWord.trim();

    if(userName.length < 4){
      throw 'username has to be at least 4 characters'
    }
    
    let re = /^[0-9a-zA-Z]+$/;

    if(!userName.match(re)){
      throw 'no spaces in the username and only alphanumeric characters'
    }

    if(passWord.length < 6){
      throw 'password should be at least 6 characters long'
    }

    let re_2 = /^(?=.*[A-Z])(?=.*\d)[^]{6,}$/;
    
    if(!passWord.match(re_2)){
      throw 'password has to be at least one number and there has to be at least one special character'
    }

    //check the firstName and the lastName RE
    let nameRe = /^[a-zA-Z]*$/;
    
    if(!firstName.match(nameRe)){
      throw 'firstName has to be A-Z or a-z'
    }

    if(!lastName.match(nameRe)){
      throw 'lastName has to be A-Z or a-z'
    }
    // check the age
    if(10 > age || age > 100){
      throw 'age is invaild'
    }
  
    //check is the username is unique in database
    userName = userName.toLowerCase();
    const collection  = await userCollection();
    let user = await collection.findOne({userName: userName});
    if(await user!= null){
      throw 'username is already in the database';
    }

    // hashcode the password save all information in database
    let hashed = await bcrypt.hash(passWord, saltRounds);
    let creatNewUser = {
      userName : userName,
      passWord : hashed,
      firstName : firstName,
      lastName : lastName,
      age : age,
      reviews: []
    }
    let creatIn = await collection.insertOne(creatNewUser);
    if(await creatIn.insertedCount === 0){
      throw 'cannot creat the new user'
    }
    return { userInserted: true };
  }

  //checkUser
const checkUser = async (
    userName, 
    passWord
  ) => {
    //all undefined error check
    if(typeof(userName) === 'undefined'){
      throw 'username is undefined'
    }
    if(typeof(passWord) === 'undefined'){
      throw 'password is undefined'
    }

    //check all not string error 
    if(typeof(userName) !== 'string'){
      throw 'username is not a string'
    }
    if(typeof(passWord) !== 'string'){
      throw 'password is not a string'
    }

    //username and the password RE check
    userName = userName.trim();
    passWord = passWord.trim();

    if(userName.length < 4){
      throw 'username has to be at least 4 characters'
    }
    
    let re = /^[0-9a-zA-Z]+$/;

    if(!userName.match(re)){
      throw 'no spaces in the username and only alphanumeric characters'
    }

    if(passWord.length < 6){
      throw 'password should be at least 6 characters long'
    }

    let re_2 = /^(?=.*[A-Z])(?=.*\d)[^]{6,}$/;
    
    if(!passWord.match(re_2)){
      throw 'password has to be at least one number and there has to be at least one special character'
    }

    userName = userName.toLowerCase();

    // compare the password is right or not;
    const collection = await userCollection();
    let user = await collection.findOne({userName: userName});
    if (await user == null){
      throw 'Either the username or password is invalid';
    }
    let compare = await bcrypt.compare(passWord, user.passWord)
    if(!compare ){
      throw 'Either the username or password is invalid';
    }
    return { authenticatedUser: true };
}



const getUerByName = async (
  userName
) => {
  if(typeof(userName) === 'undefined'){
    throw 'userName is undefined'
  }
  if(typeof(userName) !== 'string'){
    throw 'username is not a string'
  }
  if(userName.trim() === 0){
    throw 'username can not be empty'
  }
  userName = userName.trim().toLowerCase();

  const users = await userCollection();
  let user = await users.findOne({userName: userName});
  if(await user == null){
      throw 'no user with this name';
  }
  user['_id'] = user['_id'].toString();
  return await user;
}

const updateUser = async (
  userName, 
  firstName, 
  lastName, 
  age
) => {
  if(typeof(userName) === 'undefined'){
    throw 'the userName is undefined'
  }
  if(typeof(userName) !== 'string'){
    throw 'the userName is not a String'
  }
  if(userName.trim() == 0){
    throw 'the userName can not be empty'
  }

  const user = await getUerByName(userName.trim().toLowerCase());
  let userId = user._id;
  let id = ObjectId(userId);
  if(await user == null){
    throw 'can not get the user by this name'
  }

  if(typeof(firstName) === 'undefined'){
    throw 'firstName is undefined'
  }
  if(typeof(lastName) === 'undefined'){
    throw 'lastName is undefined'
  }
  if(typeof(age) === 'undefined'){
    throw 'age is undefined'
  }
  if(typeof(firstName) !== 'string'){
    throw 'firstName is not a string'
  }
  if(typeof(lastName) !== 'string'){
    throw 'lastName is not a string'
  }
  if(typeof(age) !== 'number'){
    throw 'age is not a number'
  }
  //if all the updateinformation is same 
  if(await user.firstName === firstName 
    && await user.lastName === lastName
    && await user.age === age){
    throw 'all the information is same with before, can not update information'
  }

  //check the firstName and the lastName RE
  let nameRe = /^[a-zA-Z]*$/;
    
  if(!firstName.match(nameRe)){
    throw 'firstName has to be A-Z or a-z'
  }

  if(!lastName.match(nameRe)){
    throw 'lastName has to be A-Z or a-z'
  }
  // check the age
  if(10 > age || age > 100){
    throw 'age is invaild'
  }
  let updateUser = {
    userName: userName.toLowerCase(),
    firstName: firstName,
    lastName: lastName,
    age: age,
  }
  const users = await userCollection();
  const updatedInfo = await users.updateOne(
    {_id: id}, {$set: updateUser}
  );
  if(updatedInfo.modifiedCount === 0){
    throw 'Could not update user information'
  }
  return true;
}

module.exports = {
  createUser,
  checkUser,
  getUerByName,
  updateUser
}

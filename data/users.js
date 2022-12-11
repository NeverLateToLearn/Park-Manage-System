const mongoCollections = require('../config/mongoCollections');
const userCollection = mongoCollections.user_collection;
const bcrypt = require('bcrypt');
const saltRounds = 16;


//createUser
const createUser = async (
    username, 
    password,
    firstName,
    lastName,
    age
  ) => {
    //all undefined error check
    if(typeof(username) === 'undefined'){
      throw 'username is undefined'
    }
    if(typeof(password) === 'undefined'){
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
    if(typeof(username) !== 'string'){
      throw 'username is not a string'
    }
    if(typeof(password) !== 'string'){
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
    username = username.trim();
    password = password.trim();

    if(username.length < 4){
      throw 'username has to be at least 4 characters'
    }
    
    let re = /^[0-9a-zA-Z]+$/;

    if(!username.match(re)){
      throw 'no spaces in the username and only alphanumeric characters'
    }

    if(password.length < 6){
      throw 'password should be at least 6 characters long'
    }

    let re_2 = /^(?=.*[A-Z])(?=.*\d)[^]{6,}$/;
    
    if(!password.match(re_2)){
      throw 'password has to be at least one number and there has to be at least one special character'
    }

    //check the firstName and the lastName RE
    let nameRe = /^[a-z0-9A-Z]*$/;
    
    if(!firstName.match(nameRe)){
      throw 'firstName has to be A-Z or a-z'
    }

    if(!lastName.match(nameRe)){
      throw 'lastName has to be A-Z or a-z'
    }
    // check the age
    if(10 < age || age > 100){
      throw 'age is invaild'
    }
  
    //check is the username is unique in database
    username = username.toLowerCase();
    const collection  = await userCollection();
    let user = await collection.findOne({username: username});
    if(await user!= null){
      throw 'username is already in the database';
    }

    // hashcode the password save all information in database
    let hashed = await bcrypt.hash(password, saltRounds);
    let creatNewUser = {
      username : username,
      password : hashed,
      firstName : firstName,
      lastName : lastName,
      age : age
    }
    let creatIn = await collection.insertOne(creatNewUser);
    if(await creatIn.insertedCount === 0){
      throw 'cannot creat the new user'
    }
    return { userInserted: true };
  }

  //checkUser
const checkUser = async (
    username, 
    password
  ) => {
    //all undefined error check
    if(typeof(username) === 'undefined'){
      throw 'username is undefined'
    }
    if(typeof(password) === 'undefined'){
      throw 'password is undefined'
    }

    //check all not string error 
    if(typeof(username) !== 'string'){
      throw 'username is not a string'
    }
    if(typeof(password) !== 'string'){
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
    //username and the password RE check
    username = username.trim();
    password = password.trim();

    if(username.length < 4){
      throw 'username has to be at least 4 characters'
    }
    
    let re = /^[0-9a-zA-Z]+$/;

    if(!username.match(re)){
      throw 'no spaces in the username and only alphanumeric characters'
    }

    if(password.length < 6){
      throw 'password should be at least 6 characters long'
    }

    let re_2 = /^(?=.*[A-Z])(?=.*\d)[^]{6,}$/;
    
    if(!password.match(re_2)){
      throw 'password has to be at least one number and there has to be at least one special character'
    }

    username = username.toLowerCase();

    // compare the password is right or not;
    const collection = await userCollection();
    let user = await collection.findOne({username: username});
    if (await user == null){
      throw 'Either the username or password is invalid';
    }
    let compare = await bcrypt.compare(password, user.password)
    if(!compare ){
      throw 'Either the username or password is invalid';
    }
    return { authenticatedUser: true };
}

  //user register event
const userRegisterEvent = async(
    uerName,
    eventName
  ) => {

}

  



const getUerByName = async (
  userName,
) => {}
  
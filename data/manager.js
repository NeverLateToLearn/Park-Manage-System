//check manager account
const managerCollection = mongoCollections.manager_collection;
const checkManager = async (
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
    const collection = await managerCollection();
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
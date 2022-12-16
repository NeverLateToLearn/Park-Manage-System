const connection = require('../config/mongoConnection');
const data = require('../data/');
const userData = data.userData;
const reviewData = data.reviewData;
const managerData = data.managerData;
const eventData = data.eventData;

const main = async () => {
    const db = await connection();
    await db.dropDatabase();

    //Seed Sample events
    const E1 = await eventData.addEvent("sport", "12th High School Basketball Game ", 50, "01/26/2023");
    const E2 = await eventData.addEvent("sport", "13th High School Basketball Game ", 70, "02/02/2023");
    const E3 = await eventData.addEvent("sport", "14th High School Basketball Game ", 40, "01/20/2023");
    const E4 = await eventData.addEvent("sport", "17th High School Basketball Game ", 40, "02/05/2023");
    const E5 = await eventData.addEvent("sport", "14th High School Basketball Game ", 40, "05/04/2023");
    
    const E6 = await eventData.addEvent("art", "14th High School art show ", 40, "01/01/2023");
    const E7 = await eventData.addEvent("art", "16th High School art show ", 65, "01/05/2023");
    const E8 = await eventData.addEvent("art", "18th High School art show ", 80, "01/27/2023");
    const E9 = await eventData.addEvent("art", "20th High School art show ", 13, "01/28/2023");
    const E10 = await eventData.addEvent("art", "21th High School art show ", 60, "02/15/2023");
    
    const E11 = await eventData.addEvent("concern", "17th High School concern ", 40, "02/03/2023");
    const E12 = await eventData.addEvent("concern", "7th High School concern ", 39, "03/11/2023");
    const E13 = await eventData.addEvent("concern", "4th High School concern ", 41, "02/27/2023");
    const E14 = await eventData.addEvent("concern", "5th High School concern ", 27, "02/23/2023");
    const E15 = await eventData.addEvent("concern", "9th High School concern ", 39, "05/24/2023");

    const E16 = await eventData.addEvent("sport", "4th High School Basketball Game ", 40, "05/04/2023");
    const E17 = await eventData.addEvent("art", "7th High School art show ", 23, "01/01/2023");
    const E18 = await eventData.addEvent("concern", "1th High School concern ", 41, "02/03/2023");


    //Seed Sample Users
    /*
    const U1 = await userData.createUser("Anna0977", "Brown", "anna",29);
    const U2 = await users.createUser("Anshul0629", "Kapoor", "anshul",25);
    const U3 = await users.createUser("Kamil7799", "Zambrowski", "kamil",22);
    const U4 = await users.createUser("Michael1013", "Lyons", "michael",22);
    const U5 = await users.createUser("John2977", "Doe", "john", 22);
    const U6 = await users.createUser("Ava7024", "Tartaglia", "ava",23);
    const U7 = await users.createUser（"Dan1920", "Pelis", "dan",24);
    const U8 = await users.createUser("Jessica0917", "Su", "jessica", 25);
    const U9 = await users.createUser("Miles0346", "Rosenberg", "miles",28);
    const U10 = await users.createUser("Joe2009", "Smith", "joe",26);
    */
}    
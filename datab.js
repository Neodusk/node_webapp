const mysql = require("mysql"),
database = 'c9',
password = '',
username = 'neodusk';
//connect to DB
var connection = mysql.createConnection({
    host:'localhost',
    user: username,
    password: password,
    database: database
});

connection.connect((err) => {
    console.log('Connecting to database: \'' + database + "\'\nUsing user: \'" + username + "\'");
    if(err) {
        console.log('Unable to connect to database: \'' + database);
        throw err;
    }
    console.log('MySQL Connected...');
});




//NEED TO CREATE A PROMISE OR CALLBACK SO EVERYTHING IS DONE SYNCHRONOUSLY INSTEAD OF ASYNC
module.exports.checkTableProfiles = function checkTableProfiles() {
    //select from table profiles
    console.log("Checking if table 'profiles' exists...");
    connection.query("SELECT * from profiles", function(err, rows, fields) {
        //if cannot select from table profiles, create table profiles
        if (err) {
            console.log("Table does not exist, creating table 'profiles'...");
            let table = 'CREATE TABLE profiles(id int AUTO_INCREMENT, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255) UNIQUE, username VARCHAR(255) UNIQUE, password VARCHAR(255), PRIMARY KEY(id))';
            connection.query(table, (err,result) => {
            //throw err if cannot create table
            if(err) {
                console.log("Error creating table 'profiles'")
                throw err;
            }
    });
            return true;
        }
        //if able to select from table profiles, skip creation of table
        if(fields.length != 0) {
            console.log("Table exists, skipping creation of table 'profiles'...");
            return false;
        }
    })
}

module.exports.checkTableDistrict = function checkTableDistrict() {
    //select from table profiles
    console.log("Checking if table 'district' exists...");
    connection.query("SELECT * from district", function(err, rows, fields) {
        //if cannot select from table profiles, create table district
        if (err) {
            console.log("Table does not exist, creating table 'district'...");
            let table = 'CREATE TABLE district(id int AUTO_INCREMENT, district_name VARCHAR(255), first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255) UNIQUE, email_domain VARCHAR(255) UNIQUE, username VARCHAR(255) UNIQUE, password VARCHAR(255), PRIMARY KEY(id))';
            connection.query(table, (err,result) => {
            //throw err if cannot create table
            if(err) {
                console.log("Error creating table 'district'")
                throw err;
            }
    });
            return true;
        }
        //if able to select from table district, skip creation of table
        if(fields.length != 0) {
            console.log("Table exists, skipping creation of table 'district'...");
            return false;
        }
    })
}


exports.con = connection;
exports.database = database;
exports.password = password;
exports.username = username;

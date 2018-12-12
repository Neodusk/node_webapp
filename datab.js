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
    console.log("Checking if table 'profiles' exists...\n");
    connection.query("SELECT * from profiles", function(err, rows, fields) {
        //if cannot select from table profiles, create table profiles
        if (err) {
            console.log("Table 'profiles' does not exist, creating table...");
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
            console.log("Table 'profiles' exists, skipping creation of table");
            return false;
        }
    })
}

module.exports.checkTableDistrict = function checkTableDistrict() {
    //select from table district
    console.log("Checking if table 'district' exists...\n");
    connection.query("SELECT * from district", function(err, rows, fields) {
        //if cannot select from table district, create table district
        if (err) {
            console.log("Table 'district' does not exist, creating table");
            let table = 'CREATE TABLE district(id int AUTO_INCREMENT, district_name VARCHAR(255), first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255) UNIQUE, email_domain VARCHAR(255) UNIQUE, username VARCHAR(255) UNIQUE, password VARCHAR(255), int user_level (8) NOT NULL, PRIMARY KEY(id))';
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
            console.log("Table 'district' exists, skipping creation of table");
            return false;
        }
    })
}

module.exports.checkTableCat = function checkTableCat() {
    //select from table category
    console.log("Checking if table 'category' exists...\n");
    connection.query("SELECT * from category", function(err, rows, fields) {
        //if cannot select from table category, create table district
        if (err) {
            console.log("Table 'category' does not exist, creating table...");
            let table = 'CREATE TABLE category(cat_id int AUTO_INCREMENT, cat_name VARCHAR(255), cat_description VARCHAR(255), UNIQUE INDEX cat_name_unique (cat_name), PRIMARY KEY (cat_id))';
            connection.query(table, (err,result) => {
            //throw err if cannot create table
            if(err) {
                console.log("Error creating table 'category'")
                throw err;
            }
    });
            return true;
        }
        //if able to select from table category, skip creation of table
        if(fields.length != 0) {
            console.log("Table 'category' exists, skipping creation of table");
            return false;
        }
    })
}

module.exports.checkTableTopic = function checkTableTopic() {
    //select from table category
    console.log("Checking if table 'topic' exists...\n");
    connection.query("SELECT * from topic", function(err, rows, fields) {
        //if cannot select from table category, create table district
        if (err) {
            console.log("Table 'topic' does not exist, creating table...");
            let table = 'CREATE TABLE topic(topic_id int AUTO_INCREMENT, topic_subject VARCHAR(255), topic_date DATETIME, topic_cat INT(8), topic_by INT(8), PRIMARY KEY (topic_id))';
            connection.query(table, (err,result) => {
            //throw err if cannot create table
            if(err) {
                console.log("Error creating table 'topic'")
                throw err;
            }
    });
            return true;
        }
        //if able to select from table category, skip creation of table
        if(fields.length != 0) {
            console.log("Table 'topic'    exists, skipping creation of table");
            return false;
        }
    })
}

module.exports.checkTablePosts = function checkTablePosts() {
    //select from table category
    console.log("Checking if table 'posts' exists...\n");
    connection.query("SELECT * from posts", function(err, rows, fields) {
        //if cannot select from table category, create table district
        if (err) {
            console.log("Table 'posts' does not exist, creating table...");
            //let table = 'CREATE TABLE posts(post_id int AUTO_INCREMENT, post_content VARCHAR(255), post_date DATETIME, post_by INT(8), PRIMARY KEY (post_id))';
            let table=`CREATE TABLE posts(post_id int AUTO_INCREMENT, post_subject VARCHAR(100), post_content VARCHAR(255), post_date DATETIME, PRIMARY KEY (post_id))`
            connection.query(table, (err,result) => {
            //throw err if cannot create table
            if(err) {
                console.log("Error creating table 'posts'")
                throw err;
            }
    });
            return true;
        }
        //if able to select from table category, skip creation of table
        if(fields.length != 0) {
            console.log("Table 'posts'    exists, skipping creation of table");
            return false;
        }
    })
}


exports.con = connection;
exports.database = database;
exports.password = password;
exports.username = username;

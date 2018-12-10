const passport = require("passport"),
LocalStrategy = require('passport-local').Strategy,
datab = require("./datab"),
connection = datab.con;


module.exports = function(passport) {

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
    connection.query("select * from profiles where username = " +user, function(err, rows) {
        done(err, rows[0]);
    });
});
}

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    username: 'username',
    password: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
},
function(req, username, password, done) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    connection.query("select * from profiles where username = '" + username + "'", function(err, rows) {
        console.log(rows);
        console.log("above row object");
        if (err)
            return done(err);
        if (rows.length) {
            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        }
        else {

            // if there is no user with that user
            // create the user
            var newUserMysql = new Object();

            newUserMysql.username = username;
            newUserMysql.password = password; // use the generateHash function in our user model

            var insertQuery = "INSERT INTO profiles ( email, password ) values ('" + username + "','" + password + "')";
            console.log(insertQuery);
            connection.query(insertQuery, function(err, rows) {
                if (err) throw err;
                newUserMysql.id = rows.insertId;

                return done(null, newUserMysql);
            });
        }
    });
}));


passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    username: 'username',
    password: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
},
function(req, username, password, done) { // callback with email and password from our form

    connection.query("SELECT * FROM `profiles` WHERE `username` = '" + username + "'", function(err, rows) {
        if (err)
            return done(err);
        if (!rows.length) {
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        }

        // if the user is found but the password is wrong
        if (!(rows[0].password == password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, rows[0]);

    });
}));
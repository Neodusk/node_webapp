var express = require('express');
var router = express.Router();
var datab = require('../datab');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const saltRounds = 10; 

//connect to database 
const connection = datab.con,
checkTableProfiles = datab.checkTableProfiles,
checkTableDistrict = datab.checkTableDistrict;

//check if tables exist, if not then create
setTimeout(function() {
   checkTableProfiles();
    checkTableDistrict(); 
}, 1000); 
    
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// GET signup page
router.get('/signup.html', function(req, res, next) {
    res.render('signup');
});
// GET registerdistrict page
router.get('/registerdistrict.html', function(req, res, next) {
    res.render('registerdistrict');
});
// GET login page
router.get('/login.html', function(req, res, next) {
    res.render('login');
});
// GET forums page
router.get('/forums.html', function(req, res, next) {
    res.render('forums');
});


//do this when user posts on signup.html
router.post('/signup.html',  function(req, res, next) {
    console.log(req.body);
   //check if fields are empty
   req.checkBody('username', 'Username field cannot be empty').notEmpty();
   req.checkBody('firstname', 'First name field cannot be empty').notEmpty();
   req.checkBody('lastname', 'Last name field cannot be empty').notEmpty();
   req.checkBody('password', 'Password field cannot be empty').notEmpty();
   req.checkBody('email', 'Email field cannot be empty').notEmpty();
   //check length
   req.checkBody('username', 'Username must be between 4-15 characters long').len(4,15);
   req.checkBody('password', 'Password must be between 6-100 characters long').len(6,100);
   req.checkBody('email', 'Email must be between 4-100 characters long').len(4,100);
   //check is email
   req.checkBody('email', 'The email entered is invalid, please try again').isEmail().normalizeEmail();
   //password validate
   req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
   // add .equals(req.body.password) if you want to add a confirm pass
   
    //look into req.getValidationResult, errors is dep
    const errors = req.validationErrors();
    if (errors) {
        console.log(`errors: ${JSON.stringify(errors)}`);
        res.render('signup', {title:"Signup Error", errors: errors});
        return;
    }
   
    
    //let checkdata = `SELECT count(1) from profiles where username = "${req.body.username}" or email = "${req.body.email}"`
       /* if(err) throw err;
        connection.query(checkdata, function(error, results,field) {
            console.log(results);
           if(error) {
               //throw error;
               res.render("Too badd");
               return
           }
        });*/
    //console.log(checkdata);
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if(err) throw err;
            let sql = `INSERT INTO profiles (first_name, last_name, email, username, password) VALUES (?,?,?,?,?)`;
            connection.query(sql, [req.body.firstname, req.body.lastname, req.body.email, 
            req.body.username, hash], function (error, results, field) {
                if(error) throw error;
        });
    });
    res.render("login", {title: 'Signup Complete'});
});
//do this when user posts on registerdistrict.html
router.post('/registerdistrict.html', function(req, res, next) {
   console.log(req.body);
   let sql = `INSERT INTO district (district_name, first_name, last_name, email, email_domain, username, password) 
        VALUES (?,?,?,?,?,?,?)`;
    console.log(sql);
    connection.query(sql, [req.body.districtname, req.body.firstname, req.body.lastname, req.body.email, 
        req.body.emaildomain, req.body.username, req.body.password], function (error, results, field) {
       if (error) throw error; 
    });
    res.render("login", {title: 'Registration Complete'});
});


module.exports = router;

/*let sql = `INSERT INTO district (district_name, first_name, last_name, email, email_domain, username, password) 
        VALUES ("${req.body.districtname}", "${req.body.firstname}", "${req.body.lastname}", "${req.body.email}", 
        "${req.body.emaildomain}", "${req.body.username}", "${req.body.password}")`;*/
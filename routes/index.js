var express = require('express');
var router = express.Router();
var datab = require('../datab');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const passport = require("passport");
const saltRounds = 10;
const passportConfig = require('../passportConfig');
//connect to database 
const connection = datab.con,
    checkTableProfiles = datab.checkTableProfiles,
    checkTableDistrict = datab.checkTableDistrict,
    checkTableCat = datab.checkTableCat,
    checkTablePosts = datab.checkTablePosts,
    checkTableTopic = datab.checkTableTopic,
    passports=datab.passport;

//use passportConfig for passport (serialize, deserialize)    
passportConfig(passport);

//check if tables exist, if not then create
setTimeout(function() {
    checkTableProfiles();
    checkTableDistrict();
    checkTableCat();
    checkTablePosts();
    checkTableTopic();
}, 1000);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'IT Forums' });
});
router.get('/home', function(req, res, next) {
    res.render('index', { title: 'IT Forums' })
})


// GET signup page
router.get('/signup', function(req, res, next) {
    res.render('signup');
});
// GET registerdistrict page
router.get('/registerdistrict', function(req, res, next) {
    res.render('registerdistrict');
});
// GET login page
router.get('/login', function(req, res, next) {
    res.render('login');
});
// GET forums page
router.get('/forums', function(req, res, next) {
    //console.log(req.user);
    //console.log(req.isAuthenticated);
    res.render('forums');
});

router.get('/support', function(req, res, next) {
    res.render('support', { title: 'Support' });
})

/*router.get('/failedsignup.ejs', function(req, res, next) {
    res.render('failedsignup');
})*/

router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
})




/*
app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
});*/



/*router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res, next) {
    console.log(`Username Entered: ${req.body.username}`);
    console.log(`Password Entered: ${req.body.password}`)
    res.render('forums');
});*/



router.post('/login' , passport.authenticate('local-login', {successRedirect: '/forums', failureRedirect: '/login', 
failureFlash:'Invalid username or password. Please try again', successFlash:'Welcome'}), function(req, res, next) {
    console.log(req.body);
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    //res.redirect('/forums/' + req.user.username);
});


router.post('/signup', /*passport.authenticate('local-signup', {successRedirect: '/login', failureRedirect: '/signup',
failureFlash: 'Unable to signup. Please try again', successFlash:'Successfully signed up!'}),*/ function(req, res, next) {
     console.log(req.body);
    //check if fields are empty
    req.checkBody('username', 'Username field cannot be empty').notEmpty();
    req.checkBody('firstname', 'First name field cannot be empty').notEmpty();
    req.checkBody('lastname', 'Last name field cannot be empty').notEmpty();
    req.checkBody('password', 'Password field cannot be empty').notEmpty();
    req.checkBody('email', 'Email field cannot be empty').notEmpty();
    //check length
    req.checkBody('username', 'Username must be between 4-15 characters long').len(4, 15);
    req.checkBody('password', 'Password must be between 6-100 characters long').len(6, 100);
    req.checkBody('email', 'Email must be between 4-100 characters long').len(4, 100);
    //check is email
    req.checkBody('email', 'The email entered is invalid, please try again').isEmail().normalizeEmail();
    //password validate
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    // add .equals(req.body.password) if you want to add a confirm pass

    //look into req.getValidationResult, errors is dep
    const errors = req.validationErrors();
    if (errors) {
        console.log(`errors: ${JSON.stringify(errors)}`);
        res.render('signup', { title: "Signup Error", errors: errors });
        return;
    }

    var checking;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (err) throw err;
        var checkUser = `SELECT * FROM profiles WHERE username="${req.body.username}" OR email="${req.body.email}"`;
        //console.log(checkUser);
        connection.query(checkUser, function(err, res, field) {
            if (err) throw err;
            var resstring = JSON.stringify(res);
            //console.log(resstring);
            if (resstring == "[]") {
                console.log("User and email do not exist");
                let sql = `INSERT INTO profiles (first_name, last_name, email, username, password) VALUES (?,?,?,?,?)`;
                setTimeout(function() {
                    console.log(`Creating user ${req.body.username}`);
                    connection.query(sql, [req.body.firstname, req.body.lastname, req.body.email,
                        req.body.username, hash
                    ], function(error, results, field) {
                        if (error) throw error;
                        checking = true;
                    });
                }, 10);
            }
            else {
                console.log("Username is taken or email is in use, please try a different one");
                checking = false;

            }
        })
        
        setTimeout(function() {
            if (checking) {
                console.log("Sending to login");
                res.render("login", { title: 'Signup Complete' });
            }
        }, 100);
        setTimeout(function() {
            if (checking == false) {
                console.log("User creation failed");
                res.render("signup", { title: 'Signup Incomplete' });
            }
        }, 100);
    });
});



//do this when user posts on signup.html
/*router.post('/signup', function(req, res, next) {
   

});*/
//do this when user posts on registerdistrict.html
router.post('/registerdistrict', function(req, res, next) {
    console.log(req.body);
    let sql = `INSERT INTO district (district_name, first_name, last_name, email, email_domain, username, password) 
        VALUES (?,?,?,?,?,?,?)`;
    console.log(sql);
    connection.query(sql, [req.body.districtname, req.body.firstname, req.body.lastname, req.body.email,
        req.body.emaildomain, req.body.username, req.body.password
    ], function(error, results, field) {
        if (error) throw error;
    });
    res.render("login", { title: 'Registration Complete' });
});

router.post('/forums', function(req,res,next) {
    console.log(req.body);
       let sql = `INSERT INTO posts (post_subject, post_content) VALUES (?,?)`;
       connection.query(sql, [req.body.subject, req.body.descriptions], function(err, res, field) {
         if(err) throw err; 
       });
       res.render('forums');
});

router.get('/search', function(req, res, next) {
    res.render('search');
    //res.send(`Search results:\n ${check} `);
})


var test = [];
router.post('/search', function(req, res, next) {
    //res.render('search');
    console.log(req.body.searchInput);
    
    let sql = `SELECT * FROM posts WHERE post_subject LIKE "%${req.body.searchInput}%" OR post_content LIKE "%${req.body.searchInput}%"`
    //need to parse for results and display properly
    connection.query(sql, [req.body.searchInput], function(err, res, field) {
        if (err) throw err;
       // create an array to store results for(var i = 0; i < test.length(); i++)
        var stringy = JSON.stringify(res);
        
        console.log(stringy);
        test = stringy;
    });
    setTimeout(function() {
        
    res.send(test);
    }, 1000);
})



module.exports = router;

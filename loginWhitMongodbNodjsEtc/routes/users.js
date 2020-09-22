require('babel-register');
const express = require('express');
const router = express.Router();
const passport = require('passport');

const bcrypt = require('bcryptjs');

// User model 
User = require('../models/User');

// Get

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// register page

router.get('/register', (req, res) => {
    res.render('register');
});
// ********************************************
// Post
// register handle
router.post('/register', (req, res) => {

    const { name, email, password, password2 } = req.body;

    let errors = [];

    // Check required fields

    if (!name || !email || !password || !password2) {
        errors.push({ msg: "please fill in all fields" });
    }

    // Check password match
    if (password !== password2) {
        errors.push({ msg: "please password do not match" });
    }

    // Check password length
    if (password.length < 8) {
        errors.push({ msg: "password should be at least 8 characters" });
    }


    // Pass
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation Passed
        User.findOne({ email: email })
            .then(
                user => {
                    if (user) {
                        // User exists
                        errors.push({ msg: ' Email is already register' });
                        res.render('register', {
                            errors,
                            name,
                            email,
                            password,
                            password2
                        });
                    } else {
                        const newUser = new User({
                            name,
                            email,
                            password
                        });

                        // Hash password 
                        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            // Set password to hashed
                            newUser.password = hash;

                            // Save User 
                            newUser.save()
                                .then(
                                    user => {
                                        req.flash('success_msg', 'Your are now registered and can log in');
                                        res.redirect('/users/login');
                                    }
                                )
                                .catch(err => console.log('error : ' + err));

                        }))
                    }
                }
            );

    }

});


// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});



// Logout handle

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', "your are logged out");
    res.redirect('/users/login');

});
module.exports = router;
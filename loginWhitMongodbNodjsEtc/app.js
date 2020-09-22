require('babel-register');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongodb = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const app = express();

const PORT = process.env.PORT || 5000;


// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//Passport configuration 

require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Glogal Vars

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// BD config
const db = require('./config/keys').MongoURI;

// connect mongodb
mongodb.connect(db, { useNewUrlParser: true })
    .then(
        () => console.log('mongodb connected...')
    )
    .catch(err => console.log("error message" + err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



// listen
app.listen(PORT, () => {
    console.log("server listen at PORT " + PORT);
});
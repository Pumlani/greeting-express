
// set up expressjs after installation
const express = require('express')
// importing handlebars for tamplating
const exphbs = require('express-handlebars')
// importing flash middleware
const flash = require('express-flash');
const session = require('express-session');
// retrieval of forms parameters
const bodyParser = require('body-parser')
// importing our factory 
let greetFactory = require('./greetFactory.js')

// getting an instance of express
const app = express()
const pg = require("pg");
const Pool = pg.Pool;
// factory instance

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgres://coder:pg123@localhost:5432/greetingsData';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const GreetFactory = greetFactory(pool)
// configuring handlebars as middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({
    extended: false
}))
// initialise session middleware - flash-express depends on it
app.use(session({
    secret: '<this is my long string that is used for session in http>',
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

app.use(express.static('public'))

// routes
app.get('/', async function (req, res) {

    let obj = {
        greeting: await GreetFactory.greet(),
        counter: await GreetFactory.count()
    }

    res.render('home', { obj });

})

app.post('/greetings', async function (req, res) {

    let name = req.body.textBox
    let language = req.body.language
    let greeting = {
        greet: await GreetFactory.greet(name, language),
        count: await GreetFactory.count()
    }

    if (name === "" || name === undefined) {

        req.flash('info', 'Please write a name you want to greet!')

    } else
        if (language === undefined) {
            req.flash('info', 'Please select a language before you greet!')
        } else { greeted = await GreetFactory.greet(name, language) }


    res.render('home', {
        greeting
    });
});
app.post('/resetBtn', function (req, res) {
    let counter = GreetFactory.count();
    let reset = {
        resetB: GreetFactory.reset()
    };

    res.render('home', {
        reset,
        counter
    });
});

// running on this port number
let PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App starting on port', PORT)
});

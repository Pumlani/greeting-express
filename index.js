

const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const pg = require("pg");
let greetFactory = require('./greetFactory.js');

const app = express();
const Pool = pg.Pool;

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
//factory function instance
let greetingsInstance = greetFactory(pool)

// configuring handlebars as middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({
    extended: false
}))

// initialise session middleware in which flash-express depends on it
app.use(session({
    secret: '<this is my long string that is used for session in http>',
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());
// built-in static middleware from ExpressJS to use static resources 
app.use(express.static('public'))

//GET route -home screen
app.get('/', async function (req, res, next) {
    try {
        let countObject = {
            count: await greetingsInstance.count()
        }
        //sending data out of the server
        res.render('home', {
            countObject
        });
    } catch (error) {
        next(error);
    }

})

//the greetings POST route which sends data to the server
app.post('/greetings', async function (req, res, next) {
    try {
        //data is recieved by the ExpressJS server using using HTML forms
        let name = req.body.textBox;
        let language = req.body.language;
        //using flash messege for errors when details entered are not complete
        if (name === "" || name === undefined) {

            req.flash('info', 'Please write a name you want to greet!')

        } else if (language === undefined) {
            req.flash('info', 'Please select a language before you greet!')
        } else {
            let greeting = {
                greet: await greetingsInstance.greet(name, language),
                count: await greetingsInstance.count()
            }

            console.log(greeting);
            //sending data out of the server
            res.render('home', {
                greeting
            }

            );
        }
    } catch (error) {

        next(error);
    }
});
// app.get("greetings/:name/:language", async function (req, res, next) {
//     try {
//         let name = req.body.textBox;
//         let language = req.body.language;

//         res.render('home', {
//             greeting: await greetingsInstance.greet(name, language),
//             counter: await greetingsInstance.count()
//         });

//     } catch (error) {
//         next(error);
//     }
// });

// app.get('/greeted', async function (req, res, next) {
//     try {

//         res.render('actions', {
//             greet: await greetingsInstance.names()
//         });


//     } catch (error) {
//         next(error);
//     }
// });
app.get('/greeted', async function (req, res, next) {
    try {
        let result = await pool.query('SELECT * FROM greetedUser');
        let greeted = result.rows
        console.log(greeted)
        let counter = await greetingsInstance.count()

        res.render('actions', {
            greeted,
            counter
        });


    } catch (error) {
        next(error);
    }
});


//the reset POST route
app.post('/resetBn', async function (req, res, next) {
    try {
        let reset = {
            resetB: await greetingsInstance.resetBn()
        };
        res.render('home', {
            reset
        });

    } catch (error) {
        next(error);
    }
});

// running at this port number
let PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App starting on port', PORT)
});

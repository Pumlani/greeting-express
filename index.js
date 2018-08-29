
// set up expressjs after installation
const express = require('express')
// importing handlebars for tamplating
const exphbs = require('express-handlebars')
// retrieval of forms parameters
const bodyParser = require('body-parser')
// importing our factory 
let greetFactory = require('./greetFactory.js')

// getting an instance of express
const app = express()
// factory instance
const GreetFactory = greetFactory()

// configuring handlebars as middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(express.static('public'))

// routes
app.get('/', function (req, res) {

    let greeting = GreetFactory.greet();
    let counter = GreetFactory.count();

    res.render('home', {
        greeting,
        counter
    });

})
app.post('/greetings', function (req, res) {

    let name = req.body.textBox
    let language = req.body.language


    let greeted = GreetFactory.greet(name, language)
    let counter = GreetFactory.count();
    console.log(GreetFactory.greet(name, language));


    res.render('home', {
        greeted,
        counter
    })
})
app.post('/resets', function (req, res) {
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
let PORT = process.env.PORT || 3011

app.listen(PORT, function () {
    console.log('App starting on port', PORT)
})

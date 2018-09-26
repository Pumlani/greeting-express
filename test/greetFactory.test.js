let assert = require("assert");
let greetingsfactory = require("../greetFactory");
const pg = require("pg");
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgres://coder:pg123@localhost:5432/greetingsData';

const pool = new Pool({
    connectionString
});
describe('The basic database web app tests', function () {

    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("delete from greeteduser;");
    });
    it('should greet a person in English language.', async function () {

        var greetingsObj = greetingsfactory(pool);
        var greeting = await greetingsObj.greet('Monde', 'english')

        assert.equal(greeting, 'Hello Monde')


    });

    it('should greet a person in Xhosa language.', async function () {

        var greetingsObj = greetingsfactory(pool);
        var greeting = await greetingsObj.greet('lihle', 'xhosa')

        assert.equal(greeting, 'Molo Lihle')

    });

    it('should return the number of people that have been counted.', async function () {

        var greetingsObj = greetingsfactory(pool);


        await greetingsObj.greet('lihle', 'xhosa');
        await greetingsObj.greet('amanda', 'xhosa');

        let greetCount = await greetingsObj.count();

        assert.equal(greetCount, 2)

    });
    it('shouldn not increase the counter if the name has been greeted before', async function () {

        var greetingsObj = greetingsfactory(pool);

        await greetingsObj.greet('Hello', 'Ludwe');
        await greetingsObj.greet('Hello', 'ludwe');
        let greetCount = await greetingsObj.count();


        assert.equal(greetCount, 1)

    });

    it('should not increase the counter if the name has been greeted before.', async function () {

        var greetingsObj = greetingsfactory(pool);

        await greetingsObj.greet('More', 'Pumlani');
        await greetingsObj.greet('Hello', 'Monde');
        let greetCount = await greetingsObj.count();
        assert.equal(greetCount, 2)

        await greetingsObj.greet('Molo', 'Inam');
        await greetingsObj.greet('Molo', 'Monde');
        await greetingsObj.greet('Hello', 'Pumlani');
        greetCount = await greetingsObj.count();

        assert.equal(greetCount, 3)

    });

    after(function () {
        pool.end();
    })

});
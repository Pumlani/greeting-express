let assert = require("assert");
let greetingsfactory = require("../greetFactory");


describe('The greetings function Tests', function () {
    it('should greet a person in Afrikaans language.', function () {

        var greetingsObj = greetingsfactory();
        var name = "Pumlani";
        var lang = 'afrikaans';

        assert.equal(greetingsObj.greet(name, lang), 'Hallo Pumlani')

    });

    it('should greet a person in English language.', function () {

        var greetingsObj = greetingsfactory();
        var name = 'Monde';
        var lang = 'english';

        assert.equal(greetingsObj.greet(name, lang), 'Hello Monde')


    });


    it('should greet a person in Xhosa language.', function () {

        var greetingsObj = greetingsfactory();
        var name = 'Inam';
        var lang = 'xhosa';

        assert.equal(greetingsObj.greet(name, lang), 'Molo Inam')

    });
    it('should return the number of people that have been counted.', function () {

        var greetingsObj = greetingsfactory();

        greetingsObj.greet('Pumlan');
        greetingsObj.greet('Monde');

        assert.equal(greetingsObj.count(), 2)

    });

    it('should increase the counter if the name not been greeted once.', function () {

        var greetingsObj = greetingsfactory();

        greetingsObj.greet('Pumlan');
        greetingsObj.greet('Monde');
        assert.equal(greetingsObj.count(), 2)

        greetingsObj.greet('Unathi');
        greetingsObj.greet('Anda');
        greetingsObj.greet('Aphiwe');
        greetingsObj.greet('Lisa');
        greetingsObj.greet('Inam');
        assert.equal(greetingsObj.count(), 7)

    });
    it('should not increase the counter if the name been greeted.', function () {

        var greetingsObj = greetingsfactory();

        greetingsObj.greet('Pumlani');
        greetingsObj.greet('Monde');
        assert.equal(greetingsObj.count(), 2)

        greetingsObj.greet('Inam');
        greetingsObj.greet('Unathi');
        greetingsObj.greet('Anda');
        greetingsObj.greet('Monde');
        greetingsObj.greet('Pumlani');

        assert.equal(greetingsObj.count(), 5)

    });
    it('should return the names as keys and 0 as a key value.', function () {

        var greetingsObj = greetingsfactory();

        greetingsObj.greet('PUMLANI');
        greetingsObj.greet('MASEBE');

        assert.deepEqual(({ PUMLANI: 0, MASEBE: 0 }), greetingsObj.names());
    });

});
module.exports = function (pool) {

  // var namesGreeted = storage || {}
  // let name = '';
  // let language = '';

  function reset() {
    name = '';
    language = '';
    namesGreeted = {};
    count = 0;
  }

  async function greet(name, language) {

    let results = await pool.query('SELECT * FROM greetedUser where userName=$1', [name]);

    if (name !== undefined && name !== '') {
      await pool.query('insert into greetedUser (userName, counter) values ($1, $2)', [name, 1]);
    }

    if (name !== "" && language !== undefined) {

      // if (namesGreeted[name] === undefined) {
      //   namesGreeted[name] = 0;
      // }
      //returning the greetes name with a chosen language
      if (language === 'xhosa') {
        return 'Molo ' + name
      }

      if (language === 'english') {
        return 'Hello ' + name
      }

      if (language === 'afrikaans') {
        return 'Hallo ' + name
      }
    }
  }

  async function count() {
    let results = await pool.query('SELECT * FROM greetedUser');
    console.log(results)
    return results.rowCount;
  }

  async function names() {
    let results = await pool.query('SELECT * FROM greetedUser');

    return namesGreeted;

  }

  return {
    names,
    count,
    greet,
    reset
  }
};

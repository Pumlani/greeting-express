module.exports = function (pool) {
  //  
  async function greet(name, language) {
    //name format
    // name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    if (name !== '' && language !== undefined) {

      let result = await pool.query('SELECT * FROM greetedUser WHERE userName=$1', [name]);
      // console.log("after select");


      if (result.rowCount === 0) {

        await pool.query('INSERT INTO greetedUser (userName, counter) values ($1, 0)', [name]);
        // console.log("after insert");
      } else {

        await pool.query('UPDATE greetedUser counter=counter+1 WHERE userName=$1', [name]);
        // console.log("after update");
      }


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

    //getting the number of names entered on our table
    let results = await pool.query('SELECT FROM greetedUser');
    let namesCounted = results.rows
    return namesCounted.length;
  }

  async function names() {

    //getting the names entered on our table
    let namesGreeted = await pool.query('SELECT FROM greetedUser');
    return namesGreeted.rows;
  }


  async function resetBn() {

    //deleting all the data entered on our database table
    let resetBtn = await pool.query('DELETE FROM greetedUser');
    name = '';
    language = '';
    return resetBtn.rowCount;
  }


  return {
    names,
    count,
    greet,
    resetBn
  }
};

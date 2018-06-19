require('dotenv').config();
const client = require('../db-client');

client.query(`
  DROP TABLE IF EXISTS contacts;
  DROP TABLE IF EXISTS events;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS companies;
`)
  .then(
    () => console.log('drop tables complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });
require('dotenv').config();
const client = require('../db-client');

const users = require('../data/users2.json');
const events = require('../data/events2.json');
const contacts = require('../data/contacts2.json');
const companies = require('../data/companies2.json');

Promise.all(
  companies.map(company => {
    return client.query(`
        INSERT INTO companies (
          name
        )
        VALUES ($1);
    `,
    [company.name]
    ).then(result => result.rows[0]);
  })
)
  .then(() => {
    return Promise.all(
      users.map(user => {
        return client.query(`
            INSERT INTO users (email, password)
            VALUES ($1, $2);
        `,
        [user.email, user.password]
        ).then(result => result.rows[0]);
      })
    );
  })
  .then(() => {
    return Promise.all(
      events.map(event => {
        return client.query(`
            INSERT INTO events (
              user_id, 
              name, 
              event_date, 
              description
            )
            VALUES ($1, $2, $3, $4);
        `,
        [event.user_id, event.name, event.event_date, event.description]
        ).then(result => result.rows[0]);
      })
    );
  })
  .then(() => {
    return Promise.all(
      contacts.map(contact => {
        return client.query(`
            INSERT INTO contacts (
                name,
                email,
                other,
                notes,
                user_id,
                event_id,
                company_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        [contact.name, contact.email, contact.other, contact.notes, contact.user_id, contact.event_id, contact.company_id]
        ).then(result => result.rows[0]);
      })
    );
  })
  .then(
    () => console.log('seed data load successful'),
    err => console.error(err)
  )
  .then(() => client.end());


  

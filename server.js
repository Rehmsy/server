require('dotenv').config();

// basic express app
const express = require('express');
const app = express();

// middleware (cors and read json body)
const cors = require('cors');
//const morgan = require('morgan');
// app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
// server files in public directory
app.use(express.static('public'));

// connect to the database
const client = require('./db-client');

const auth = (req, res, next) => {
  const id = req.get('Authorization');
  if(!id || isNaN(id)) {
    next('No Authentication');
    return;
  }

  req.userId = +id;
  next();
};

// ROUTE: Get companies for ContactForm drop-down
app.get('/api/companies', (req, res, next) => {
  client.query(`
    SELECT *
    FROM companies
    ORDER BY companies.name
  `
  ).then(result => {
    res.send(result.rows);
  })
    .catch(next);
});

// ROUTE:  Get the events for a user
app.get('/api/events/:id', auth, (req, res, next) => {
  client.query(`
    SELECT events.id, 
        events.user_id as "userId", 
        events.name, 
        events.event_date as "eventDate", 
        events.description, 
    COUNT(contacts.id) as count
    FROM events
    JOIN contacts on events.id = contacts.event_id
    WHERE events.user_id = $1
    GROUP BY events.id
    ORDER BY events.event_date
    `,
  [req.params.id]
  ).then(result => {
    res.send(result.rows);
  })
    .catch(next);
});

// ROUTE: Add Event
app.post('/api/events', auth, (req, res, next) => {
  const body = req.body;
  const name = body.name;
  const eventDate = body.eventDate;
  const description = body.description;

  if(!name || !eventDate) {
    return next('Event name & date required');
  }

  client.query(`
    INSERT INTO events (user_id, name, event_date, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *, user_id as "userId", event_date as "eventDate";
  `,
  [body.userId, name, eventDate, description]
  ).then(result => {
    res.send(result.rows[0]);
  })
    .catch(next);
});

// ROUTE: Update Event
app.put('/api/events/:id', auth, (req, res, next) => {
  const body = req.body;
  const name = body.name;
  const eventDate = body.eventDate;

  if(!name || !eventDate) {
    return next('Event name & date required');
  }

  client.query(`
    UPDATE events
    SET
      name = $1,
      event_date = $2,
      description = $3,
    WHERE id = $4
    RETURNING id AS "eventId", name, event_date AS "eventDate", description;
  `,
  [name, eventDate, body.description, req.params.id]
  ).then(result => {
    res.send(result.rows[0]);
  })
    .catch(next);
});

//ROUTE: Add Company
app.post('/api/companies', (req, res, next) => {
  const body = req.body;
  const name = body.name;
  if(!name) {
    return next('Name required');  
  }
  client.query(`
  INSERT INTO companies (name)
  VALUES ($1)
  RETURNING id as "companyId", name;
  `,
  [name]
  ).then(result => {
    res.send(result.rows[0]);
  })
    .catch(next);
});

// ROUTE: Delete Event
app.delete('/api/events/:id', auth, (req, res, next) => {
  client.query(`
    DELETE FROM contacts WHERE event_id=$1;
  `,
  [req.params.id]
  ).then(() => {
    client.query(`
      DELETE FROM events WHERE id=$1;
    `,
    [req.params.id]
    ).then(() => {
      res.send({ removed: true });
    })
      .catch(next);
  });
});

// ROUTE:  User Sign-Up
app.post('/api/auth/signup', (req, res, next) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  if(!email || !password) {
    next('Email and password are required');
  }

  client.query(`
  SELECT count(*)
  FROM users
  WHERE email = $1
  `,
  [email])
    .then(results => {
      if(results.rows[0].count > 0) {
        throw new Error('Email already exists');
      }
    
      return client.query(`
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING id
      `,
      [email, password]);
    })
    .then(results => {
      res.send({ userId: results.rows[0].id });
    })
    .catch(next);
});

// ROUTE: User Sign-In
app.post('/api/auth/signin', (req, res, next) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  if(!email || !password) {
    next('Email and password are required');
  }

  client.query(`
    SELECT id, email, password
    FROM users
    WHERE email = $1
  `,
  [email]
  )
    .then(results => {
      const row = results.rows[0];
      if(!row || row.password !== password) {
        next('Email and/or password not found');
      }
      res.send({ userId: row.id, email: row.email });
    })
    .catch(next);
});

// must use all 4 parameters so express "knows" this is custom error handler!
// eslint-disable-next-line
app.use((err, req, res, next) => {
  console.log('\n \n***SERVER ERROR***\n \n', err);
  let message = 'INTERNAL SERVER ERROR';
  if(err.message) message = err.message;
  else if(typeof err === 'string') message = err;
  res.status(500).send({ message });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log('server running on port', PORT));
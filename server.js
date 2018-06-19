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

// ROUTE:  Get the events for a user
app.get('/api/events/:id', (req, res, next) => {
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

const PORT = process.env.PORT;
app.listen(PORT, () => console.log('server running on port', PORT));
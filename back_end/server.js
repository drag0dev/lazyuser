const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const users = require('./routes/api/users');

const app = express();

app.use(cookieParser());

app.use(cors({
    origin: 'https://hardcore-raman-df6a8c.netlify.app',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

//bodyparser middleware
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

//Conect to Mongo
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Use routes
app.use('/api/user', users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const router = require('./routes/router');

const app = express();

app.use(express.json());

app.use(express.json());
app.use((req, res, next) => {
    req.user = {
        _id: '6473674b4bda92778b526ac4',
    };
    next();
});

app.use('/', router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
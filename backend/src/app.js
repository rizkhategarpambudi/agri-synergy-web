const express = require('express');
const cors = require('cors');
const injectDb = require('./middlewares/injectDb');
const bodyParser = require('body-parser');
const passport = require('passport');
const userRoutes = require('./routes/userRoutes');
const produkRoutes = require('./routes/produkRoutes');
const kalenderRoutes = require('./routes/kalenderRoutes');

const loginRoutes = require('./routes/loginRoutes');

const app = express();

app.use(passport.initialize());
require('./middlewares/passport')

app.use(cors());
app.use(bodyParser.json());
app.use(injectDb);

app.use('/api', userRoutes);
app.use('/api', produkRoutes);
app.use('/api', kalenderRoutes);

app.use('/api/auth', loginRoutes);


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

module.exports = app; 


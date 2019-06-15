const express = require('express');
const connectedToDB = require('./config/db');

//Server Basic config
const app = express();
//Setup bodyparser
app.use(express.json({ extended: false }));

//Connect to Database
connectedToDB();

//Define Backend api
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));


//Server Port Config
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running Server On Port ${PORT}`));
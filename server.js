const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const {animals} = require('./data/animals');
const fs = require('fs');
const path = require('path');
//set PORT equal to running process env port or 3001 if not
const PORT = process.env.PORT || 3001;

//instantiate server and assign to app so we can chain methods to it later
const app = express();
//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming json data
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.use(express.static('public'));



//setup listen() method on server
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});





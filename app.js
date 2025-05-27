const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const indexRoutes = require('./routes/index.routes');
app.use('/', indexRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

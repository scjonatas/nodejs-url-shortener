'use strict';

const config = require('./config');
const router = require('./router');
const express = require('express');
const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.listen(config.APP_PORT);
console.log('Started listening at port ' + config.APP_PORT);

router.route(app);

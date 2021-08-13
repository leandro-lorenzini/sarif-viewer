#!/usr/bin/env node

const fileUpload = require('express-fileupload');
const express = require('express');
const uploadRoute = require('./src/routes/upload');
const resultRoute = require('./src/routes/result');
const issueRoute  = require('./src/routes/issue');
const partials = require('express-partials');
const config = require('./src/config');

const app = express();

// Using EJS with partials as view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');
app.use(partials());
app.use(express.static('public'))

// Setting upload file size limit
app.use(fileUpload({
    limits: {
        fileSize: 1 * 1024 * 1024
    },
    abortOnLimit: true,
    limitHandler: (req, res) => {
        return res.render('home', { alert: `File is too large to be uploaded, 
            please upload a file which doesn't exceed 1MB.` })
    }
}));

// Home page
app.get('/', (req, res) => {  
    return res.render('home');
});

app.use('/upload', uploadRoute);
app.use('/result', resultRoute);
app.use('/issue',  issueRoute);

app.listen(8080, (err) => {
    console.log('Go to http://localhost:8080 to use the application!')
});
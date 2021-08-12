#!/usr/bin/env node

const fileUpload = require('express-fileupload');
const express = require('express');
const partials = require('express-partials');
const uuid = require('uuid');
const fs = require('fs');

const app = express();

// Using EJS with partials as view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(partials());

// Setting upload file size limit
app.use(fileUpload({
    limits: {
        fileSize: 1 * 1024 * 1024
    },
    abortOnLimit: true,
    limitHandler: (req, res) => {
        res.render('home', { alert: `File is too large to be uploaded, 
            please upload a file which doesn't exceed 1MB.` })
    }
}));

// Home page
app.get('/', (req, res) => {  
    res.render('home');
});

// File upload handler
app.post('/upload', (req, res) => {
    const file = req.files.sarif;
    const fileName = uuid.v4(); // File name should be unique
    const uploadPath = __dirname + '/upload/' + fileName;

    file.mv(uploadPath, (err) => {
        console.log(err);
        return res.render('home', { alert: `An error happened while uploading the selected file` });
    });

    res.redirect('/result/' + fileName);
});

// Results page
app.get('/result/:id', (req, res) => {
    
    // If file can't be parsed as JSON, return error
    try {
        var result = JSON.parse(fs.readFileSync(__dirname + '/upload/' + req.params.id));
    } catch (error) {
        console.log(error);
        res.render('home', { alert: `An issue happened while parsing the sarif file, 
            the JSON structure seems not to be correct.` })
    }
    
    // Extracting rules from results
    var rules = {};
    result.runs[0].tool.driver.rules.forEach(rule => {
        rules[rule.id] = {
            description: rule.shortDescription?.text,
            help: rule.help?.text
        }
    });

    // Extract unique file names from results (To be used in filters)
    var files = new Set(result.runs[0].results.map(result => {
        return result.locations[0].physicalLocation.artifactLocation.uri;
    }));
    files = [...files];

    var vulnerabilities = result.runs[0].results;

    // Filter results according to user input
    const filters = {
        level: req.query.level || [],
        file: req.query.file || [],
        rule: req.query.rule || []
    }

    if (filters.level.length) {
        vulnerabilities = vulnerabilities.filter(vulnerability => {
            return filters.level.includes(vulnerability.level) ? vulnerability:false;
        })
    }

    if (filters.file.length) {
        vulnerabilities = vulnerabilities.filter(vulnerability => {
            return filters.file.includes(vulnerability.locations[0].
                physicalLocation.artifactLocation.uri) ? vulnerability:false;
        })
    }

    if (filters.rule.length) {
        vulnerabilities = vulnerabilities.filter(vulnerability => {
            return filters.rule.includes(vulnerability.ruleId) ? vulnerability:false;
        })
    }
    
    res.render('results', { rules, files, vulnerabilities, filters })
});

app.listen(8080, (err) => {
    console.log('Go to http://localhost:8080 to use the application!')
});
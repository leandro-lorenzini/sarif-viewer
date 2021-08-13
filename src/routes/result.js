const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const router = express.Router();

router.get('/:id', (req, res) => {
    
    // If file can't be parsed as JSON, return error
    try {
        var result = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'upload', req.params.id)));

        if (!result.runs) {
            return res.render('home', { alert: `An issue happened while parsing the sarif file, 
            the JSON structure seems correct but SARIF format is not right.` })
        }

    } catch (error) {
        return res.render('home', { alert: `An issue happened while parsing the sarif file, 
            the JSON structure seems not to be correct.` })
    }
    
    // Extracting rules from results
    var rules = {};
    var vulnerabilities = [];

    result.runs.forEach(run => {
        run.tool.driver.rules.forEach(rule => {
            rules[rule.id] = {
                name: rule.name,
                description: rule.shortDescription?.text,
                help: rule.help?.text,
                scanner: {
                    name: run.tool.driver.name,
                    url: run.tool.driver.informationUri
                }
            }
        });
        vulnerabilities = vulnerabilities.concat(run.results);
    });

    // Extract unique file names from results (To be used in filters)
    var files = new Set(vulnerabilities.map(result => {
        return result.locations[0].physicalLocation.artifactLocation.uri;
    }));
    files = [...files];

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
    
    return res.render('results', { config, rules, files, vulnerabilities, filters, qs: require('qs').stringify })
});

module.exports = router;
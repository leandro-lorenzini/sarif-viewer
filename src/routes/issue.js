const express = require('express');
const gitlab = require('../services/gitlab');
const router = express.Router();

router.get('', (req, res) => {
    gitlab.createIssue(
        req.query.title, 
        req.query.description,
        req.query.file,
        req.query.startLine,
        req.query.endLine,
        req.query.help).then(url => {
        return res.redirect(url);
    }).catch(err => {
        return res.render('home', {alert: 'An unexpected problem happened while creating the issue.'})
    })
});

module.exports = router;
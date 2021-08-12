const express = require('express');
const uuid = require('uuid');
const path = require('path');

const router = express.Router();

router.post('', (req, res) => {
    const file = req.files.sarif;
    const fileName = uuid.v4(); // File name should be unique
    const uploadPath = path.join(__dirname, '..', '..', 'upload', fileName);

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.render('home', { alert: `An error happened while uploading the selected file` });
        }
    });

    return res.redirect('/result/' + fileName);
});

module.exports = router;
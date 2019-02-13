const express = require('express');
const request = require('request');
const router = express.Router();

const apiAddress = process.env.API_ADDRESS;

router.get('/', function(req, res, next) {
    request(`${apiAddress}/games`, {json: true, method: 'get'}, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            const games = body.games;
            res.render('index', {title: 'Game List', games, session: req.session});
        }
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const request = require('request');

const apiAddress = process.env.API_ADDRESS;

router.get('/:gameID', function(req, res, next) {
    request(`${apiAddress}/games/` + req.params.gameID, {json: true, method: 'get'}, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            res.render('game', {title: body.game.name, data: response.body.game, session: req.session});
        } else {
            //next(new Error('something gone wrong in get gameID, maybe no gameID'));
            next();
        }
    });
});

router.get('/edit/:gameID', function(req, res, next) {
    if (req.session && req.session.editpower) {
        request(`${apiAddress}/games/` + req.params.gameID, {json: true, method: 'get'}, (err, response, body) => {
            response.body.game.editing = true;
            res.render('editGame', {title: 'Edit: ' + body.game.name, data: response.body.game, editing: true, session: req.session});
        });
    } else {
        res.redirect('/game/' + req.params.gameID);
    }
});

router.get('/new/', function(req, res, next) {
    if (req.session && req.session.editpower) {
        const data = {editing: false};
        res.render('editGame', {title: 'New Game', data, editing: false, session: req.session});
    } else {
        res.redirect('/user/login');
    }
});

router.post('/new/', function(req, res, next) {
    if (req.session && req.session.editpower) {
        delete req.body.editing;
        request(`${apiAddress}/games/`, {json: true, method: 'post', body: req.body}, (err, response, body) => {
            res.redirect('/game/' + body.game._id);
        });
    } else {
        res.redirect('/game/' + req.params.gameID);
    }
});

router.post('/edit/:gameID', function(req, res, next) {
    if (req.session && req.session.editpower) {
        delete req.body.editing;
        request(`${apiAddress}/games/` + req.params.gameID, {json: true, method: 'patch', body: req.body}, (err, response, body) => {
            res.redirect('/game/' + req.params.gameID);
        });
    } else {
        res.redirect('/game/' + req.params.gameID);
    }
});

router.get('/delete/:gameID', function(req, res, next) {
    if (req.session && req.session.editpower) {
        request(`${apiAddress}/games/` + req.params.gameID, {json: true, method: 'delete'}, (err, response, body) => {
            res.redirect('/');
        });
    } else {
        res.redirect('/game/' + req.params.gameID);
    }
});

router.get('/list/', function(req, res, next) {
    if (req.session) {
        request(`${apiAddress}/games`, {json: true, method: 'get'}, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                const games = body.games;
                res.render('listgames', {title: 'Game List', games, session: req.session});
            }
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;

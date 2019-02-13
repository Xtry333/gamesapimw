const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Game = require('../models/game');

function compare(a, b) {
    if (a.name < b.name) {
        return -1;
    } else if (a.name > b.name) {
        return 1;
    } else {
        return 0;
    }
  }
  

router.get('/', (req, res, next) => {
    Game.find().exec().then((result) => {
        if (result) {
            res.status(200).json({
                length: result.length,
                games: result.sort(compare)
            });
        } else {
            res.status(404).json({
                err: 'Not Found'
            });
        }
    }).catch((err) => {
        res.status(500).json({
            shorterror: 'Something went wrong',
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const game = new Game({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        image: req.body.image
    });

    game.save().then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Created game",
            game: game
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: "Error",
            error: err
        });
    });
});

router.get('/:gameID', (req, res, next) => {
    const id = req.params.gameID;
    Game.findById(id).exec().then((result) => {
        if (result) {
            res.status(200).json({
                game: result
            });
        } else {
            res.status(404).json({
                error: 'Game not found',
                reqId: id
            });
        }
    }).catch((err) => {
        res.status(500).json({
            shorterror: 'Invalid ID',
            error: err
        });
    });
});

router.patch('/:gameID', (req, res, next) => {
    const id = req.params.gameID;
    const newGame = req.body;
    Game.findByIdAndUpdate(id, {$set: newGame}, {runValidators: true}).exec().then((oldGame) => {
        res.status(200).json({
            message: "Game updated",
            oldGame,
            newGame
        });
    }).catch(callError);

    function callError(err) {
        res.status(500).json({
            error: err,
            message: "Cannot patch",
            oldGame,
            newGame
        });
    }
});

router.delete('/:gameID', (req, res, next) => {
    const id = req.params.gameID;
    Game.deleteOne({_id: id}).exec().then((result) => {
        res.status(200).json({
            message: "Game removed from database",
            reqId: id,
        });
    }).catch((err) => {
        res.status(500).json({
            error: err,
            reqId: id,
        })
    });
    
});

module.exports = router;
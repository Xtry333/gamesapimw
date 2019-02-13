const express = require('express');
const router = express.Router();
const request = require('request');
const crypto = require('crypto');

const apiAddress = process.env.API_ADDRESS;

function hash(str) {
    const hash = crypto.createHash('sha256');
    return hash.update(str).digest('hex').toString('hex');
}

function requiresLogin(req, res, next) {
    console.log('req login');
    if (req.session && req.session.username) {
        return next();
    } else {
        return res.redirect('/user/login');
    }
}

router.get('/', (req, res, next) => {
    res.redirect('/user/profile');
});

router.get('/register', (req, res, next) => {
    if (req.session && req.session.username) {
        return res.redirect('/user/profile');
    }
    res.render('register', {session: req.session});
});

router.get('/login', (req, res, next) => {
    if (req.session && req.session.username) {
        res.redirect('/user/profile');
    } else {
        res.render('login', {title: 'Login'});
    }
});

router.post('/register', (req, res, next) => {
    let rb = req.body;
    if (rb.username && rb.email && rb.password && rb.password == rb.confirm_password) {
        let u = {
            username: rb.username,
            email: rb.email,
            password: rb.password
        };
        request(`${apiAddress}/user`, {json: true, method: 'post', body: u}, (err, response, body) => {
            console.log(response);
            
            if (!err && response.statusCode == 200) {
                req.session.username = response.body.user.username;
                req.session.editpower = response.body.user.editpower;
                res.redirect('/user/profile');
            }
        });
    } else {
        let data = {
            invalid: true
        };
        return res.render('register', {title: 'Register', data, session: req.session});
    }
});

router.post('/login', (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.redirect('/');
    }

    request(`${apiAddress}/users/` + req.body.username, {json: true}, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            if (response.body.user.password === hash(req.body.password)) {
                req.session.username = response.body.user.username;
                req.session.editpower = response.body.user.editpower;
                const data = response.body;
                res.redirect('/user/profile');
            } else {
                const data = {};
                data.ipw = true;
                res.render('register', {title: 'Register', data, session: req.session});
            }
        } else {
            next(new Error(err));
        }
    });
});

router.get('/profile', requiresLogin, (req, res, next) => {
    request(`${apiAddress}/users/` + req.session.username, {json: true}, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            data = body;
            data.user.creation = new Date(data.user.creationdate).toLocaleDateString();

            res.render('profile', {title: 'Profile', data, session: req.session});
        } else {
            next(new Error(body.shorterror));
        }
    });
});

router.get('/editprofile', requiresLogin, (req, res, next) => {
    request(`${apiAddress}/users/` + req.session.username, {json: true}, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            data = body;

            res.render('editprofile', {title: 'Profile', data, session: req.session});
        } else {
            next(new Error(body.shorterror));
        }
    });
});

router.post('/editprofile', requiresLogin, (req, res, next) => {
    if (req.body.gender) {
        if (!(req.body.gender == 'Male' || req.body.gender == 'Female')) {
            delete req.body.gender;
        }
    }
    request(`${apiAddress}/users/` + req.session.username, {json: true, method: 'patch', body: req.body}, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            res.redirect('/user/profile');
        } else {
            next(new Error(body.shorterror));
        }
    });
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        // delete session object
        req.session.destroy((err) => {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
  });

module.exports = router;
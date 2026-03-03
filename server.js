const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 1. Session for Login
app.use(session({ secret: 'iot_secret', resave: false, saveUninitialized: true }));

// 2. Mock Database for Device
let speakerData = { id: "SPKR01", vol: 50, status: "Online", cmd: "none" };

// 3. Routes
app.get('/', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
    if(req.body.user === 'admin' && req.body.pass === '123') {
        req.session.loggedIn = true;
        res.redirect('/dashboard');
    } else { res.send("Invalid Login"); }
});

app.get('/dashboard', (req, res) => {
    if(!req.session.loggedIn) return res.redirect('/');
    res.render('dashboard', { data: speakerData });
});

// 4. API for ESP32 & Controls
app.get('/api/get-command', (req, res) => res.json(speakerData));

app.post('/api/set-command', (req, res) => {
    speakerData.cmd = req.body.cmd;
    speakerData.vol = req.body.vol || speakerData.vol;
    res.sendStatus(200);
});

app.listen(3000);
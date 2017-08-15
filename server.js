#!/usr/bin/env node
const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');

// setup HTTPS, as our Twitch Electron instance requires it
var dev_pk  = fs.readFileSync('config/dkey.pem', 'utf8');
var dev_cert = fs.readFileSync('config/dcert.pem', 'utf8');
var credentials = {key: dev_pk, cert: dev_cert};

const app = express();
app.use(express.static('build'));

var httpsServer = https.createServer(credentials, app)
    .listen(8080, function () {
        console.log('[HTTPS] Development server started on http://localhost:8080')
    });
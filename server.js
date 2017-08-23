#!/usr/bin/env node
const express = require('express');
const fs = require('fs');
const pem = require('pem');
const https = require('https');
const http = require('http');

pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
    const app = express();
    app.use(express.static('build'));
    
    var httpsServer = https.createServer({key: keys.serviceKey, cert: keys.certificate}, app)
    .listen(10443, function () {
        console.log('[HTTPS] Development server started on https://localhost:10443')
    });
});

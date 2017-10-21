const express = require('express');
const path = require('path');

module.exports = function(app) {
  const controller = require('./controller.js');
  // serve static assets normally
  app.use(express.static(__dirname + '/'));

  app.use((req, res, next) => {
    var origin = req.headers.origin;
    var allowedOrigins = [
      'http://localhost:3000',
      'http://ies.znewton.xyz', 'https://ies.znewton.xyz'
    ]
    console.log(origin);
    if (allowedOrigins.indexOf(origin) > -1) {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
  })
  // Routes
  app.route('/')
    .get((req, res) => {
      res.sendFile(path.resolve(__dirname, '/', 'index.html'))
    })
  app.route('/uploadCSS')
    .get(controller.upload_css);

  app.route('/uploadJS')
    .get(controller.upload_js);
};
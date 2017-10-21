const https = require('https');
const querystring = require('query-string');
const fs = require('fs');

var sessions = {};

exports.gen_session_id = function (request, response) {
  console.log('Recieved: Request to Generate Session Id');
  var sessionId;
  do {
    // generate random alphanumeric string of length 30
    sessionId = (Math.random()*1e49).toString(36).slice(2).toUpperCase();
  } while (sessions[sessionId]);
  sessions[sessionId] = Date.now();
  fs.mkdir('/server/temp/'+sessionId, function(err) {
    if (!err) {
      console.log("Successfully created dir: /server/temp/"+sessionId);
    }
  });
  response.json({
    sessionId: sessionId
  });
}

exports.get_code = function (request, response) {
  console.log('Recieved: Request to Get Code');
  var query = request.query;
  console.log(query);
  console.log(sessions);
  var sessionId = query.session;
  console.log(sessionId);
  if (!sessionId || !sessions[sessionId]) {
    console.log("Invalid Session Id")
    response.status(201).send('Invalid Session Id');
    return;
  }
  response.json({
    js: '// I am JS code from the server\n',
    css: '/* I am CSS code from the server*/\n'
  });
}

exports.upload_code = function (request, response) {
  console.log('Recieved: Request to Upload CSS');
  console.log(request.params);
  var js = request.params.js || '';
  var css = request.params.css || '';
}
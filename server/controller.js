const https = require('https');
const querystring = require('query-string');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const path = require('path');

var sessions = {};
const TEMP_DIR = path.resolve('./server/temp/') + "/";

exports.gen_session_id = function (request, response) {
  console.log('Recieved: Request to Generate Session Id');
  var sessionId;
  do {
    // generate random alphanumeric string of length 30
    sessionId = (Math.random()*1e49).toString(36).slice(2).toUpperCase();
  } while (sessions[sessionId]);
  sessions[sessionId] = Date.now();
  function success() {
    response.json({
      sessionId: sessionId
    });
  }
  function failure(loc, err) {
    console.log("Failed at creation of: " + loc);
    console.log(err);
    response.status(500).send("Failed to create session");
  }
  fs.mkdir(TEMP_DIR+sessionId, function(err) {
    if (!err) {
      console.log("Successfully created dir: "+TEMP_DIR+sessionId);
      fs.appendFile(TEMP_DIR+sessionId+'/temp.js', '// your js here', function(jserr) {
        if (!jserr) {
          console.log('Successfully created js file: ' + TEMP_DIR+sessionId+'/temp.js')
          fs.appendFile(TEMP_DIR+sessionId+'/temp.css', '/* your css here */',  function(csserr) {
            if (!err) {
              console.log('Successfully created css file: ' + TEMP_DIR+sessionId+'/temp.css')
              success();
            } else {
              failure('css', csserr);
            }
          });
        } else {
          failure('js', jserr);
        }
      });
    } else {
      console.log(err.message);
      failure('dir', err);
    }
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
  var decoder = new StringDecoder('utf8')
  var js = fs.readFileSync(TEMP_DIR+sessionId+'/temp.js');
  var css = fs.readFileSync(TEMP_DIR+sessionId+'/temp.css');
  var output = {
    js: decoder.write(js),
    css: decoder.write(css)
  }
  console.log("Returning: ", output);
  response.json(output);
}

exports.upload_code = function (request, response) {
  console.log('Recieved: Request to Upload CSS');
  console.log(request.params);
  var js = request.params.js || '';
  var css = request.params.css || '';
}
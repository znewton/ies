const https = require('https');
const http = require('http');
const URL = require('url');
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
  sessions[sessionId] = {
    timestamp: Date.now(),
    site: ''
  };
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
              fs.writeFile(TEMP_DIR+sessionId+'/temp.html', '', 'utf8', function (htmlerr) { 
                if (!htmlerr) {
                  console.log('Successfully created html file: ' + TEMP_DIR+sessionId+'/temp.html')
                  success();
                } else {
                  failure('html', htmlerr);
                }
              });
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
  var html = null;
  try {
    html = fs.readFileSync(TEMP_DIR+sessionId+'/temp.html');
  } catch (e) {
    html = null;
  }
  output = {
    js: decoder.write(js),
    css: decoder.write(css),
    site: sessions[sessionId].site,
    html: html ? decoder.write(html) : ''
  }
  // console.log("Returning: ", output);
  response.json(output);
}

exports.upload_code = function (request, response) {
  console.log('Recieved: Request to Upload Code');
  console.log(request.body);
  var js = request.body.js || '';
  var css = request.body.css || '';
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
  fs.writeFile(TEMP_DIR+sessionId+'/temp.js', js, 'utf8', function (jserr) {
    if (!jserr) {
      fs.writeFile(TEMP_DIR+sessionId+'/temp.css', css, 'utf8', function (csserr) {
        if (!csserr) {
          response.status(200).send('Success')
        } else {
          console.log('failed at write css');
          response.status(201).send('failure')
        }
      });
    } else {
      console.log('failed at write js');
      response.status(201).send('failure')
    }
  });
}

exports.set_session_url = function (request, response) {
  console.log('Recieved: Request to Set Session URL');
  console.log(request.body);
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
  var url = request.body.site;
  sessions[sessionId].site = url;
  if (!url) {
    console.log('Recieved Blank Url');
    response.status(201).send("Blank URL is invalid");
    return;
  }
  var parsedUrl = URL.parse(url);
  console.log()
  var protocol = http;
  var pport = 80;
  if (parsedUrl.protocol == "https:") {
    protocol = https;
    pport = null
  }
  protocol.get({
    host: parsedUrl.host,
    path: parsedUrl.path,
    port: pport,
  }, function (res) {
    var html = '';
    res.setEncoding('utf8');
    res.on('data', function (data) {
      html += data;
    })
    res.on('end', function () {
      var startHeadIndex = html.indexOf("<head>")+"<head>".length;
      if (startHeadIndex >= 0) {
        var baseUrl = parsedUrl.href;
        html = [html.slice(0,startHeadIndex),
           '<base href = "'+baseUrl+'" />',
           html.slice(startHeadIndex)].join('');
      }
      var endHeadIndex = html.indexOf("</head>");
      if (endHeadIndex >= 0) {
        html = [html.slice(0,endHeadIndex), 
          '<link rel="stylesheet" href="http://znewt-ies.herokuapp.com/temp/'+sessionId+'/temp.css">',
          html.slice(endHeadIndex)].join('');
      }
      var endBodyIndex = html.indexOf("</body>");
      if (endBodyIndex >= 0) {
        html = [html.slice(0,endBodyIndex), 
          '<script href="http://znewt-ies.herokuapp.com/temp/'+sessionId+'/temp.js"></scrip>',
          html.slice(endBodyIndex)].join('');
      }
      fs.writeFile(TEMP_DIR+sessionId+'/temp.html', html,  function(err) {
        if (!err) {
          console.log('Successfully created html file: ' + TEMP_DIR+sessionId+'/temp.html')
          response.status(200).send(html);
        } else {
          console.log("Failed at creation of: " + 'html');
          console.log(err);
          response.status(500).send("Failed to create session html file");
        }
      });
    })
  }).on('error', function (err) {
    console.log('Failed to access: ' + url);
    console.log(err);
    response.status(500).send('Failed to access: ' + url);
  });
}
const localUrl = 'http://localhost:3000';
const prodUrl = 'https://znewt-ies.herokuapp.com';
var endpoint;
if (window.location.hostname == 'localhost') {
  endpoint = localUrl;
} else {
  endpoint = prodUrl;
}
var sessionId = window.location.hash.slice(1);
var js, css;
if (!sessionId) {
  getNewSession();
} else {
  console.log("On Session:", sessionId);
  getSessionCode();
}

function getNewSession(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint + '/session');
  xhr.send(null);
  xhr.onreadystatechange = function () {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    if (xhr.readyState === DONE) {
      if (xhr.status === OK)  {
        var response = JSON.parse(xhr.responseText);
        sessionId = response.sessionId; // 'This is the returned text.'
        console.log("New Session:", sessionId);
        window.location.hash = sessionId;
        getSessionCode();
      } else {
        console.log('Error: ' + xhr.status); // An error occurred during the request.
      }
    };
  }
}

function getSessionCode() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint + '/code?session=' + sessionId);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    if (xhr.readyState === DONE) {
      if (xhr.status === OK)  {
        var response = JSON.parse(xhr.responseText);
        js = response.js;
        css = response.css;
        setJSCode(js);
        setCSSCode(css);
      } else {
        console.log('Error: ' + xhr.status, xhr.responseText); // An error occurred during the request.
        console.log("Getting new Session");
        if (xhr.status == 201) {
          getNewSession();
        }
      }
    };
  }
}
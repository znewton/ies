const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + '/app/'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve('./app/index.html'))
})
app.get('/editor', function (req, res) {
  res.sendFile(path.resolve('./app/editor.html'))
})

app.listen(port, function () {
  console.log('Listening on port '+port);
})
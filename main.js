/* global __dirname */
var server = require('http').createServer();
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));        // Static files

var wir = require('./_wireless.js')(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.on('request', app);

server.listen(8881, function () { console.log('Wifi ....' + server.address().port); });
// Console will print the message
console.log('Server running at http://127.0.0.1:8881/');

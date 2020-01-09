
/*
https://www.npmjs.com/package/wifi-control

*/
var _wireless = function (app) {
  var WiFiControl = require('wifi-control');

  //  Initialize wifi-control package with verbose output
  WiFiControl.init({
    debug: true,
    //  iface: 'wlan',// wlan form windows
  });
  var ifaceState = WiFiControl.getIfaceState();
  //  Try scanning for access points:

  app.get('/getAvailableNetworks', function (req, res) {
    ifaceState = WiFiControl.getIfaceState();
    console.log(JSON.stringify(ifaceState));
    WiFiControl.scanForWiFi(function (err, response) {
      if (err) {
        console.log(err);
        return;
      }

      console.log(response);
      var responseObj = {};
      responseObj.resultSet = response;
      responseObj.ifaceState = ifaceState;
      res.send(responseObj);
    });
  });


  app.post('/connectToNetwork', function (req, res) {

    //  Try Connect To WiFi Network:
    // if (ifaceState.connection != "disconnected") {
    //   WiFiControl.resetWiFi(function (err, response) {
    //     if (err) console.log(err);
    //     console.log(response);
    //   });

    // }
    var _ap = {
      ssid: req.body.ssid,
      password: req.body.password
    };
    var results = WiFiControl.connectToAP(_ap, function (err, response) {

      if (err) console.log(err);
      console.log(response);
      res.send(response);
    });
  });

  app.post('/disConnectToNetwork', function (req, res) {

    WiFiControl.resetWiFi(function (err, response) {
      if (err) console.log(err);
      console.log(response);
      res.send(response)
    });
  });
};

module.exports = _wireless;

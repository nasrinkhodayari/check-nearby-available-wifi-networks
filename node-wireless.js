var node_wireless = function (app) {
    var Wireless = require('wireless');
    var WiFiControl = require('wifi-control');
    //  Initialize wifi-control package with verbose output
    WiFiControl.init({
        debug: true,
        iface: 'wlan',// wlan form windows
    });
    var ifaceState = WiFiControl.getIfaceState();
    if (ifaceState.success) {
        var wireless = new Wireless({
            iface: 'wlan',
            updateFrequency: 10, // Optional, seconds to scan for networks
            connectionSpyFrequency: 2, // Optional, seconds to scan if connected
            vanishThreshold: 2 // Optional, how many scans before network considered gone
        });

        wireless.enable(function (err) {
            wireless.start();
        });

    }

}

module.exports = node_wireless;
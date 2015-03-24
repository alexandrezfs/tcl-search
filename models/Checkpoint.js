var request = require('request');
var config = require('../config');

exports.getData = function(callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/smartdata/tcl_sytral.tclpassagearret/all.json';

    request({url: url}, function (error, response, body) {
        console.log(body);

        callback(body);
    });

};
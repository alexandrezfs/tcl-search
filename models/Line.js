var request = require('request');
var config = require('../config');

exports.getDataBus = function(callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/smartdata/tcl_sytral.tcllignebus/all.json';

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};

exports.getDataMetro = function(callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/smartdata/tcl_sytral.tcllignemf/all.json';

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};

exports.getDataTram = function(callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/smartdata/tcl_sytral.tcllignetram/all.json';

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};
var request = require('request');
var config = require('../config');

exports.getData = function(callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/rdata/tcl_sytral.tclalertetrafic/all.json';

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};

exports.getbyId = function(id, callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/rdata/tcl_sytral.tclalertetrafic/all.json?field=id&value=' + id;

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};

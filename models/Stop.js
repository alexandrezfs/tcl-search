var request = require('request');
var config = require('../config');

exports.getData = function(stop_id, callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/rdata/tcl_sytral.tclarret/all.json?field=ligne&value=' + stop_id;

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};

exports.getAllData = function(callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/rdata/tcl_sytral.tclarret/all.json?maxfeatures=40000';

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};
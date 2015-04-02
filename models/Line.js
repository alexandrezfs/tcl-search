var request = require('request');
var config = require('../config');

exports.getDataBus = function(line, callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/rdata/tcl_sytral.tcllignebus/all.json?field=ligne&value=' + line + '&maxfeatures=1';

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};

exports.getDataMetro = function(line, callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/rdata/tcl_sytral.tcllignemf/all.json?field=ligne&value=' + line + '&maxfeatures=1';

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};

exports.getDataTram = function(line, callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/rdata/tcl_sytral.tcllignetram/all.json?field=ligne&value=' + line + '&maxfeatures=1';

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};
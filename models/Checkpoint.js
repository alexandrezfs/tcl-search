var request = require('request');
var config = require('../config');

exports.getDataByTitanCode = function(tcl_titan_code, callback) {

    var username = config.values.datalyon_username,
        password = config.values.datalyon_password,
        url = 'https://' + username + ':' + password + '@download.data.grandlyon.com/ws/rdata/tcl_sytral.tclpassagearret/all.json?field=ligne&value=' + tcl_titan_code;

    request({url: url}, function (error, response, body) {
        //console.log(body);

        callback(body);
    });

};
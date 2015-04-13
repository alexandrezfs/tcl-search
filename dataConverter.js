var Checkpoint = require('./models/Checkpoint'),
    Stop = require('./models/Stop'),
    Line = require('./models/Line'),
    TrafficAlert = require('./models/TrafficAlert'),
    uuid = require('node-uuid'),
    moment = require('moment');


exports.getFormattedDataBus = function(requestedLineName, callback) {

    var formattedLines = [];

    //Getting all potential lines
    Line.getDataBus(requestedLineName, function (dataBus) {

        var busLines = JSON.parse(dataBus);
        busLines = busLines.values;

        var lines = busLines;

        lines.forEach(function (line) {

            formattedLines.push({
                key: line[0],
                lineId: line[1],
                direction: line[2],
                lineName: line[5],
                url: '/line/' + line[0].substring(0, line[1].length + 1) + '/' + requestedLineName
            });

        });

        callback(formattedLines);
    });
};

exports.getAllStopsData = function(callback) {


};

exports.getCheckpointData = function(titan_code, callback) {


};

exports.getTrafficAlertData = function(callback) {


};
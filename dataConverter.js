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

    TrafficAlert.getData(function (data) {

        console.log(data);

        var alerts = JSON.parse(data);
        alerts = alerts.values;

        var formattedAlerts = [];

        var i = 0;

        alerts.forEach(function (alert) {

            i++;

            formattedAlerts.push({
                key: uuid.v4(),
                type: alert[1],
                start: moment(alert[2]).format('ll'),
                end: moment(alert[3]).format('ll'),
                lineId: alert[4].substr(0, alert[4].length - 1),
                stopName: alert[6],
                message: alert[7],
                updated_at: moment(alert[9]).format('ll'),
                idAccordion: 'collapse-' + i,
                targetIdAccordion: '#collapse-' + i
            });
        });

        callback(formattedAlerts);
    });
};
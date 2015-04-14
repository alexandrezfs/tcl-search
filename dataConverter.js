var Checkpoint = require('./models/Checkpoint'),
    Stop = require('./models/Stop'),
    Line = require('./models/Line'),
    TrafficAlert = require('./models/TrafficAlert'),
    uuid = require('node-uuid'),
    moment = require('moment'),
    SearchEngine = require('./SearchEngine'),
    lunr = require('lunr');


exports.getFormattedDataBus = function (requestedLineName, callback) {

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

exports.getCheckpointData = function (titan_code, line_id, callback) {

    Stop.getAllData(function (dataAllStops) {
        Checkpoint.getData(titan_code, function (dataStops) {

            //getting all items that matches with our line
            console.log(dataStops);
            var dataStops = JSON.parse(dataStops);
            var stops = dataStops.values;
            var formattedStops = [];

            var allStops = JSON.parse(dataAllStops);
            allStops = allStops.values;

            stops.forEach(function (stop) {

                allStops.forEach(function (stopFromA) {

                    if (stopFromA[0] == stop[0]) {

                        formattedStops.push({
                            key: uuid.v4(),
                            stopName: stopFromA[1],
                            lineId: line_id,
                            lineTitanCode: stop[1],
                            direction: stop[2],
                            type: stop[4],
                            newCheckTime: stop[3],
                            newCheckDateTime: stop[5]
                        });

                    }
                });
            });

            callback(formattedStops);
        });
    });

};

exports.getTrafficAlertData = function (callback) {

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

exports.getStopsByKeyword = function (keyword, callback) {

    Stop.getAllData(function (dataAllStops) {

        var allStops = JSON.parse(dataAllStops);
        allStops = allStops.values;

        var formattedStops = [];

        allStops.forEach(function (stop) {

            formattedStops.push({
                id: uuid.v4(),
                key: uuid.v4(),
                stop_id: stop[0],
                stopName: stop[1],
                linked_lines: stop[2],
                ascenseur: stop[4],
                escalator: stop[5],
                url: '/stop/' + stop[0]
            });

            formattedStops.sort(function (a, b) {
                if (a.stopName < b.stopName) return -1;
                if (a.stopName > b.stopName) return 1;
                return 0;
            });

        });

        var searchIndex = lunr(function () {
            this.field('stopName', {boost: 10})
        });

        formattedStops.forEach(function (formattedStop) {
            searchIndex.add(formattedStop);
        });

        var result = searchIndex.search(keyword);
        var filteredFormattedStops = [];

        result.forEach(function (r) {
            formattedStops.forEach(function (formattedStop) {
                if (formattedStop.id == r.ref) {
                    filteredFormattedStops.push(formattedStop);
                }
            });
        });

        //Check for line names
        filteredFormattedStops.forEach(function(filteredFormattedStop) {
            var lines = filteredFormattedStop.linked_lines;
            var allLines = lines.split(",");
            var formattedLines = [];
            allLines.forEach(function(aLine) {
                var aLineDetails = aLine.split(":");
                formattedLines.push({
                    code: aLineDetails[0],
                    direction: aLineDetails[1],
                    key: uuid.v4()
                });
            });
            filteredFormattedStop.formattedLines = formattedLines;
        });

        callback(filteredFormattedStops);

    });
};
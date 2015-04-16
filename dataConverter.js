var Checkpoint = require('./models/Checkpoint'),
    Stop = require('./models/Stop'),
    Line = require('./models/Line'),
    TrafficAlert = require('./models/TrafficAlert'),
    uuid = require('node-uuid'),
    moment = require('moment'),
    lunr = require('lunr'),
    dataManipulator = require('./dataManipulator');


exports.getFormattedDataBus = function (requestedLineName, callback) {

    var formattedLines = [];

    //Getting all potential lines
    Line.getDataBus(requestedLineName, function (dataBus) {

        var busLines = JSON.parse(dataBus);
        busLines = busLines.values;

        var lines = busLines;

        lines.forEach(function (line) {

            formattedLines.push({
                key: uuid.v4(),
                lineId: line[1],
                lineTitanCode: line[0].substring(0, line[1].length + 1),
                direction: line[2],
                lineName: line[5],
                url: '/line/' + line[0].substring(0, line[1].length + 1)
            });

        });

        callback(formattedLines);
    });
};

exports.getCheckpointData = function (titan_code, callback) {

    Stop.getAllData(function (dataAllStops) {
        Checkpoint.getDataByTitanCode(titan_code, function (dataStops) {

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
                            lineId: dataManipulator.getLineIdFromTitanCode(stop[1]),
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
                lineId: dataManipulator.getLineIdFromTitanCode(alert[4]),
                titanCode: alert[4],
                stopName: alert[6],
                message: alert[7],
                updated_at: moment(alert[9]).format('ll'),
                idAccordion: 'collapse-' + i,
                targetIdAccordion: '#collapse-' + i,
                url: "/alerts/" + alert[0],
                realtime_url: "/line/" + alert[4]
            });
        });

        callback(formattedAlerts);
    });
};

exports.getAlertTrafficDataById = function(id, callback) {

    TrafficAlert.getbyId(id, function(data) {

        console.log(data);

        try {

            var alerts = JSON.parse(data);
            alerts = alerts.values;
            var alert = alerts[0];

            var formattedAlert = {
                key: uuid.v4(),
                type: alert[1],
                start: moment(alert[2]).format('ll'),
                end: moment(alert[3]).format('ll'),
                lineId: dataManipulator.getLineIdFromTitanCode(alert[4]),
                titanCode: alert[4],
                stopName: alert[6],
                message: alert[7],
                updated_at: moment(alert[9]).format('ll'),
                url: "/alerts/" + alert[0],
                realtime_url: "/line/" + alert[4]
            };

            callback(formattedAlert);

        }
        catch(Exception) {
            callback(null);
        }

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
                stopId: stop[0],
                stopName: stop[1],
                linkedLines: stop[2],
                ascenseur: stop[4],
                escalator: stop[5]
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

        filteredFormattedStops.forEach(function (filteredFormattedStop) {

            var lines = filteredFormattedStop.linkedLines;
            var allLines = lines.split(",");
            var formattedLines = [];

            var i = 0;

            allLines.forEach(function (aLine) {

                var aLineDetails = aLine.split(":");

                formattedLines.push({
                    titanCode: aLineDetails[0],
                    lineId: dataManipulator.getLineIdFromTitanCode(aLineDetails[0]),
                    direction: aLineDetails[1],
                    key: uuid.v4(),
                    internalKey: i
                });

                i++;
            });

            filteredFormattedStop.formattedLines = formattedLines;
            filteredFormattedStop.url = '/line/' + formattedLines[0].titanCode + '/' + filteredFormattedStop.stopName;
        });

        //Filtering same stops
        var alreadyCheckedStops = [];
        var totallyFilteredStops = [];

        filteredFormattedStops.forEach(function (filteredFormattedStop) {

            var insert = true;

            alreadyCheckedStops.forEach(function (alreadyCheckedStop) {

                if (filteredFormattedStop.formattedLines[0].titanCode == alreadyCheckedStop.formattedLines[0].titanCode
                    && filteredFormattedStop.stopName == alreadyCheckedStop.stopName) {
                    insert = false;
                }
            });

            if (insert) {
                alreadyCheckedStops.push(filteredFormattedStop);
                totallyFilteredStops.push(filteredFormattedStop);
            }
        });

        callback(totallyFilteredStops);

    });
};

exports.getStopCheckpoints = function (titan_code, stop_name, callback) {

    Stop.getAllData(function (dataAllStops) {

        var allStops = JSON.parse(dataAllStops);
        allStops = allStops.values;

        Checkpoint.getDataByTitanCode(titan_code, function (dataStops) {

            //getting all items that matches with our line
            console.log(dataStops);
            var dataStops = JSON.parse(dataStops);
            var stops = dataStops.values;
            var formattedStops = [];

            stops.forEach(function (stop) {

                allStops.forEach(function (stopFromA) {

                    if (stopFromA[1] == stop_name && stopFromA[0] == stop[0]) {

                        formattedStops.push({
                            key: uuid.v4(),
                            stopName: stopFromA[1],
                            lineId: dataManipulator.getLineIdFromTitanCode(stop[1]),
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


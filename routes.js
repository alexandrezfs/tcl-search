var JSX = require('node-jsx').install(),
    React = require('react'),
    Stops = require('./components/Stops.react'),
    Lines = require('./components/Lines.react'),
    NoResult = require('./components/NoResult.react'),
    ApiProblem = require('./components/ApiProblem.react'),
    TrafficAlerts = require('./components/TrafficAlerts.react'),
    Checkpoint = require('./models/Checkpoint'),
    Stop = require('./models/Stop'),
    Line = require('./models/Line'),
    TrafficAlert = require('./models/TrafficAlert'),
    uuid = require('node-uuid'),
    moment = require('moment');

moment.locale('fr');

module.exports = {

    index: function (req, res) {

        TrafficAlert.getData(function (data) {

            console.log(data);

            var alerts = JSON.parse(data);
            alerts = alerts.values;

            var formattedAlerts = [];

            alerts.forEach(function (alert) {

                formattedAlerts.push({
                    key: uuid.v4(),
                    type: alert[1],
                    start: moment(alert[2]).format('ll'),
                    end: moment(alert[3]).format('ll'),
                    lineId: alert[4].substr(0, alert[4].length - 1),
                    stopName: alert[6],
                    message: alert[7],
                    updated_at: moment(alert[9]).format('ll')
                });
            });

            var markup = React.renderComponentToString(
                TrafficAlerts({
                    alerts: formattedAlerts
                })
            );

            res.render('index', {markup: markup});
        });
    },

    linePost: function (req, res) {

        var lineName = req.body.lineName;

        res.redirect('/suggestlines/' + lineName);
    },

    line: function (req, res) {

        var titan_code = req.params.titan_code;
        var lineId = req.params.lineId;
        var titlepage = "Passages de la ligne " + lineId + " - Réseau TCL à LYON - Bus Métro Tram";

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
                                lineId: lineId,
                                lineTitanCode: stop[1],
                                direction: stop[2],
                                type: stop[4],
                                newCheckTime: stop[3],
                                newCheckDateTime: stop[5]
                            });

                        }
                    });
                });

                var markup;

                if (formattedStops.length > 0) {
                    markup = React.renderComponentToString(
                        Stops({
                            stops: formattedStops
                        })
                    );
                }
                else {
                    markup = React.renderComponentToString(
                        ApiProblem()
                    );
                }

                res.render('line', {
                    markup: markup,
                    insearch: true,
                    titlepage: titlepage
                });

            });
        });

    },

    suggestLines: function (req, res) {

        var formattedLines = [];

        var requestedLineName = req.params.lineName;

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

            var markup;

            if (formattedLines.length > 0) {
                markup = React.renderComponentToString(
                    Lines({
                        lines: formattedLines
                    })
                );
            }
            else {
                markup = React.renderComponentToString(
                    NoResult()
                );
            }

            res.render('lines', {
                markup: markup,
                insearch: true,
                titlepage: "Suggestions de recherche: " + requestedLineName + " - Réseau TCL"
            });

        });

    }
};
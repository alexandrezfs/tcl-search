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
    moment = require('moment'),
    dataConverter = require('./dataConverter');

moment.locale('fr');

module.exports = {

    index: function (req, res) {

        dataConverter.getTrafficAlertData(function (formattedAlerts) {

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
        lineName = lineName.toUpperCase();

        res.redirect('/suggestlines/' + lineName);
    },

    line: function (req, res) {

        var titan_code = req.params.titan_code;
        var line_id = req.params.line_id;
        var titlepage = "Passages de la ligne " + line_id + " - Réseau TCL à LYON";

        dataConverter.getCheckpointData(titan_code, line_id, function (formattedStops) {

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
                    titlepage: titlepage,
                    descriptionpage: "Passages en temps réel de la ligne " + line_id + " TCL à LYON - Métro Tram Bus"
                });

        });

    },

    suggestLines: function (req, res) {

        var requestedLineName = req.params.lineName;

        //Getting all potential lines
        dataConverter.getFormattedDataBus(requestedLineName, function (formattedLines) {

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
                titlepage: "Suggestions de recherche: " + requestedLineName + " - Réseau TCL",
                descriptionpage: "Résultats de recherche de la ligne de bus " + requestedLineName + " TCL à LYON"
            });

        });

    }
};
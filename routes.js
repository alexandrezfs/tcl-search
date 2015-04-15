var JSX = require('node-jsx').install(),
    React = require('react'),
    Stops = require('./components/Stops.react'),
    Lines = require('./components/Lines.react'),
    NoResult = require('./components/NoResult.react'),
    ApiProblem = require('./components/ApiProblem.react'),
    TrafficAlerts = require('./components/TrafficAlerts.react'),
    SearchStops = require('./components/SearchStops.react'),
    moment = require('moment'),
    dataConverter = require('./dataConverter'),
    dataManipulator = require('./dataManipulator');

moment.locale('fr');

module.exports = {

    index: function (req, res) {

        res.render('index');
    },

    alerts: function (req, res) {

        dataConverter.getTrafficAlertData(function (formattedAlerts) {

            var markup = React.renderComponentToString(
                TrafficAlerts({
                    alerts: formattedAlerts
                })
            );

            res.render('alerts', {markup: markup});
        });
    },

    linePost: function (req, res) {

        var lineName = req.body.lineName;
        lineName = lineName.toUpperCase();

        res.redirect('/search/line/' + lineName);
    },

    lineStops: function (req, res) {

        var titan_code = req.params.titan_code;

        dataConverter.getCheckpointData(titan_code, function (formattedStops) {

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

            res.render('lineStops', {
                markup: markup,
                insearch: true,
                page_title: "Passages de la ligne " + dataManipulator.getLineIdFromTitanCode(titan_code) + " - Réseau TCL à LYON",
                page_description: "Passages en temps réel de la ligne " + dataManipulator.getLineIdFromTitanCode(titan_code) + " TCL à LYON - Métro Tram Bus"
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

            res.render('busLinesSuggest', {
                markup: markup,
                insearch: true,
                page_title: "Suggestions de recherche: " + requestedLineName + " - Réseau TCL",
                page_description: "Résultats de recherche de la ligne de bus " + requestedLineName + " TCL à LYON"
            });

        });

    },

    suggestStopsPost: function (req, res) {

        var keyword = req.body.keyword;

        res.redirect('/search/stop/' + keyword);
    },

    suggestStops: function (req, res) {

        var keyword = req.params.keyword;

        dataConverter.getStopsByKeyword(keyword, function (formattedStops) {

            var markup;

            if (formattedStops.length > 0) {
                markup = React.renderComponentToString(
                    SearchStops({
                        stops: formattedStops
                    })
                );
            }
            else {
                markup = React.renderComponentToString(
                    NoResult()
                );
            }

            res.render('searchLines', {
                markup: markup,
                insearch: true,
                page_title: "Suggestions de recherche: " + keyword + " - Réseau TCL",
                page_description: "Résultats de recherche de l'arrêt " + keyword + " TCL à LYON"
            })

        });
    },

    lineByStop: function (req, res) {

        var titan_code = req.params.titan_code;
        var stop_name = req.params.stop_name;

        dataConverter.getStopCheckpoints(titan_code, stop_name, function (formattedStops) {

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

            res.render('lineStops', {
                markup: markup,
                insearch: true,
                page_title: "Passages de la ligne " + dataManipulator.getLineIdFromTitanCode(titan_code) + " arrêt " + stop_name + " - Réseau TCL à LYON",
                page_description: "Passages en temps réel de la ligne " + dataManipulator.getLineIdFromTitanCode(titan_code) + " arrêt " + stop_name + " - Métro Tram Bus"
            });

        });
    }
};
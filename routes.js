var JSX = require('node-jsx').install(),
    React = require('react'),
    Stops = require('./components/Stops.react'),
    Lines = require('./components/Lines.react'),
    NoResult = require('./components/NoResult.react'),
    ApiProblem = require('./components/ApiProblem.react'),
    Checkpoint = require('./models/Checkpoint'),
    Stop = require('./models/Stop'),
    Line = require('./models/Line'),
    uuid = require('node-uuid');

module.exports = {

    index: function (req, res) {
        res.render('index');
    },

    linePost: function (req, res) {

        var lineName = req.body.lineName;

        res.redirect('/suggestlines/' + lineName);
    },

    line: function (req, res) {

        var titan_code = req.params.titan_code;
        var lineId = req.params.lineId;

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

                if(formattedStops.length > 0) {
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
                    insearch: true
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

            if(formattedLines.length > 0) {
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
                insearch: true
            });

        });

    }
};
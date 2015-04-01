var JSX = require('node-jsx').install(),
    React = require('react'),
    TclApp = require('./components/TclApp.react'),
    Stops = require('./components/Stops.react'),
    Lines = require('./components/Lines.react'),
    Checkpoint = require('./models/Checkpoint'),
    Line = require('./models/Line'),
    uuid = require('node-uuid'),
    SearchEngine = require('./SearchEngine');

module.exports = {

    index: function (req, res) {

        // Call static model method to get tweets in the db
        Checkpoint.getData(function (data) {

            var markup = React.renderComponentToString(
                TclApp({
                    body: data
                })
            );

            res.render('index', {
                markup: markup // Pass rendered react markup
            });

        });

    },

    linePost: function (req, res) {

        var lineName = req.body.lineName;

        res.redirect('/suggestlines/' + lineName);
    },

    line: function (req, res) {

        var lineName = req.params.lineName;

        Checkpoint.getData(function (data) {

            //getting all items that matches with our line
            var data = JSON.parse(data);
            var stops = data.values;
            var formattedStops = [];

            stops.forEach(function (stop) {

                var lName = stop[1];

                console.log(lName);

                if (lineName.indexOf(lName) > -1 || lName.indexOf(lineName) > -1) {

                    formattedStops.push({
                        key: uuid.v4(),
                        lineName: stop[1],
                        stopName: stop[2],
                        newCheckTime: stop[3],
                        newCheckDateTime: stop[5]
                    });
                }

            });

            var markup = React.renderComponentToString(
                Stops({
                    stops: formattedStops
                })
            );

            res.render('line', {
                markup: markup // Pass rendered react markup
            });

        });

    },

    suggestLines: function (req, res) {

        var formattedLines = [];

        var requestedLineName = req.params.lineName;

        //Getting all potential lines
        Line.getDataBus(function (dataBus) {
            Line.getDataMetro(function (dataMetro) {
                Line.getDataTram(function (dataTram) {

                    var busLines = JSON.parse(dataBus);
                    busLines = busLines.values;
                    var tramLines = JSON.parse(dataTram);
                    tramLines = tramLines.values;
                    var metroLines = JSON.parse(dataMetro);
                    metroLines = metroLines.values;

                    var lines = tramLines.concat(metroLines).concat(busLines);

                    lines.forEach(function (line) {

                        if (SearchEngine.similar_text(line[1], requestedLineName) > 1) {

                            formattedLines.push({
                                key: line[0],
                                lineId: line[1],
                                direction: line[2],
                                lineName: line[5],
                                url: '/line/' + line[1]
                            });
                        }
                    });

                    var markup = React.renderComponentToString(
                        Lines({
                            lines: formattedLines
                        })
                    );

                    res.render('lines', {
                        markup: markup // Pass rendered react markup
                    });

                });
            });
        });
    }
};
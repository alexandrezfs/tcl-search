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
        Line.getDataBus(function (data) {

            var busLines = JSON.parse(data);
            busLines = busLines.values;

            busLines.forEach(function (busLine) {

                if (SearchEngine.similar_text(busLine[1], requestedLineName) > 1) {

                    formattedLines.push({
                        key: busLine[0],
                        lineId: busLine[1],
                        direction: busLine[2],
                        lineName: busLine[5]
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
    }
};
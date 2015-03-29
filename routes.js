var JSX = require('node-jsx').install(),
    React = require('react'),
    TclApp = require('./components/TclApp.react'),
    Stops = require('./components/Stops.react'),
    Checkpoint = require('./models/Checkpoint'),
    uuid = require('node-uuid');

module.exports = {

    index: function(req, res) {

        // Call static model method to get tweets in the db
        Checkpoint.getData(function(data) {

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

    linePost: function(req, res) {

        var lineName = req.body.lineName;

        res.redirect('/line/' + lineName);
    },

    line: function(req, res) {

        var lineName = req.params.lineName;

        Checkpoint.getData(function(data) {

            //getting all items that matches with our line
            var data = JSON.parse(data);
            var stops = data.values;
            var formattedStops = [];

            stops.forEach(function(stop) {

                var lName = stop[1];

                console.log(lName);

                if(lineName.indexOf(lName) > -1 || lName.indexOf(lineName) > -1) {

                    console.log("PASSED");

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

    suggestLines: function(req, res) {

        //Getting all potential lines


    }

};
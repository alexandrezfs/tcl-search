var JSX = require('node-jsx').install(),
    React = require('react'),
    //TweetsApp = require('./components/TweetsApp.react'),
    //Tweet = require('./models/Tweet');
    TclApp = require('./components/TclApp.react'),
    Checkpoint = require('./models/Checkpoint');

module.exports = {

    index: function(req, res) {
        // Call static model method to get tweets in the db

        /*
        Tweet.getTweets(0, 0, function (tweets, pages) {

            // Render React to a string, passing in our fetched tweets
            var markup = React.renderComponentToString(
                TweetsApp({
                    tweets: tweets
                })
            );

            // Render our 'home' template
            res.render('home', {
                markup: markup, // Pass rendered react markup
                state: JSON.stringify(tweets) // Pass current state to client side
            });

        });
        */

        Checkpoint.getData(function(data) {

            var markup = React.renderComponentToString(
                TclApp({
                    body: data
                })
            );

            res.render('home', {
                markup: markup // Pass rendered react markup
            });

        });

    }

};
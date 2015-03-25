/** @jsx React.DOM */

var React = require('react');
var Stop = require('../components/Stop.react');

module.exports = Stops = React.createClass({
    // Render the component
    render: function () {

        // Build list items of single tweet components using map
        var content = this.props.stops.map(function (stop) {

            console.log(stop);

            return (
                <Stop key={stop.key} stop={stop} />
            )
        });

        // Return ul filled with our mapped tweets
        return (
            <ul className="stops">{content}</ul>
        )

    }
});
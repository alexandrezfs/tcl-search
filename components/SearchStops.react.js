/** @jsx React.DOM */

var React = require('react');
var SearchStop = require('../components/SearchStop.react');

module.exports = SearchStops = React.createClass({
    // Render the component
    render: function () {

        var content = this.props.stops.map(function (stop) {

            return (
                <SearchStop key={stop.key} stop={stop} />
            )
        });

        return (
            <div>
                <h3>Séléctionnez un arrêt</h3>
                <div className="list-group">{content}</div>
            </div>
        )

    }
});
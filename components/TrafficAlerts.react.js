/** @jsx React.DOM */

var React = require('react');
var TrafficAlert = require('../components/TrafficAlert.react');

module.exports = TrafficAlerts = React.createClass({
    // Render the component
    render: function () {

        // Build list items of single tweet components using map
        var content = this.props.alerts.map(function (alert) {

            return (
                <TrafficAlert key={alert.key} alert={alert} />
            )
        });

        // Return ul filled with our mapped tweets
        return (
            <div className="row">
                <h3>Alertes traffic</h3>
                <div className="panel-group" id="accordion">{content}</div>
            </div>
        )

    }
});
/** @jsx React.DOM */

var React = require('react');
var TrafficAlert = require('../components/TrafficAlert.react');

module.exports = TrafficAlerts = React.createClass({
    // Render the component
    render: function () {

        var content = this.props.alerts.map(function (alert) {

            return (
                <TrafficAlert key={alert.key} alert={alert} />
            )
        });

        return (
            <div className="row">
                <h3>Alertes traffic</h3>
                <div className="panel-group" id="accordion">{content}</div>
            </div>
        )

    }
});
/** @jsx React.DOM */

var React = require('react');

module.exports = TrafficAlert = React.createClass({
    // Render the component
    render: function () {

        var alert = this.props.alert;

        return (
            <li className="list-group-item">
                <h4 className="list-group-item-heading"><i className="fa fa-bell"></i> {alert.type} - {alert.stopName}</h4>
                <p className="list-group-item-text">
                    <p><span className="label label-primary">Ligne {alert.lineId}</span> <span className="label label-success">Publié le {alert.updated_at}</span> <span className="label label-warning">Début {alert.start}</span> <span className="label label-info">Fin {alert.end}</span></p>
                    <p>{alert.message}</p>
                </p>
            </li>
        )

    }
});
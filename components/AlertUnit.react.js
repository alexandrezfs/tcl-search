/** @jsx React.DOM */

var React = require('react');

module.exports = Line = React.createClass({
    // Render the component
    render: function () {

        var alert = this.props.alert;

        return (
            <article>
                <h1>{alert.type} - {alert.stopName}</h1>
                <p>
                    <span className="label label-primary">Ligne {alert.lineId}</span>
                </p>
                <p>
                    {alert.message}
                </p>
                <p>
                    <ul>
                        <li><a href={alert.realtime_url} title="Passages temps réel">Voir les passages temps réel pour cette ligne</a></li>
                        <li><a href="/alerts" title="Alertes traffic">Retour aux alertes traffic</a></li>
                    </ul>
                </p>
            </article>
        )

    }
});
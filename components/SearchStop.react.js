/** @jsx React.DOM */

var React = require('react');
var LinesBand = require('../components/LinesBand.react');

module.exports = Line = React.createClass({
    // Render the component
    render: function () {

        var stop = this.props.stop;

        return (
            <a href={stop.url} className="list-group-item">
                <h4 className="list-group-item-heading"><i className="fa fa-arrow-circle-down"></i> {stop.stopName}</h4>
                <LinesBand lines={stop.formattedLines} />
                <p>
                    <span className="label label-success">Escalator</span> <span className="label label-success">{stop.escalator == "True" ? 'Oui' : 'Non'}</span> <span className="label label-warning">Ascenseur</span> <span className="label label-warning">{stop.ascenseur == "True" ? 'Oui' : 'Non'}</span>
                </p>
            </a>
        )

    }
});
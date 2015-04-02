/** @jsx React.DOM */

var React = require('react');

module.exports = Line = React.createClass({
    // Render the component
    render: function () {

        var line = this.props.line;

        return (
            <a href={line.url} className="list-group-item">
                <h4 className="list-group-item-heading"><i className="fa fa-bus"></i> {line.lineId}</h4>
                <p className="list-group-item-text">{line.lineName}</p>
            </a>
        )

    }
});
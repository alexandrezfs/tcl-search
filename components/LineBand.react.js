/** @jsx React.DOM */

var React = require('react');

module.exports = LineBand = React.createClass({
    // Render the component
    render: function () {

        var line = this.props.line;

        return (
            <span className="label label-danger">{line.code}</span>
        )

    }
});
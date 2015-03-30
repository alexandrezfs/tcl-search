/** @jsx React.DOM */

var React = require('react');

module.exports = Line = React.createClass({
    // Render the component
    render: function () {

        var line = this.props.line;

        return (
            <li>
                <blockquote>
                    <span className="content">{line.lineId}</span>
                    <span className="content">{line.lineName}</span>
                    <span className="content">{line.direction}</span>
                </blockquote>
            </li>
        )

    }
});
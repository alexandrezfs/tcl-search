/** @jsx React.DOM */

var React = require('react');

module.exports = Stop = React.createClass({
    // Render the component
    render: function () {

        var stop = this.props.stop;

        return (
            <li>
                <blockquote>
                    <span className="content">{stop.stopName}</span>
                </blockquote>
            </li>
        )

    }
});
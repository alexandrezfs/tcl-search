/** @jsx React.DOM */

var React = require('react');
var LineBand = require('../components/LineBand.react');

module.exports = LinesBand = React.createClass({
    // Render the component
    render: function () {

        var content = this.props.lines.map(function (line) {

            console.log(line);

            return (
                <LineBand key={line.key} line={line} />
            )
        });

        return (
            <p>
                {content}
            </p>
        )

    }
});
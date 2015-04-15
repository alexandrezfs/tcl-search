/** @jsx React.DOM */

var React = require('react');
require('react/addons');

module.exports = LineBand = React.createClass({
    // Render the component
    render: function () {

        var line = this.props.line;

        var cx = React.addons.classSet;
        var classes = {};

        if (line.internalKey == 0) {
            classes['label'] = true;
            classes['label-danger'] = true;
        }
        else {
            classes['label'] = true;
            classes['label-default'] = true;
            classes['label-margin-left'] = true;
            classes['pull-right'] = true;
            classes['hidden'] = true; //temporary hidden
        }

        var lineNameClasses = cx(classes);

        return (
            <span className={lineNameClasses}>{line.lineId}</span>
        )

    }
});
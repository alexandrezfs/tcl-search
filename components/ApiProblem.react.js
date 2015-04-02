/** @jsx React.DOM */

var React = require('react');

module.exports = Stop = React.createClass({
    // Render the component
    render: function () {

        return (
            <div className="row">
                <h1>Oops...</h1>
                <p>TCL ne met pas à disposition les horaires temps réel pour cette ligne. Vous ne pouvez obtenir que les horaires théoriques sur <a href="http://www.tcl.fr">le site TCL</a>.</p>
            </div>
        )

    }
});
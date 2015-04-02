/** @jsx React.DOM */

var React = require('react');

module.exports = Stop = React.createClass({
    // Render the component
    render: function () {

        return (
            <div className="row">
                <h1>Oops...</h1>
                <p>TCL ne met actuellement pas à disposition les horaires temps réel pour cette ligne. Vous ne pouvez obtenir que les horaires théoriques sur <a href="http://www.tcl.fr">le site TCL</a>.</p>
                <p>Notez qu'en soirée ou de nuit, les horaires en temps réel ne sont plus disponibles sur certaines lignes journalières.</p>
            </div>
        )

    }
});
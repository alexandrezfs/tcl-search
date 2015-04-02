/** @jsx React.DOM */

var React = require('react');
var Stop = require('../components/Stop.react');

module.exports = Stops = React.createClass({
    // Render the component
    render: function () {

        var go = [];
        var back = [];

        var stops = this.props.stops;

        //Dispatch the stops array to go and back arrays
        var bufferGo,
            bufferBack,
            lineId;

        for(var i = 0; i < stops.length; i++) {
            var stop = stops[i];

            if(i == 0) {
                bufferGo = stop.direction;
            }

            if(stop.direction == bufferGo) {
                go.push(stop);
            }
            else {
                back.push(stop);
                bufferBack = stop.direction;
            }

            lineId = stop.lineId;
        }

        go.sort(function(a, b){
            if(a.stopName < b.stopName) return -1;
            if(a.stopName > b.stopName) return 1;
            return 0;
        });

        back.sort(function(a, b){
            if(a.stopName < b.stopName) return -1;
            if(a.stopName > b.stopName) return 1;
            return 0;
        });

        // Build list items of single tweet components using map
        var contentGo = go.map(function (stop) {
            return (
                <Stop key={stop.key} stop={stop} />
            )
        });

        var contentBack = back.map(function (stop) {
            return (
                <Stop key={stop.key} stop={stop} />
            )
        });

        // Return ul filled with our mapped tweets
        return (
            <div class="row">
                <h1><i className="fa fa-exchange"></i> Ligne {lineId}</h1>
                <div className="list-group col-md-6"><h3><i className="fa fa-compass"></i> Direction: {bufferGo}</h3>{contentGo}</div>
                <div className="list-group col-md-6"><h3><i className="fa fa-compass"></i> Direction: {bufferBack}</h3>{contentBack}</div>
            </div>
        )

    }
});
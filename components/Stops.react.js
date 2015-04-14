/** @jsx React.DOM */

var React = require('react');
var Stop = require('../components/Stop.react');
var moment = require('moment');

function convertStopsWithNextStop(stops) {

    var newStops = [];

    //Looking for second stops...
    var secondStop = {};
    var alreadyCheckedStops = [];

    for(var keyFirst in stops) {

        var sF = stops[keyFirst];

        if(alreadyCheckedStops.indexOf(sF.stopName) == -1) {

            //Looking for the second stop
            for(var keySecond in stops) {
                var sS = stops[keySecond];
                if(sS.stopName == sF.stopName && keySecond != keyFirst && sS.newCheckTime != sF.newCheckTime) {

                    if(moment(sS.newCheckDateTime).toDate().getTime() > moment(sF.newCheckDateTime).toDate().getTime()) {
                        sF.nextStop = sS;
                        alreadyCheckedStops.push(sF.stopName);
                        newStops.push(sF);
                    }
                    else {
                        sS.nextStop = sF;
                        alreadyCheckedStops.push(sS.stopName);
                        newStops.push(sS);
                    }
                }
            }
        }
    }

    //Assign something to those don't have a next stop
    for(var key in newStops) {

        var stop = newStops[key];

        var nextStop = {};

        if(!stop.nextStop) {
            nextStop.newCheckTime = "-";
            stop.nextStop = nextStop;
        }

        newStops[key] = stop;
    }

    newStops.sort(function(a, b){
        if(a.stopName < b.stopName) return -1;
        if(a.stopName > b.stopName) return 1;
        return 0;
    });

    return newStops;
}

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

        var go = convertStopsWithNextStop(go);
        var back = convertStopsWithNextStop(back);

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

        return (
            <div className="row">
                <h1><i className="fa fa-exchange"></i> Ligne {lineId}</h1>
                <div className="list-group col-md-6"><h3><i className="fa fa-compass"></i> Direction: {bufferGo}</h3>{contentGo}</div>
                <div className="list-group col-md-6"><h3><i className="fa fa-compass"></i> Direction: {bufferBack}</h3>{contentBack}</div>
            </div>
        )

    }
});
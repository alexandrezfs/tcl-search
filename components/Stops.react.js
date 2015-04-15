/** @jsx React.DOM */

var React = require('react');
var Stop = require('../components/Stop.react');
var moment = require('moment');
require('react/addons');

function convertStopsWithNextStop(stops) {

    var newStops = [];

    //Looking for second stops...
    var secondStop = {};
    var alreadyCheckedStops = [];

    for (var keyFirst in stops) {

        var sF = stops[keyFirst];

        var alreadyChecked = false;
        alreadyCheckedStops.forEach(function(alreadyCheckedStop) {
            if(alreadyCheckedStop.direction == sF.direction && alreadyCheckedStop.stopName == sF.stopName) {
                alreadyChecked = true;
            }
        });

        if (!alreadyChecked) {

            var assignedSs = false;

            //Looking for the second stop
            for (var keySecond in stops) {

                var sS = stops[keySecond];

                if (sS.direction == sF.direction && sS.stopName == sF.stopName && keySecond != keyFirst && sS.newCheckTime != sF.newCheckTime) {

                    if (moment(sS.newCheckDateTime).toDate().getTime() > moment(sF.newCheckDateTime).toDate().getTime()) {
                        sF.nextStop = sS;
                        alreadyCheckedStops.push(sF);
                        newStops.push(sF);
                    }
                    else {
                        sS.nextStop = sF;
                        alreadyCheckedStops.push(sS);
                        newStops.push(sS);
                    }

                    assignedSs = true;
                }
            }

            //The step could not be pushed because no second step has been detected...
            if (!assignedSs) {
                newStops.push(sF); //So push it.
            }
        }
    }

    //Assign something to those don't have a next stop
    for (var key in newStops) {

        var stop = newStops[key];

        var nextStop = {};

        if (!stop.nextStop) {
            nextStop.newCheckTime = "-";
            stop.nextStop = nextStop;
        }

        newStops[key] = stop;
    }

    newStops.sort(function (a, b) {
        if (a.stopName < b.stopName) return -1;
        if (a.stopName > b.stopName) return 1;
        return 0;
    });

    return newStops;
}

function getTerminalCount(stops) {

    var terminals = [];

    for (var i = 0; i < stops.length; i++) {

        var stop = stops[i];

        if (terminals.indexOf(stop.direction) == -1) {
            terminals.push(stop.direction);
        }
    }

    return terminals.length;
}

module.exports = Stops = React.createClass({
    // Render the component
    render: function () {

        var stops = this.props.stops;

        //Determine if it's a go/back line or a mess line with multiple terminals.

        var go = [];
        var back = [];

        //Dispatch the stops array to go and back arrays
        var bufferGo,
            bufferBack,
            lineId,
            terminalCount = getTerminalCount(stops);

        for (var i = 0; i < stops.length; i++) {

            var stop = stops[i];

            if (terminalCount == 2) {

                if (i == 0) {
                    bufferGo = stop.direction;
                }

                if (stop.direction == bufferGo) {
                    go.push(stop);
                }
                else {
                    back.push(stop);
                    bufferBack = stop.direction;
                }

                lineId = stop.lineId;
            }
            else {
                //Push everything into go array if there are multiple terminals
                go.push(stop);
                lineId = stop.lineId;
            }
        }

        var go = convertStopsWithNextStop(go);
        var back = convertStopsWithNextStop(back);

        var contentGo = go.map(function (stop) {
            return (
                <Stop key={stop.key} stop={stop}/>
            )
        });

        var contentBack = back.map(function (stop) {
            return (
                <Stop key={stop.key} stop={stop}/>
            )
        });

        var cx = React.addons.classSet;

        //Back list classes
        var classes = {};

        if (back.length == 0) {
            classes['hidden'] = true; //temporary hidden
        }
        else {
            classes['list-group'] = true;
            classes['col-md-6'] = true;
        }

        var contentBackClasses = cx(classes);


        //Go list classes
        classes = {};

        if (back.length == 0) {
            classes['list-group'] = true;
            classes['col-md-12'] = true;
        }
        else {
            classes['list-group'] = true;
            classes['col-md-6'] = true;
        }

        var contentGoClasses = cx(classes);


        //goDirection title classes
        classes = {};

        if (back.length == 0) {
            classes['hidden'] = true;
        }

        if(terminalCount > 2) {
            classes['hidden'] = true;
        }

        var goDirectionClasses = cx(classes);


        return (
            <div className="row">
                <h1><i className="fa fa-exchange"></i> Ligne {lineId}</h1>
                <div className={contentGoClasses}><h3 className={goDirectionClasses}><i className="fa fa-compass"></i> Direction: {bufferGo}</h3>{contentGo}</div>
                <div className={contentBackClasses}><h3><i className="fa fa-compass"></i> Direction: {bufferBack}</h3>{contentBack}</div>
            </div>
        )

    }
});
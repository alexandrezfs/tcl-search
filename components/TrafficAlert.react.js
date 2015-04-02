/** @jsx React.DOM */

var React = require('react');
require('react/addons');

module.exports = TrafficAlert = React.createClass({
    // Render the component
    render: function () {

        var alert = this.props.alert;

        var cx = React.addons.classSet;
        var classes = {
            'collapse': true,
            'panel-collapse': true,
            'in': false
        };


        if (alert.idAccordion == 'collapse-1') {
            classes.in = true;
        }

        var panelAccordionClasses = cx(classes);

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">
                        <a className="accordion-toggle" data-toggle="collapse" data-parent="#accordion"
                           href={alert.targetIdAccordion}>
                            <i className="fa fa-bell"></i> {alert.type} - {alert.stopName}
                        </a><i className="indicator glyphicon glyphicon-chevron-up pull-right"></i>
                    </h4>
                </div>
                <div id={alert.idAccordion} className={panelAccordionClasses}>
                    <div className="panel-body">
                        <p className="list-group-item-text">
                            <p>
                                <span className="label label-primary">Ligne {alert.lineId}</span>
                            </p>

                            <p>{alert.message}</p>
                        </p>
                    </div>
                </div>
            </div>
        )

    }
});
import React from 'react';

import Highcharts from 'react-highcharts';
import chartConfig from '../../highcharts';

import styles from './styles';

chartConfig.chart.type = 'spline';
chartConfig.chart.animation = { duration: 100, easing: 'linear' };
chartConfig.chart.zoomType = 'x';
chartConfig.title.text = 'Live Reflow Temperature Data';
chartConfig.xAxis.title = {
    text: 'time (s)',
    style: {
        'fontSize': '1rem'
    },
    y: 20
};
chartConfig.yAxis.title = {
    text: 'temperature (C)',
    style: {
        'fontSize': '1rem'
    }
};
chartConfig.legend.x = 30;
chartConfig.tooltip = { shared: true, crosshairs: true };
chartConfig.plotOptions = {
    spline: {
        animation: false
    }
};
chartConfig.credits = { enabled: false };
chartConfig.series = [{
    name: 'Live Data',
    data: []
}];

class LiveHighchart extends React.Component {
    constructor(props) {
        super(props);
        this.addPoint = this.addPoint.bind(this);

    }

    componentWillMount() {
        if(this.props.profile) {
            chartConfig.series.push(this.props.profile);
        } else {
            let emptyProfile = {
                name: '',
                data: []
            }
            chartConfig.series.push(emptyProfile);
        }
    }

    shouldComponentUpdate(newProps) {
        return this.props.profile != newProps.profile;
    }

    render() {
        if(this.props.profile) {
            chartConfig.series[1] = this.props.profile;

            return (
                <div style={styles.chartWrapper}>
                    <Highcharts ref='chart' config={chartConfig} style={styles.highChart}></Highcharts>
                </div>
            );
        } else {
            return (
                <div style={styles.chartWrapper}>
                    Chart is loading!
                </div>
            );
        }
    }

    addPoint(point) {
        let chart = this.refs.chart.getChart();
        chart.series[0].addPoint(point);
    }
}

export default LiveHighchart;

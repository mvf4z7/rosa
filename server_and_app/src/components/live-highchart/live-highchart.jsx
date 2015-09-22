import React from 'react';

import Highcharts from 'react-highcharts';
import chartConfig from '../../highcharts';

import styles from './styles';

chartConfig.chart.type = 'spline';
chartConfig.chart.animation = { duration: 250, easing: 'linear' };
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
}, {
    name: 'Pb-free',
    data: [[0, 25], [42, 150], [110, 220], [134, 260], [143, 260], [202, 150], [240, 25]]
}];

class LiveHighchart extends React.Component {
    constructor(props) {
        super(props);
        this.addPoint = this.addPoint.bind(this);
    }

    render() {
        return (
            <div style={styles.chartWrapper}>
                <Highcharts style={styles.highChart} ref='chart' config={chartConfig}></Highcharts>
            </div>
        );
    }

    addPoint(data) {
        let chart = this.refs.chart.getChart();
        chart.series[0].addPoint(data);
    }

    _tempDataCb(data) {
        let chart = this.refs.chart.getChart();
        chart.series[0].addPoint(data.temp);
    }
}

LiveHighchart.contextTypes = {
    socket: React.PropTypes.object,
};

export default LiveHighchart;

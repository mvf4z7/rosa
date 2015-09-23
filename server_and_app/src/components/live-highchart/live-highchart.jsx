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

    addPoint(point) {
        let chart = this.refs.chart.getChart();
        chart.series[0].addPoint(point);
    }
}

LiveHighchart.contextTypes = {
    socket: React.PropTypes.object,
};

export default LiveHighchart;

import React from 'react';

import Highcharts from 'react-highcharts';

import styles from './styles';

let config = {
    chart: {
        type: 'spline',
        animation: {
            duration: 250,
            easing: 'linear'
        }
    },
    plotOptions: {
        spline: {
            animation: false
        }
    },

  series: [{
    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
  }]
};

class LiveHighChart extends React.Component {
    constructor(props) {
        super(props);

        this._tempDataCb = this._tempDataCb.bind(this);
    }

    componentDidMount() {
        this.context.socket.on('tempData', this._tempDataCb);
    }

    render() {
        return (
            <div style={styles.chartWrapper}>
                <Highcharts ref='chart' config={config}></Highcharts>
            </div>
        );
    }

    _tempDataCb(data) {
        let chart = this.refs.chart.getChart();
        chart.series[0].addPoint(data.temp);
    }
}

LiveHighChart.contextTypes = {
    socket: React.PropTypes.object,
};

export default LiveHighChart;

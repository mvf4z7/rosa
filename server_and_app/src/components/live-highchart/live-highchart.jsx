import React from 'react';
import Radium from 'radium';
import * as _ from 'lodash';
import globalChartConfig from '../../highcharts';

import Highcharts from 'react-highcharts';
import Spinner from '../spinner/spinner';

import styles from './styles';
require('./styles.scss');

// Create copy of globalChartConfig
var chartConfig = _.clone(globalChartConfig, true);

var overRides = {
    chart: {
        animation: {
            duration: 100,
            easing: 'linear'
        },
        zoomType: 'x'
    },
    title: { text: 'Live Temperature Data' },
    xAxis: {
        title: {
            text: 'time (s)',
            style: { 'fontSize': '1rem' },
            y: 20
        }
    },
    yAxis: {
        title: {
            text: 'temperature (C)',
            style: { 'fontSize': '1rem' }
        }
    },
    legend: { x: 30 },
    toolTip: {
        shared: true,
        crosshairs: true
    },
    plotOptions: {
        line: { animation: false }
    },
    credits: { enabled: false },
    series: [{
        name: '',
        data: []
    }, {
        name: 'Live Data',
        data: []
    }]
}

chartConfig = _.merge(chartConfig, overRides);

class LiveHighchart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.context.socket.on('tempData', this._socketOnTempData);
    }

    shouldComponentUpdate(newProps) {
        let newProfile = this.props.profile != newProps.profile;
        let clearedLiveData = this.props.liveData.length === 0;
        return newProfile || clearedLiveData;
    }

    componentWillUnmount() {
        chartConfig.series[1].data = [];

        this.context.socket.removeListener('tempData', this._socketOnTempData);
    }

    render() {
        if(this.props.loading) {
            return ( <Spinner /> );
        }

        chartConfig.series[0] = {
            name: this.props.profile.name,
            data: this.props.profile.points
        }
        chartConfig.series[1].data = this.props.liveData;
        return (
            <div style={styles.chartWrapper}>
                <Highcharts ref='chart' config={chartConfig} style={styles.highChart}></Highcharts>
            </div>
        );
    }

    addPoint = (point) => {
        let chart = this.refs.chart.getChart();
        chart.series[1].addPoint(point);
    }

    clearLiveData = () => {
        let chart = this.refs.chart.getChart();
        chart.series[1].setData([]);
    }

    updateLiveData = (data) => {
        if(this.props.loading) {
            console.log('unable to update liveData while chart is loading!');
            return;
        }

        let chart = this.refs.chart.getChart();
        chart.series[1].setData(data);
    }

    _socketOnTempData  = (data) => {
        if(this.props.loading) {
            return;
        }

        let subTitle = {
            useHTML: true,
            text: `<pre class='chart-title'>Target: <span class='target'>${data.target}</span>    Actual: <span class='actual'>${data.temp}</span></pre>`,
            align: 'right',
        }
        let chart = this.refs.chart.getChart();
        chart.setTitle(chartConfig.title, subTitle);
    };
}

LiveHighchart.contextTypes = {
    socket: React.PropTypes.object
};

export default Radium(LiveHighchart);

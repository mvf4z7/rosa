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
        type: 'line',
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

    printData = () => {
        let chart = this.refs.chart.getChart();
        // console.log('%s profile: %s', this.props.profile.name, chart.series[0].data);
        // console.log('liveData: ', chart.series[1].data);
        let targetLines = pointsToLines(this.props.profile.points);
        let calculatedTargetTemps = [];
        let measuredTemps = [];
        let times = [];

        chart.series[1].data.forEach( point => {
            let time = point.x;
            let measuredTemp = point.y;
            let calculatedTargetTemp = getTemp(targetLines, time);

            calculatedTargetTemps.push(calculatedTargetTemp);
            measuredTemps.push(measuredTemp);
            times.push(time);
        });

        let resultStr = 'time, target, actual\n';
        times.forEach( (time, idx) => {
            resultStr += `${time}, ${Math.round(calculatedTargetTemps[idx])}, ${measuredTemps[idx]}\n`
            //console.log('%s, %s, %s', time, calculatedTargetTemps[idx], measuredTemps[idx]);
        });

        console.log(resultStr);

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

function pointsToLines(points) {
    let lines = [];
    for(let i = 0; i < points.length-1; i++) {
        let line = {};

        line.start = { x: points[i][0], y: points[i][1] };
        line.stop = { x: points[i+1][0], y: points[i+1][1] };

        let deltaY = line.stop.y - line.start.y;
        let deltaX = line.stop.x - line.start.x;
        line.m = deltaY/deltaX;

        line.b = calculateIntercept(line.start, line.m);

        lines.push(line);
    }

    return lines;
}

var getTemp = function(lines, time) {
    var line = getLine(lines, time);
    var temp = line.m * time + line.b;
    return temp;
};

function calculateIntercept(point, slope) {
    return point.y - (slope * point.x);
}

var getLine = function(lines, time) {
    var line = null;
    for(var i = 0; i < lines.length; i++) {
        var tempLine = lines[i];
        if(time >= tempLine.start.x && time <= tempLine.stop.x) {
            line = tempLine;
            break;
        }
    }

    return line;
};

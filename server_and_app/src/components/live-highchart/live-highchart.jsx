import React from 'react';
import Highcharts from 'react-highcharts';
import Radium from 'radium';
import chartConfig from '../../highcharts';


import styles from './styles';
require('./style.scss');

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
    name: '',
    data: []
    }, {
    name: 'Live Data',
    data: []
}];

class LiveHighchart extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(newProps) {
        return this.props.profile != newProps.profile;
    }

    render() {
        if(this.props.loading) {
            return(
                <div style={styles.spinnerWrapper}>
                    <i className='fa fa-spinner fa-pulse fa-4x'></i>
                </div>
            );
        }

        chartConfig.series[0] = {
            name: this.props.profile.name,
            data: this.props.profile.points
        }
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
}

export default Radium(LiveHighchart);

let rStyles = {
    spinnerWrapper:{
        position: 'relative',
        height: '70%',
        width: '100%',
        color: 'red'
    },
    spinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
};

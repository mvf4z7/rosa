import React from 'react';
import Radium from 'radium';
import * as _ from 'lodash';
import globalChartConfig from '../../highcharts';

import Highcharts from 'react-highcharts';
import Spinner from '../spinner/spinner';

// Had to deep copy config otherwise changes to the global config
// were affecting the settings of other charts that imported
// the global config file.
var chartConfig = _.clone(globalChartConfig, true);

var overRides = {
    chart: {
        animation: {
            duration: 100,
            easing: 'linear'
        },
        zoomType: 'x'
    },
    title: {
        text: ''
    },
    xAxis: {
        title: {
            text: 'time (s)',
            style: { 'fontSize': '1rem' },
            y: 20
        },
        min: 0
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
    }]
}

chartConfig = _.merge(chartConfig, overRides);

class CreateEditHighchart extends React.Component {
    render() {
        if(this.props.loading) {
            return ( <Spinner /> );
        }

        chartConfig.series[0].name = this.props.profileName === '' ? 'Enter Profile Name' : this.props.profileName;
        chartConfig.series[0].data = this.props.data ? this.props.data : [];

        return(
            <div id='createchartwrapper' style={styles.chartWrapper}>
                <Highcharts ref='chart' config={chartConfig} style={styles.highChart}></Highcharts>
            </div>
        );
    }

}

let styles = {
    chartWrapper: {
        height: '40vh',
        '@media screen and (min-width: 48em)': {
            height: '55vh'
        }
    },
    highChart: {
        height: '100%'
    }
};

export default Radium(CreateEditHighchart);

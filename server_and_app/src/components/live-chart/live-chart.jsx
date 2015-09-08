import React from 'react';
import Chart from 'chart.js';
import styles from './styles';

var chartData = {
    labels: [],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: []
        }
    ]
};

class LiveChart extends React.Component {
    constructor(props) {
        super(props);
        this._tempDataCb = this._tempDataCb.bind(this);
        this.state = { chart: null};
    }

    componentDidMount() {
        var el = React.findDOMNode(this.refs.chart);
        var ctx = el.getContext('2d');
        var chart = new Chart(ctx).Line(chartData, {
            responsive: true,
            animationSteps: 10,
            maintainAspectRation: false
        });
        this.setState({ chart: chart });
        this.context.socket.on('tempData', this._tempDataCb);
    }

    render() {
        return (
            <div>
                <h1>Im a chart component!</h1>
                <canvas ref='chart' width='400' height='400'></canvas>
            </div>
        );
    }

    _tempDataCb(data) {
        console.log('inside callback: ', data)
        this.state.chart.addData([data.temp, data.temp + 3], data.time);
    }
}

LiveChart.contextTypes = {
    socket: React.PropTypes.object,
};

export default LiveChart;

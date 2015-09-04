import React from 'react';
import Chart from 'chart.js';
import styles from './styles';

var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

class LiveChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = { chart: null};
    }

    componentDidMount() {
        var el = React.findDOMNode(this.refs.chart);
        var ctx = el.getContext('2d');
        var chart = new Chart(ctx).Line(data);
        this.setState({ chart: chart });
    }

    render() {
        return (
            <div>
                <h1>Im a chart component!</h1>
                <canvas ref='chart' width='400' height='400'></canvas>
            </div>
        );
    }
}

export default LiveChart;

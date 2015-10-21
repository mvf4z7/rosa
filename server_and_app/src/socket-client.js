import io from 'socket.io-client';
import LiveChartActions from './actions/LiveChartActions';
import OvenActions from './actions/OvenActions';

let socket = io();

socket.on('connect', function() {
    console.log('socket connection made: ', socket.id);
});

socket.on('tempData', function(data) {
    LiveChartActions.updateLiveData([data.time, data.temp]);
});

socket.on('oven_start', function() {
    LiveChartActions.clearLiveData();
    OvenActions.setOvenOn({ ovenOn: true });
});

socket.on('oven_stop', function() {
    OvenActions.setOvenOn({ ovenOn: false });
});

socket.on('jon_test', function(data) {
    console.log('data: ', data);
});

export default socket;

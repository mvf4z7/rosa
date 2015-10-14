import io from 'socket.io-client';
import LiveChartActions from './actions/LiveChartActions';
import OvenActions from './actions/OvenActions';

let socket = io();

socket.on('connect', function() {
    console.log('socket connection made: ', socket.id);
});

socket.on('tempData', function(data) {
    console.log('socket received new temp data: ', data);
    LiveChartActions.updateLiveData([data.time, data.temp]);
});

socket.on('oven_start', function() {
    OvenActions.setOvenOn({ ovenOn: true });
    console.log('set OvenOn to true');
});

socket.on('oven_stop', function() {
    OvenActions.setOvenOn({ ovenOn: false });
})

export default socket;

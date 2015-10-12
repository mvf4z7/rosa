import io from 'socket.io-client';
import LiveChartActions from './actions/LiveChartActions';

let socket = io();

socket.on('connect', function() {
    console.log('socket connection made: ', socket.id);
});

socket.on('tempData', function(data) {
    console.log('socket received new temp data: ', data);
    LiveChartActions.updateLiveData([data.time, data.temp]);
});

export default socket;

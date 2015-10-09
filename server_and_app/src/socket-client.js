import io from 'socket.io-client';
import LiveChartActions from './actions/LiveChartActions';

let socket = io();

socket.on('connect', function() {
    console.log('socket connection made: ', socket.id);
});

// socket.on('tempData', function(data) {
//     console.log('temp data received: ', data);
//     LiveChartActions.addNewData(data);
// });

socket.on('tempData', function(data) {
    LiveChartActions.updateLiveData(data);
})

export default socket;

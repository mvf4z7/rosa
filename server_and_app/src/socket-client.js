import io from 'socket.io-client';
let socket = io();

socket.on('connect', function() {
    alert('socket connection made: ' + socket.id);
    console.log('socket connection made: ', socket.id);
});

socket.on('tempData', function(data) {
    console.log('temp data', data.temp);
});

export default socket;

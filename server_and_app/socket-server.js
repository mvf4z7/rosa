var io = require('socket.io')();

io.on('connection', function(socket) {
    console.log('A user connected: ', socket.id);

    socket.on('hello', function(data) {
        console.log('data from client: ', data.number);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected: ', socket.id);
    });
});

module.exports = io;

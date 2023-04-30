const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // When video is played, send the frames to the client
    socket.on('play', (data) => {
        console.log('Video is playing');
        let canvas1 = data.canvas1;
        let canvas2 = data.canvas2;
        let video = data.video;

        // Draw video frames on canvas 1 and 2
        let context1 = canvas1.getContext('2d');
        let context2 = canvas2.getContext('2d');
        context1.drawImage(video, 0, 0, canvas1.width, canvas1.height);
        context2.drawImage(video, 0, 0, canvas2.width, canvas2.height);

        // Send the canvas data to the client
        let imageData1 = context1.getImageData(0, 0, canvas1.width, canvas1.height).data;
        let imageData2 = context2.getImageData(0, 0, canvas2.width, canvas2.height).data;
        socket.emit('frame', {canvas1: imageData1, canvas2: imageData2});
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
http.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

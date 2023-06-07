import http from 'http';
const port = 9207; // default port to listen on
import { Server } from "socket.io";
const server = http.createServer();
const io = new Server(server);

// Channel Imports
import { ping } from './channels/ping'; 
import { Channel } from './utils/interfaces';
const channels: Channel[] = [ping];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
    // Create channel listeners
    for (let channel of channels) {
        socket.on(channel.name, (args) => {
            channel.execute(socket, args);
        });
    }
});

server.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

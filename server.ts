// import express from 'express';
import { spawn } from 'child_process';
import http from 'http';
// const app = express();
const port = 9207; // default port to listen on
import { ping } from './channels/ping'; 

// add support for multiple responses from the python process using sockets
import { Server } from "socket.io";
const server = http.createServer();
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
    socket.on('ping', (data: number) => {
        ping(socket, data);
    });
});

server.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

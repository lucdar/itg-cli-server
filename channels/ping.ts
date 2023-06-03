import { Channel } from "../utils/interfaces";
import { Socket } from "socket.io";
import { spawn } from 'child_process';

export const ping: Channel = {
    name: 'ping',
    description: 'Responds with pong and the data that was sent',
    args: ['data'],
    execute: (socket: Socket, data: any) => {
        console.log('received ping from client:', data);
        const cli = spawn('python3',["../itg-cli/main.py", 'ping']);
        cli.stdout.on('data', (output: String) => { 
            // 'data' event happens when python process prints to stdout 
            if (output.toString() === 'pong\n') { // maybe make more robust?
                console.log('Sending pong to client!')
                socket.emit('pong', data);
            }
        });
    },
}

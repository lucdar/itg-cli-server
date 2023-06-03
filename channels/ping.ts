import { Socket } from "socket.io";
import { spawn } from 'child_process';

export function ping(socket: Socket, data: number) {
    console.log('received ping from client:', data);
    const pythonProcess = spawn('python3',["../itg-cli/main.py", 'ping']);
    pythonProcess.stdout.on('data', (output: String) => {
        if (output.toString() === 'pong\n') {
            console.log('Sending pong to client!')
            socket.emit('pong', data);
        }
    });
}
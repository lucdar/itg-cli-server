import { Channel } from "../utils/interfaces";
import { Socket } from "socket.io";
import { spawn } from 'child_process';

export interface PingArgs {
    /**
     * The source of the packet (client or server).
     */
    source: 'client' | 'server';
    /**
     * Status of the ping. 0 is success, 1 is failure.
     */
    status: 0 | 1;
    /**
     * Number of times the client has hit the server with a ping.
     */
    numHits: number;
    /**
     * Descriptive message about the ping.
     */
    message?: string;
}

function isPingArgs(obj: any): boolean {
    try {
        const args = obj as PingArgs;
        return args.source === 'client' || args.source === 'server' &&
            args.status === 0 || args.status === 1 &&
            !isNaN(args.numHits) && args.numHits !== null;
    } catch {
        return false;
    }
}

export const ping: Channel = {
    name: 'ping',
    description: 'Responds with pong and the data that was sent',
    execute: (socket: Socket, args: any) => {
        // Argument validation
        if (!isPingArgs(args)) {
            console.log('Ping: invalid ping args');
            socket.emit('pingResponse', {
                source: 'server', 
                numHits: 0,
                status: 1, 
                message: 'invalid ping args'
            });
            return;
        }
        const pingArgs = args as PingArgs

        const cli = spawn('python3',["../itg-cli/main.py", 'ping']);
        cli.stdout.on('data', (output: String) => { 
            // 'data' event happens when python process prints to stdout 
            if (output.toString().indexOf('pong') !== -1) {
                console.log('Ping: sending pong to client!');
                const emitArgs: PingArgs = {
                    source: 'server',
                    numHits: pingArgs.numHits + 1,
                    status: 0,
                };
                socket.emit('ping', emitArgs);
            } else {
                console.log('Ping: did not receive pong from cli');
                const emitArgs: PingArgs = {
                    source: 'server',
                    numHits: pingArgs.numHits,
                    status: 1,
                    message: 'Did not receive pong from cli'
                }
                socket.emit('pingResponse', emitArgs);
            }
        });
    },
}

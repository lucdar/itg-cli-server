import { Channel } from "../utils/interfaces";
import { Socket } from "socket.io";
import { spawn } from 'child_process';

//TODO: use different message channels instead. i think this will be easier to do... not sure
// if the way i'm doing it now will even be possible.


export interface AddSongArgs {
    /**
     * The link to the song to be downloaded. 
     * Only used for the Inital message type.
     */
    link?: string;
    /**
     * The status of the execution. 0 indicates success and 1 indicates failure.
     * Only used for the Final message type.
     */
    status?: 0 | 1;
    /**
     * Summary of the command's execution. Includes the added song's information.
     */
    summary?: string;
    /**
     *  A list of simfiles that were found in the supplied link.
     */
    simfileChoices?: string[];
    /**
     * The index of the simfile that the user chose. 
     * @satisfies 0 <= simfileChoice < simfileChoices.length
     */
    simfileChoice?: number;
    /**
     * Information about the new and existing songs during a replace prompt.
     */
    replaceInfo?: {
        new: {
            title: string;
            artist: string;
            charts: number[];
        }
        existing: {
            title: string;
            artist: string;
            charts: number[];
        }
    }
    /**
     * Whether the user wants to replace the song if it exists.
     */
    replaceExisting?: boolean;
}

export const addSong: Channel = {
    name: 'addSong', 
    description: 'Add a song from a specified link.',
    execute: (socket: Socket, args: any) => {
        // TODO: validate message type
        const songArgs = args as AddSongArgs;
        // Link validtaion
        if (songArgs.link === undefined) {
            console.log('AddSong: no link supplied with initial request');
            socket.emit('addSong:Final', {
                status: 1,
                summary: 'no link supplied with initial request'
            });
            return;
        }
        if (songArgs.link.indexOf('http') === -1) {
            console.log('AddSong: invalid link supplied with initial request');
            socket.emit('addSong:Final', {
                status: 1,
                summary: 'invalid link supplied with initial request'
            });
            return;
        }

        console.log('AddSong: spawning process with link:', songArgs.link)
        const cli = spawn('python3',["../itg-cli/main.py", 'add-song', songArgs.link]);
        // If the process errors, send an error message to the client.
        cli.on('error', (err) => {
            console.error('AddSong: error executing addSong command:', err);
            socket.emit('addSong:Final', {
                status: 1,
                summary: err.toString()
            })
        });

        // Look for important messages in the CLI output.
        cli.stdout.on('data', (output: Buffer) => { 
            console.log('AddSong: stdOut:', output.toString());
            // If the song was added successfully, send a success message to the client.
            if (output.toString().indexOf('Song added successfully') !== -1) {
                console.log('AddSong: song added successfully');
                socket.emit('addSong:Final', {
                    status: 0,
                    summary: output.toString()
                });
            } else if (output.toString().indexOf('Please choose a simfile') !== -1) {
                // TODO: See what this behavior is and implement it.  
                console.log('addSong: stdOut from prompt message:', output.toString());
                socket.emit('addSong:PromptSimfileChoice', {
                    simfileChoices: ['test1', 'test2', 'test3']
                });
            } else if (output.toString().indexOf('File with the same name already exists') !== -1) {
                console.log('addSong: stdOut from prompt message:', output.toString());
                socket.emit('addSong:PromptKeepOrReplace', {
                    replaceInfo: {}
                });
            }
        });

        // Add event listeners for client responses over the socket.
        socket.on('addSong:SimfileChoice', (args: any) => {
            if (args.simfileChoice !== undefined) {
                //TODO: handle invalid simfile choice
                cli.stdin.write(args.simfileChoice.toString() + '\n');
            }
            socket.removeListener('addSong:SimfileChoice', () => {});
        });
        socket.on('addSong:KeepOrReplace', (args: any) => {
            if (args.replaceExisting !== undefined) {
                console.log('AddSong: received keep or replace from client');
                console.log('AddSong: writing to stdin:', args.replaceExisting ? 'O\n' : 'E\n');
                cli.stdin.write(args.replaceExisting ? 'O\n' : 'E\n');
            }
            socket.removeListener('addSong:KeepOrReplace', () => {});
        });
    }
}
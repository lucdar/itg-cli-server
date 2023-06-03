import { Socket } from "socket.io";

export interface Channel {
    /**
     * Name of the channel. 
     */
    name: string;
    /**
     * Description of the channel.
     */
    description: string;
    /**
     *  Arguments that the channel takes.
     */
    args?: string[];
    /**
     * Function that is executed when the channel is connected to.
     */
    execute: (socket: Socket, ...args: any[]) => void;
}
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
     *  Data that the is sent to the server by the client.
     */
    execute: (socket: Socket, data: object) => void;
}
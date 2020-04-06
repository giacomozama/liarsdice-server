import socketio from 'socket.io';
import logger from '../logger.js';

import CreateRoom from './CreateRoom.js';
import JoinRoom from './JoinRoom.js';
import LeaveRoom from './LeaveRoom.js';
import StartGame from './StartGame.js';

import Disconnect from './Disconnect.js';
import Connect from './Connect.js';

import SendChatMessage from './SendChatMessage.js';

import slogged from 'slogged';

export default (app) => {

    const io = socketio(app);
    //io.use(slogged())
    io.on('connection', (socket) => {
        Connect(socket, io);
        Disconnect(socket, io);
        CreateRoom(socket, io);
        JoinRoom(socket, io);
        LeaveRoom(socket, io);
        SendChatMessage(socket, io);
        StartGame(socket, io);
    });

    return io;
}
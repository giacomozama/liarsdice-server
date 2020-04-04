import socketio from 'socket.io';
import logger from '../logger.js';

import SetUsername from './SetUsername.js';
import CreateRoom from './CreateRoom.js';
import JoinRoom from './JoinRoom.js';
import Disconnect from './Disconnect.js';
import Connect from './Connect.js';

export default (app) => {

    const io = socketio(app);
    io.on('connection', (socket) => {
        Connect(socket, io);
        SetUsername(socket, io);
        Disconnect(socket, io);
        CreateRoom(socket, io);
        JoinRoom(socket, io);
    });

    return io;
}
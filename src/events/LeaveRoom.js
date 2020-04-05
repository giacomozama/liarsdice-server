import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js';
import Room from '../models/Room.js';
import Response from './Response.js';

export default (socket, io) => {
    socket.on('LeaveRoom', () => {
        try {
            logger.info('Socket %s is leaving the room', socket.id);

            let player = PlayerService.getPlayer(socket.id);
            socket.leave(player.room.id);

            let room = RoomService.leaveRoom(socket.id, player.room.id);
            if (room)
                io.to(room.id).emit('RoomChange', Response(room));

        } catch (error) {
            logger.error(error);
            throw Error('Failed to remove player from room: ' + error.message + ' ' + error.stack);
        }
    });
}
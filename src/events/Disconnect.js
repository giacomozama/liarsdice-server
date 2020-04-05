import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js';
import Room from '../models/Room.js';
import Response from './Response.js';

export default (socket, io) => {
    socket.on('disconnect', (reason) => {
        logger.info('Socket %s is disconnecting. Reason: %s', socket.id, reason);
        const player = PlayerService.getPlayer(socket.id);
        if (player.room) {
            const room_id = player.room.id;
            const room = RoomService.leaveRoom(socket.id, room_id);
            if (room) {
                io.to(room.id).emit('RoomChange', Response(room));
            }
        }
        PlayerService.removePlayer(socket.id);
    });
}
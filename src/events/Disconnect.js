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
            const room = RoomService.leaveRoom(player.sid, player.room.id);
            if (room && !room.isEmpty()) {
                io.to(room.id).emit('RoomChange', Response(room));
            }
        }
        let lol = PlayerService.removePlayer(socket.id);
    });
}
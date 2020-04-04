import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js';
import Room from '../models/Room.js';

export default (socket, io) => {
    socket.on('disconnect', (reason) => {
        logger.info('Socket %s is disconnecting. Reason: %s', socket.id, reason);
        const player = PlayerService.getPlayer(socket.id);
        if (player.room)
            RoomService.leaveRoom(socket.id, player.room.id);
        PlayerService.removePlayer(socket.id);
    });
}
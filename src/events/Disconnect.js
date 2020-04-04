import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js';

export default (socket, io) => {
    socket.on('disconnect', (reason) => {
        logger.info('Socket %s is disconnecting. Reason: %s for %s', socket.id, reason);
        PlayerService.removePlayer(socket.id);
    });
}
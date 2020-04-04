import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'

export default (socket) => {
    socket.on('disconnect', (reason) => {
        logger.info('Socket %s is disconnecting. Reason: %s for %s', socket.id, reason);
        PlayerService.removePlayer(socket.id);
    });
}
import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'

export default (socket) => {
    return socket.on('SetUsername', (username) => {
        logger.info('Setting username %s for %s', username, socket.id);
        try {
            PlayerService.setUsername(socket.id, username);
        } catch {
            return Error('Failed to set username');
        }
    });
}
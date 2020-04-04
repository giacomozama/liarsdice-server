import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'

export default (socket) => {
    return socket.on('SetUsername', (username) => {
        logger.info('Setting username %s for %s', username, socket.id);
        PlayerService.setUsername(socket.id, username);
    });
}

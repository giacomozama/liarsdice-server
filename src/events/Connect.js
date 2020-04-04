import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'

export default (socket) => {
    logger.info('New connection from %s', socket.id);
    PlayerService.registerPlayer(socket.id);
}
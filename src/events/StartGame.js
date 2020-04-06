import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js'
import Response from './Response.js'

export default (socket, io) => {
    return socket.on('StartGame', (message) => {
        logger.info('Received event StartGame');
        try {
            //TODO check if owner
            logger.info('Game started', socket.id);
            let player = PlayerService.getPlayer(socket.id);

            if (player && player.room && message.trim() !== '') {
                player.room.status = 'ingame';
                io.to(player.room.id).emit('RoomChange', Response(player.room));
            }
        } catch(error) {
            throw Error('Failed to create room ' + error.message + ' ' + error.stacktrace);
        }
    });
}
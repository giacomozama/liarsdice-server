import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js'
import Response from './Response.js'

export default (socket, io) => {
    return socket.on('CreateRoom', (username, fn) => {
        logger.info('Received event CreateRoom');
        try {
            logger.info('Setting username %s for %s', username, socket.id);
            PlayerService.setUsername(socket.id, username);
            let room = RoomService.createRoom(socket.id);
            logger.info('Creating room %s for user %s', room.id, socket.id);
            socket.join(room.id);

            fn(Response(room));
        } catch(error) {
            fn(Response(error));
            throw Error('Failed to create room ' + error.message + ' ' + error.stacktrace);
        }
    });
}
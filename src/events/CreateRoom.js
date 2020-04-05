import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js'

export default (socket, io) => {
    return socket.on('CreateRoom', (username, fn) => {
        logger.info('Received event CreateRoom');
        try {
            let room = RoomService.createRoom(socket.id);
            logger.info('Creating room %s for user %s', room.id, socket.id);
            logger.info('Setting username %s for %s', username, socket.id);
            PlayerService.setUsername(socket.id, username);
            socket.join(room.id);
            fn(RoomService.getRoomStatus(room.id));
        } catch(error) {
            return Error('Failed to create room', error);
        }
    });
}
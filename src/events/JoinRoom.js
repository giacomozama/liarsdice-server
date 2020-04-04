import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js'

export default (socket) => {
    return socket.on('JoinRoom', (room_id, username, fn) => {
        try {
            logger.info('Setting username %s for %s', username, socket.id);
            let room = RoomService.getRoom(room_id);
            PlayerService.setUsername(socket.id, username);
            RoomService.joinRoom(socket.id, room.id);
            logger.info('Creating room %s for user %s', room.id, socket.id);
            fn(room.id);
        } catch {
            return Error('Failed to create room');
        }
    });
}
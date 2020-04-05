import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js'

export default (socket, io) => {
    return socket.on('JoinRoom', (room_id, username, fn) => {
        try {
            logger.info('Setting username %s for %s', username, socket.id);
            let room = RoomService.getRoom(room_id);
            PlayerService.setUsername(socket.id, username);
            RoomService.joinRoom(socket.id, room.id);
            logger.info('Joining room %s for user %s; now contains %d players', room.id, socket.id, room.size);
            RoomService.notifyRoom(io, 'RoomChange', room_id);
            fn(RoomService.getRoomStatus(room_id));
        } catch (error) {
            return Error('Failed to create room', error);
        }
    });
}
import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js'
import Response from './Response.js'

export default (socket, io) => {
    return socket.on('JoinRoom', (room_id, username, fn) => {
        try {
            logger.info('Setting username %s for %s', username, socket.id);
            let room = RoomService.getRoom(room_id);
            PlayerService.setUsername(socket.id, username);
            room = RoomService.joinRoom(socket.id, room.id);
            socket.join(room.id);
            socket.broadcast.to(room.id).emit('RoomChange', Response(room));
            fn(Response(room));
        } catch (error) {
            fn(Response(error));
            return Error('Failed to create room', error);
        }
    });
}
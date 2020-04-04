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
            socket.broadcast.to(room.id).emit('JoinRoom', room.players.map((p) => p.username));
            fn(room.players.map((p)=>p.username));
        } catch {
            return Error('Failed to create room');
        }
    });
}
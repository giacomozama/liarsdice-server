import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js';
import Room from '../models/Room.js';
import Response from './Response.js';

export default (socket, io) => {
    socket.on('LeaveRoom', () => {
        logger.info('Socket %s is leaving the room', socket.id);
        const player = PlayerService.getPlayer(socket.id);
        player.username = null;
        if (player.room) {
            const room_id = player.room.id;
            const room = RoomService.leaveRoom(socket.id, room_id);
            if (room) {
                io.to(room.id).emit('RoomChange', Response(room));
            }
        }
    });
}
import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js'
import GameService from '../services/GameService.js'
import Response from './Response.js'

export default (socket, io) => {
    return socket.on('StartGame', () => {

        logger.info('Received event StartGame');
        try {
            let player = PlayerService.getPlayer(socket.id);
            let game = GameService.startGame(player.room);
            logger.info('Game started by %s(%s)', player.username, socket.id);
            if (player.room.owner.sid !== socket.id) {
                logger.error('Hackerman detected! Room started by non owner user %s(%s)', player.username, player.gid);
                    
                io.to(player.sid).emit('GameStarted', {
                    'success': false,
                    'message': 'Hackerman! Ti ho segnalato a mio zio che lavora alla polizia postale'
                })
                return;
            }

            if (player && player.room && game) {
                player.room.status = 'ingame';

                
                Object.keys(game._players).forEach(gid => {
                    const p = game._players[gid];
                    io.to(p.sid).emit('GameStarted', {
                        'success': true,
                        'gid': p.gid,
                        'dice': game.getDice(p.gid),
                        'order': game.order,
                        'active_player': game.current_player.gid
                    });
                });
            }
        } catch(error) {
            console.error(error);
        }
    });
}
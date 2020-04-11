import logger from '../logger.js'
import PlayerService from '../services/PlayerService.js'
import RoomService from '../services/RoomService.js'
import GameService from '../services/GameService.js'
import Response from './Response.js'
import Game from '../models/Game.js'
import GlobalState from '../models/GlobalState.js'

export default (socket, io) => {
    return socket.on('Claim', (amount, pips) => {

        logger.info('Received event Claim');
        try {
            let player = PlayerService.getPlayer(socket.id);
            let room = player.room;
            let game = GlobalState.getGame(room.id);

            if (!game) {
                logger.error('Hacking detected! Player is not playing any game')
                return;
            }

            logger.info('Claim received by %s(%s)', player.username, socket.id);
            if (player.gid !== game.current_player.gid) {
                logger.error('Hackerman detected! Claim by wrong user %s(%s)', player.username, player.gid);
                io.to(player.sid).emit('Claim', {
                    'success': false,
                    'message': 'Hackerman! Ti ho segnalato a mio zio che lavora alla polizia postale'
                });
                return;
            }

            GameService.claim(game, player, amount, pips);
            
            Object.keys(game._players).forEach(gid => {
                const p = game._players[gid];
                io.to(p.sid).emit('NextTurn', {
                    'success': true,
                    'active_player': game.current_player.gid,
                    'claim': {'gid': game.last_player.gid, 'amount': amount, 'pips': pips}
                });
            });

        } catch(error) {
            console.error(error);
        }
    });
}
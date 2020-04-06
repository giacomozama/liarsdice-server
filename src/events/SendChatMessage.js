import logger from '../logger.js'
import Response from './Response.js'

export default (socket, io) => {
    return socket.on('SendChatMessage', (message, fn) => {
        logger.info('Received event SendChatMessage');
        try {
            logger.info('Received chat message from %s', socket.id);
            let player = PlayerService.getPlayer(socket.id);

            let packet = {
                'success': true,
                'from': player.username,
                'message': message
            }
            if (player && player.room && message.trim() !== '') {
                socket.broadcast.to(player.room.id).emit('NewChatMessage', packet);
            }
            fn(packet);
        } catch(error) {
            //TODO change error message
            fn({
                'success': false,
                'reason': 'Could not send message'
            })
            throw Error('Failed to create room ' + error.message + ' ' + error.stacktrace);
        }
    });
}
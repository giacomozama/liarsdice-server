//@ts-check

import GlobalState from '../models/GlobalState.js'
import Player from '../models/Player.js'
import logger from '../logger.js';

export default {

    /**
     * @param {string} sid The player's socket id
     * @return {Player} the created player
     * @throws If the argument has the wrong type
     */
    'registerPlayer': (sid) => {
        // @ts-ignore
        if (typeof sid === 'string' || sid instanceof String) {
            let newUser = new Player(sid);
            GlobalState.addPlayer(newUser);
            return newUser;
        }
        throw TypeError('Socket id must be a string');
    },

    /**
     * @param {string|Player} sid The player's socket id
     * @throws If the argument has the wrong type
     */
    'removePlayer': (p) => {
        if (typeof p === 'string' || p instanceof String) {
            // @ts-ignore
            return GlobalState.removePlayerById(p);
        } else if (p instanceof Player) {
            return GlobalState.removePlayer(p);
        }
        throw TypeError('Argument must be a string (socket id) or a Player object');
    },

    /**
     * @param {string} sid The player's socket id
     * @return {Player} The player object
     * @throws {TypeError} If the arguments have the wrong type
     */
    'getPlayer': (sid) => {
        // @ts-ignore
        if (typeof sid === 'string' || sid instanceof String)
            return GlobalState.getPlayer(sid);
        throw TypeError('Socket id must be a string');
    },

    /**
     * @param {string|Player} sid The player's socket id
     * @param {string} username The player's socket id
     * @return {Player} A reference to the modified player
     * @throws {TypeError} If the arguments have the wrong type
     * @throws {Error} if the operation fails (player doesn't exist)
     */
    'setUsername': (player, username) => {
        if (typeof username !== 'string')
            throw TypeError('Username must be a string');
        if (typeof player !== 'string' && !(player instanceof Player))
            throw TypeError("Player must be a string (socket id) or a Player object");

        try {
            if (typeof player === 'string' || typeof player === 'string')
                player = GlobalState.getPlayer(player);
            player.username = username;
            return player;
        } catch (error) {
            logger.error('PlayerService.setUsername: %o', error);
            throw error;
        }
    }
}
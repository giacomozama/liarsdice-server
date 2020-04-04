import logger from '../logger.js'

const _players = {};
const _rooms = {};

export default {

    //used for testing
    '_players': _players,

    /**
     * Add a player
     * @param sid The player's socket id
     */
    'addPlayer': (player) => {
        logger.info('GlobalState::addPlayer %o', player);
        _players[player.sid] = player;
        logger.info(_players);
    },

    /**
     * Remove a player
     * @param sid The player's socket id
     */
    'removePlayer': (sid) => {
        logger.info('GlobalState::removePlayer %o', _players[sid]);
        delete _players[sid];
    },

    /**
     * Retrieve a player
     * @param sid The player's socket id
     */
    'getPlayer': (sid) => {
        return _players[sid];
    },

    'log': () => {
        logger.info(_players);
    }
}
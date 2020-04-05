import logger from '../logger.js'
import winston from 'winston/lib/winston/config';

const _players = {};
const _rooms = {};

const playerCount = () => {
    return Object.keys(_players).length;
};

const roomCount = () => {
    return Object.keys(_rooms).length;
};

/**
 * Retrieve a player
 * @param sid The player's  socket id
 */
const getPlayer = (sid) => {
    let p = _players[sid];
    return _players[sid];
};

/**
 * Add a player
 * @param sid The player's socket id
 */
const addPlayer = (player) => {
    _players[player.sid] = player;
    logger.info('GlobalState::addPlayer %o; there are now %d players', player, playerCount());
};

/**
 * Remove a player
 * @param sid The player's socket id
 */
const removePlayer = (sid) => {
    //TODO fix for non existing players
    let player = getPlayer(sid);
    delete _players[sid];
    logger.info('GlobalState::removePlayer %o; there are now %d players', player, playerCount());
};

/**
 * Create a new room with the given owner
 */
const addRoom = (room) => {
    //TODO check if the universe is aligned so that the id already exists
    _rooms[room.id] = room;
    logger.info('GlobalState::addRoom %o; there are now %d rooms', room, roomCount());
};

/**
 * Retrieve a room
 * @param rid The rooms's id
 */
const getRoom = (rid) => {
    return _rooms[rid];
};

/**
 * Create a new room with the given owner
 */
const removeRoom = (room) => {
    delete _rooms[room.id];
};

export default {

    //used for testing
    '_players': _players,
    '_rooms': _rooms,
    'log': () => {
        logger.info(_players);
        logger.info(_rooms);
    },

    'playerCount': playerCount,
    'roomCount': roomCount,

    'getPlayer': getPlayer,
    'addPlayer': addPlayer,
    'removePlayer': removePlayer,

    'addRoom': addRoom,
    'getRoom': getRoom,
    'removeRoom': removeRoom,
}
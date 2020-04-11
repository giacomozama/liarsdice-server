//@ts-check

import logger from '../logger.js'
import Player from './Player.js'
import Room from './Room.js'
import winston from 'winston/lib/winston/config';
import Game from './Game.js';

const _players = {};
const _rooms = {};
const _games = {};

/**
 * @returns {number} The number of currently logged players
 */
const playerCount = () => {
    return Object.keys(_players).length;
};

/**
 * @returns {number} The number of currently open rooms
 */
const roomCount = () => {
    return Object.keys(_rooms).length;
};

/**
 * @returns {number} The number of currently ongoing games
 */
const gameCount = () => {
    return Object.keys(_games).length;
};


/**
 * Retrieve a player
 * @param {string} sid The player's socket id
 * @return {Player} sid The player's socket id
 * @throws When the player is not found.
 */
const getPlayer = (sid) => {
    let p = _players[sid];
    if (typeof p === 'undefined' || p === null)
        throw Error(`Player(${sid}) not found.`)
    return _players[sid];
};

/**
 * Add a player
 * @param {Player} player
 */
const addPlayer = (player) => {
    logger.silly('GlobalState::addPlayer %o; there are now %d players', player, playerCount());
    _players[player.sid] = player;
};

/**
 * Remove a player
 * @param {string} sid The player's socket id
 * @returns {Player} or null if the player wasn't found
 */
const removePlayerById = (sid) => {
    try {
        let player = getPlayer(sid)
        delete _players[sid];
        return player;
    } catch {
        return null;
    }
}
/**
 * @param {Player} player 
 */
const removePlayer = (player) => {
    try {
        return removePlayerById(player.sid);
    } catch (error) {
        return null;
    }
};


/**
 * Create a new room
 * @param {Room} room
 */
const addRoom = (room) => {
    //TODO check if the universe is aligned so that the id already exists
    _rooms[room.id] = room;
    logger.silly('GlobalState::addRoom %o; there are now %d rooms', room, roomCount());
};

/**
 * Retrieve a room
 * @param {string} rid The rooms's id
 * @returns {Room}
 * @throws
 */
const getRoom = (rid) => {
    let r = _rooms[rid];
    if (typeof r === 'undefined' || r === null)
        throw Error(`Room(${rid}) not found.`)
    return r;
};

/**
 * Remove a room from the server
 * @param {string} rid
 */
const removeRoomById = (rid) => {
    try {
        let room = getRoom(rid)
        delete _rooms[rid];
    } catch {
        logger.warn('Trying to delete a room that doesn\'t exist')
    }
};

/**
 * @param {Room} room 
 */
const removeRoom = (room) => {
    return removeRoomById(room.id);
}


/**
 * Create a new game
 * @param {Game} game
 */
const addGame = (game) => {
    _games[game.room.id] = game;
    logger.silly('GlobalState::addGame %o; there are now %d games', game, gameCount());
};

/**
 * Retrieve a game
 * @param {string} rid The id of the game's room
 * @returns {Game}
 * @throws
 */
const getGame = (rid) => {
    let g = _games[rid];
    if (typeof g === 'undefined' || g === null)
        throw Error(`Game(${rid}) not found.`)
    return g;
};

/**
 * Remove a game from the server
 * @param {string} rid
 */
const removeGameByRoomId = (rid) => {
    try {
        getGame(rid)
        delete _games[rid];
    } catch {
        logger.warn('Trying to delete a game that doesn\'t exist')
    }
};

/**
 * @param {Room} room 
 */
const removeGameByRoom = (room) => {
    return removeGameByRoomId(room.id);
}

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
    'removePlayerById': removePlayerById,

    'addRoom': addRoom,
    'getRoom': getRoom,
    'removeRoom': removeRoom,
    'removeRoomById': removeRoomById,

    'addGame': addGame,
    'getGame': getGame,
    'removeGameByRoom': removeGameByRoom,
    'removeGameByRoomId': removeGameByRoomId,
}
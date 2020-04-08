import logger from '../logger.js'
import GlobalState from '../models/GlobalState.js'
import Room from '../models/Room.js'
import Player from '../models/Player.js'

class RoomError extends Error {}
class RoomJoinError extends RoomError {}
class RoomCreateError extends RoomError {}
class RoomLeaveError extends RoomError {}
class RoomNotFoundError extends RoomError {}

export default {

    /**
     * @param {string|Player} owner The room's owner.
     * @returns {Room} The newly created room.
     * @throws {RoomCreateError}
     */
    'createRoom': (owner) => {
        try {
            logger.debug('createRoom %o', owner)
            if (!(owner instanceof Player))
                owner = GlobalState.getPlayer(owner);

            let room = new Room(owner);
            owner.room = room;

            GlobalState.addRoom(room);
            return room;
        } catch (error) {
            logger.error('Failed to create room %o', error);
            throw RoomCreateError('Cannot create room');
        }
    },

    /**
     * @param {string} room_id The room's id
     * @returns {Room} 
     * @throws {RoomNotFoundError}
     */
    'getRoom': (room_id) => {
        try {
            return GlobalState.getRoom(room_id);
        } catch (error) {
            logger.error('Failed to retrieve room %o', error);
            throw RoomNotFoundError(`Room ${room_id} not found`);
        }
    },

    /**
     * Add a player to a room. 
     * @param {string} sid The socket id
     * @param {string} rid The room id
     * @throws {RoomJoinError}
     */
    'joinRoom': (sid, rid) => {
        try {
            let player = GlobalState.getPlayer(sid);
            let room = GlobalState.getRoom(rid);

            if (room.status == 'full')
                throw RoomJoinError('The room is full!');
            if (room.status == 'ingame')
                throw RoomJoinError('The room is already playing a game!');

            if (player.inRoom())
                throw RoomJoinError('The player is already in another room!');

            room.addPlayer(player);
            player.room = room;

            if (room.size == 1) {
                room.status = 'waiting';
            } else if (room.size >= 6) {
                room.status = 'full'
            } else if (room.size > 1) {
                room.status = 'ready';
            }

            return room;

        } catch(error) {
            if (error instanceof RoomJoinError) {
                logger.error('Failed to join room %o', error);
                throw error
            }
            let str = `Failed to add player ${sid} to room ${rid}`;
            logger.error(str, error);
            throw RoomJoinError(str);
        }
    },

    /**
     * @param {string} sid
     * @param {string} room_id
     * @throws
     */
    'leaveRoom': (sid, room_id) => {
        try {
            let player = GlobalState.getPlayer(sid);
            let room = GlobalState.getRoom(room_id);
            
            room.removePlayer(player);
            if (player.room)
                player.room = null;

            if (room.isEmpty()) {
                return GlobalState.removeRoom(room);
            }

            if (room.size == 1) {
                room.status = 'waiting';
            } else if (room.size > 1) {
                room.status = 'ready';
            }

            if (!room.owner) {
                room.owner = room.players[0];
            }

            return room;
        } catch(error) {
            let str = `Failed to remove player ${sid} to room ${room_id} `;
            logger.error(str, error);
            throw RoomLeaveError(str);
        }
    },

    /**
     * @param {string} room_id
     * @param {string} owner_id
     * @throws
     */
    'setOwner': (room_id, owner_id) => {
        try {
            let player = GlobalState.getPlayer(sid);
            let room = GlobalState.getRoom(room_id);
            
            if (player.room.id !== room.id) {
                throw RoomSetOwnerError('The player is not in the room!');
            } else {
                room.owner = owner;
            }

            return room;
        } catch (error) {
            let str = `Failed to set player ${owner_id} as owner of room ${room_id}`;
            logger.error(str, error);
            throw RoomSetOwnerError(error.message);
        }
    },
}
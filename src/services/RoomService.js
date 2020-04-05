import logger from '../logger.js'
import GlobalState from '../models/GlobalState.js'
import Room from '../models/Room.js'
import Response from '../events/Response.js'

const getRoomStatus = (room_id) => {
    try {
        let room = GlobalState.getRoom(room_id);
        return room.toJSON();
    } catch (error) {
        logger.error('Failed to retrieve room', error);
        return error;
    }
}

export default {

    //'getRoomStatus': getRoomStatus,

    'createRoom': (owner_sid) => {
        try {
            let owner = GlobalState.getPlayer(owner_sid);
            let room = new Room(owner);
            GlobalState.addRoom(room);
            owner.room = room;
            return room;
        } catch {
            logger.error('Failed to create room');
            return Error('Cannot create room');
        }
    },

    'getRoom': (room_id) => {
        try {
            let room = GlobalState.getRoom(room_id);
            return room;
        } catch (error) {
            logger.error('Failed to retrieve room', error);
            throw error;
        }
    },


    'joinRoom': (sid, room_id) => {
        try {
            let player = GlobalState.getPlayer(sid);
            let room = GlobalState.getRoom(room_id);
            room.addPlayer(player);
            //if (player.room)
            //    throw Error('Player is already in a room');


            player.room = room;
            return room;
        } catch(error) {
            let str = `Failed to add player ${sid} to room ${room_id}`;
            logger.error(str, error);
            return error;
        }
    },

    'leaveRoom': (sid, room_id) => {
        try {
            let player = GlobalState.getPlayer(sid);
            let room = GlobalState.getRoom(room_id);
            room.removePlayer(player);

            player.room = null;
            if (room.isEmpty()) {
                GlobalState.removeRoom(room);
                return null;
            } else if (player.id == room.owner) {
                room.owner = room.players[0];
            }

            return room;
        } catch(error) {
            let str = `Failed to remove player ${sid} to room ${room_id}`;
            logger.error(str, error);
            return error;
        }
    },

    'setOwner': (room_id, owner_id) => {
        try {
            let player = GlobalState.getPlayer(sid);
            let room = GlobalState.getRoom(room_id);
            
            if (player.room.id !== room.id) {
                throw('The player is not in the room!');
            } else {
                room.owner = owner;
            }

            return room;
        } catch (error) {
            let str = `Failed to set player ${owner_id} as owner of room ${room_id}`;
            logger.error(str, error);
            return error;
        }
    },

    'notifyRoom': (io, event_name, room_id) => {
        try {
            let room = GlobalState.getRoom(room_id);
            if (room.isEmpty())
                return false;

            io.to(room_id).emit(event_name, Response(GlobalState.getRoom(room_id)));

            return true;
        } catch (error) {
            logger.error('Cannot notify room %s, %o', room_id, error);
            throw error;
        }
    }
}
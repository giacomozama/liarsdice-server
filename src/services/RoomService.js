import logger from '../logger.js'
import GlobalState from '../models/GlobalState.js'
import Room from '../models/Room.js'

export default {

    'createRoom': (owner_sid) => {
        try {
            let owner = GlobalState.getPlayer(owner_sid);
            let room = new Room(owner);
            GlobalState.addRoom(room);
            logger.info('Created room with id %s', room.id);
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
        } catch {
            logger.error('Failed to retrieve room');
            return Error('Failed to retrieve room');
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
        //TODO check if sid is owner
        try {
            let player = GlobalState.getPlayer(sid);
            let room = GlobalState.getRoom(room_id);
            room.removePlayer(player);
            player.room = null;
            if (room.isEmpty()) {
                GlobalState.removeRoom(room);
                return null;
            }
            return room;
        } catch(error) {
            let str = `Failed to remove player ${sid} to room ${room_id}`;
            logger.error(str, error);
            return error;
        }
    },
}
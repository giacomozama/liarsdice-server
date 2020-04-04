import logger from '../logger.js'
import GlobalState from '../models/GlobalState.js'
import Room from '../models/Room.js'

export default {

    'createRoom': (owner_sid) => {
        try {
            let owner = GlobalState.getPlayer(owner_sid);
            let room = new Room(owner_sid);
            GlobalState.addRoom(room);
            logger.info('Created room with id %s', room.id);
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
            room.addPlayer()
            return room;
        } catch {
            let str = `Failed to add player ${sid} to room ${room_id}`;
            logger.error(str);
            return Error(str);
        }
    },

    'leaveRoom': (sid, room_id) => {
        //TODO check if sid is owner
        try {
            let player = GlobalState.getPlayer(sid);
            let room = GlobalState.getRoom(room_id);
            room.removePlayer(player);
            return room;
        } catch {
            let str = `Failed to remove player ${sid} to room ${room_id}`;
            logger.error(str);
            return Error(str);
        }
    },
}
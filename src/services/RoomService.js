import logger from '../logger.js'
import GlobalState from '../models/GlobalState.js'
import Room from '../models/Room.js'

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

            if (room.size == 1) {
                room.status = 'waiting';
            } else if (room.size > 1) {
                room.status = 'ready';
            }

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

            if (!player) {
                logger.error('Porco dio perchè?');
            }
            if (!room) {
                logger.error('Boh non c\'è la room');
            }

            room.removePlayer(player);


            //player.room = null;
            if (room.isEmpty()) {
                GlobalState.removeRoom(room);
                return null;
            } else if (!room.owner) {
                room.owner = room.players[0];
            }

            if (room.size == 1) {
                room.status = 'waiting';
            } else if (room.size > 1) {
                room.status = 'ready';
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

}
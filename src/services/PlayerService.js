import GlobalState from '../models/GlobalState.js'
import Player from '../models/Player.js'

export default {

    'registerPlayer': (sid) => {
        let newUser = new Player(sid);
        GlobalState.addPlayer(newUser);
    },

    'removePlayer': (sid) => {
        GlobalState.removePlayer(sid);
    },

    'getPlayer': (sid) => {
        return GlobalState.getPlayer(sid);
    },

    'setUsername': (sid, username) => {
        GlobalState.getPlayer(sid).username = username;
    }

}
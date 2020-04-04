export default class Player {

    /**
     * @param {int} sid The player's socket id
     */
    constructor(sid) {
        this._sid = sid;
        this._username = null;
        this._room = null;
    }

    /**
     * The player's socket id
     */
    get sid() {
        return this._sid;
    }

    get room() {
        return this._room;
    }

    set room(newRoom) {
        this._room = newRoom;
    }

    /**
     * The player's current name
     */
    get username() {
        return this._username;
    }

    /**
     * Set the name of this player.
     * @param {str} newName must be non-empty.
     */
    set username(newName) {
        if (newName.length == 0) {
            throw ('User::set username(): username must be a non-empty string');
        }
        this._username = newName;
    }

    /**
     * Check if the 
     */
    hasName() {
        return (typeof this._name === 'string' || this._name instanceof String);
    }
}
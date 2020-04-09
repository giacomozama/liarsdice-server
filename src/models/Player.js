export default class Player {

    /**
     * @param {string} sid The player's socket id
     */
    constructor(sid) {
        if (typeof sid !== 'string')
            throw TypeError('Sid must be a string');

        sid = sid.trim()
        if (sid === '')
            throw Error('Sid cannot be a empty.');

        this._gid = -1;
        this._sid = sid;
        this._username = null;
        this._room = null;
        this._game = null;
    }

    /**
     * The player's socket id
     * @returns {string}
     */
    get sid() {
        return this._sid;
    }

    /**
     * The player's game id
     * @returns {number}
     */
    get gid() {
        return this._gid;
    }

    /**
     * The game id is used to identify a player inside of a game.
     * @param {number} game_id The player's game id
     */
    set gid(game_id) {
        this._gid = game_id;
    }

    /**
     * The player's current room
     * @returns {Room}
     */
    get room() {
        return this._room;
    }

    /**
     * Set the room of a player. 
     * @param {Room} newRoom;
     */
    set room(newRoom) {
        this._room = newRoom;
    }

    /**
     * The player's current room
     * @returns {Game}
     */
    get game() {
        return this._game;
    }

    /**
     * Set the room of a player. 
     * @param {Game} newGame;
     */
    set game(newGame) {
        this._game = newGame;
    }

    /**
     * The player's current name
     * @returns {string}
     */
    get username() {
        return this._username;
    }

    /**
     * Set the name of this player.
     * @param {string} newName must be non-empty.
     */
    set username(newName) {
        if (newName.length == 0) {
            throw ('User::set username(): username must be a non-empty string');
        }
        this._username = newName;
    }

    /**
     * @returns {boolean}
     */
    hasName() {
        return this.username !== null;
    }

    /**
     * @returns {boolean}
     */
    hasGid() {
        return this.gid > 0;
    }

    /**
     * @returns {boolean}
     */
    inRoom() {
        return this.room !== null;
    }
}
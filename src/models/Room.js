import logger from "../logger";

/**
 * @typedef {Object} RoomJson
 * @property {string} id
 * @property {string} owner
 * @property {string[]} players
 * @property {string} status
 */

export default class Room {
    
    /**
     * @param {Player} owner 
     */
    constructor(owner) {
        this._rid = Room._genId();
        this._owner = owner;
        this._status = 'waiting';
        this._players = [owner];
    }

    /**
     * @return {RoomJson}
     */
    toJSON() {
        return {
            'id': this.id,
            'owner': this.owner.username,
            'players': this.players.map((p) => p.username),
            'status': this.status,
        };
    }

    /**
     * @param {Player} player 
     */
    addPlayer(player) {
        //TODO check if not already present?
        //TODO ensure game is not playing
        //TODO change room status
        this._players.push(player);
    }

    /**
     * @param {Player} player 
     */
    removePlayer(player) {

        const index = this._indexOf(player);
        if (index > -1) {
            if (this.owner && this.owner.sid === player.sid) {
                this.owner = null;
            }
            this._players.splice(index, 1);
            player.room = null;
        }
    }


    /**
     * @returns {string}
     */
    get id() {
        return this._rid;
    }

    /**
     * @returns {string[]}
     */
    get players() {
        return this._players;
    }

    /**
     * @returns {number}
     */
    get size() {
        return this._players.length;
    }

    /**
     * @returns {string}
     */
    get owner() {
        return this._owner;
    }

    /**
     * @param {Player} player
     */
    set owner(player) {
        this._owner = player;
    }

    /**
     * @returns {string}
     */
    get status() {
        return this._status;
    }

    /**
     * @param {string}
     */
    set status(s) {
        this._status = s;
    }

    /**
     * @returns {boolean}
     */
    isEmpty() {
        return this.size == 0;
    }


    /**
     * @param {string|Player} player 
     */
    _indexOf(player) {
        try {
            if (typeof player === 'string' || player instanceof String) {
                for (let i = 0; i < this._players.length; i++) {
                    if (this._players[i].sid === player)
                        return i;
                }
            } else {
                for (let i = 0; i < this._players.length; i++) {
                    if (this._players[i].sid === player.sid)
                        return i;
                }
            }
        } catch {
            return -1;
        }

        return -1;
    }

    static _genId() {
        return new Array(6).join().replace(/(.|$)/g, function(){return ((Math.random()*36)|0).toString(36)[Math.random()<.5?"toString":"toUpperCase"]();});
    }
}
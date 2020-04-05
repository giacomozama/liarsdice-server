import logger from "../logger";

export default class Room {
    
    constructor(owner) {
        this._rid = Room._genId();
        this._owner = owner;
        this._status = 'waiting';
        this._players = [owner];
    }

    toJSON() {
        return {
            'id': this.id,
            'owner': this.owner.username,
            'players': this.players.map((p) => p.username),
            'status': this.status,
        };
    }

    addPlayer(player) {
        //TODO check if not already present?
        //TODO ensure game is not playing
        //TODO change room status
        this._players.push(player);
    }

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



    get id() {
        return this._rid;
    }

    get players() {
        return this._players;
    }

    get size() {
        return this._players.length;
    }

    get owner() {
        return this._owner;
    }

    set owner(player) {
        this._owner = player;
    }

    get status() {
        return this._status;
    }

    set status(s) {
        this._status = s;
    }

    isEmpty() {
        return this.size == 0;
    }

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
import Room from './Room.js';
import logger from '../logger.js'


/**
 * 
 *   disconnect(player)
 *   claim(count, pips) => NextPlayer
 *   doubt() => 
 * 
 */
export default class Game {

    /**
     * @param {Room} room 
     */
    constructor(room) {

        if (!room || !(room instanceof Room) || room.isEmpty())
            throw Error('Cannot construct a game! Invalid room');
        if (room.isEmpty())
            throw Error('Cannot construct a game! The room is empty');
        if (room.status !== 'ready' && room.status !== 'full')
            throw Error('Cannot construct a game! The room must be ready or full');

        this._room = room;

        // Status: newround, waitforclaim
        this._status = 'newround';

        // game_id => player
        this._players = {};

        // keep track of the order of players
        this._order = [];
        this._active = {}; // Players that can play
        this._dice = {};

        this._room.players.forEach((p, i) => {
            p.gid = i;
            this._order.push(i);
            this._players[i] = p;
            this._dice[i] = new Array(6).fill(0);
            this._active[i] = true;
        });

        this._current_player = this._players[this._order[0]];
        this._last_player = null;

        this.rollDice();
    }

    get players() {
        return this._players;
    }

    get current_player() {
        return this._current_player;
    }

    set current_player(player) {
        this._current_player = player;
    }

    get last_player() {
        return this._current_player;
    }

    set last_player(player) {
        this._last_player = player;
    }

    get order() {
        return this._order;
    }

    get dice() {
        return this._dice;
    }

    getDice(game_id) {
        return this._dice[game_id];
    }

    rollDice() {
        this._last_claim = null;
        Object.keys(this._dice).forEach(
            gid => this._dice[gid] = this._dice[gid].map(() => Math.ceil(Math.random() * 6))
        );
    }

    /**
     * 
     * @param {number} amount 
     * @param {number} pips 
     */
    setLastClaim(amount, pips) {
        this._last_claim = {
            'amount': amount,
            'pips': pips,
        }
        return this._last_claim;
    }

    getLastClaim() {
        return this.this._last_claim;
    }

    /**
     * TRUE = vince chi fa la doubt
     */
    isDoubtCorrect() {
        if (!this._last_claim)
            throw Error('Cannot doubt on first turn')

        const amount = this._last_claim.amount;
        const pips = this._last_claim.pips;
        
        return (amount < this.countPips(pips));
    }

    isValidClaim(amount, pips) {
        if (!this._last_claim) {
            return true;
        }

        const previousPips = this.getLastClaim().pips;
        const previousAmount = this.getLastClaim().amount;

        return ((((pips === 1 && previousPips === 1) || (pips !== 1 && previousPips !== 1)) && amount > previousAmount) 
            || (pips === 1 && previousPips !== 1 && amount > Math.floor(previousAmount / 2))
            || (pips !== 1 && previousPips === 1 && amount > previousAmount * 2));
    }

    /**
     * Count the number of dice that have either pips or llama.
     * @param {number} pips 
     */
    countPips(pips) {
        if (pips < 1 || pips > 6)
            throw Error('Chi è lo sfigato che fa sta cosa')

        return Object.keys(p).map((k) => p[k]).flat().filter(d => (d===pips || d === 1)).length;
    }

    /**
     * @param {number} game_id 
     * @returns {boolean} If the player is still active
     */
    removeDie(game_id) {
        if (this._dice[game_id].length == 0) 
            throw Error('C\'è qualcosa che non va');

        this._active[game_id] = (this._dice[game_id].pop().length != 0)

        return this._active[game_id];
    }

    playerAfter(game_id) {
        return this._players[(this._order.indexOf(game_id) + 1) % this._order.length];
    }

    isActive(game_id) {
        return this._active[game_id];
    }

    isGameOver() {
        return Object.keys(this._active).map(gid => this._active[gid]).filter(a => a).length == 1;
    }

    findWinner() {
        // sanity check
        if (this.isGameOver())
            return this._players.find(p => this.isActive(p.gid)) 
        
    }

    getActivePlayerAfter(game_id) {
        let gid = playerAfter(game_id);
        let i;
        for (i = 0; i < this.players.length && !this.isActive(gid); i++) {
            gid = this.playerAfter(gid);
        }
        if (i == this.players.length) throw Error('Tutti i giocatori sono stati eliminati');
        return this._players[gid];
    }

    /**
     * @param {Player} player 
     */
    removePlayer(game_id) {
        this._dice[game_id] = [];
        this._active[game_id] = false;
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}
import app from '../src/app.js'
import io from 'socket.io-client'
import { TestScheduler } from 'jest';
import logger from '../src/logger.js';

const address = 'localhost';
const port = 8080;

let client1, client2;

/**
 * Setup WS & HTTP servers
 */
beforeAll((done) => {
  app.listen(address, port)
  done();
});

/**
 *  Cleanup WS & HTTP servers
 */
afterAll((done) => {
  app.io.close()
  app.server.close();
  done();
});


/**
 * Run before each test
 */
beforeEach((done) => {
  // Setup
  // Do not hardcode server port and address, square brackets are used for IPv6
  client1 = io.connect(`http://[${address}]:${port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  client2 = io.connect(`http://[${address}]:${port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  client1.on('connect', () => {
    client2.on('connect', () => {
      setTimeout(()=>{
        expect(app.state.playerCount()).toBe(2);
        expect(app.state.roomCount()).toBe(0);
        done();
      }, 100);
    })
  });
});

/**
 * Run after each test
 */
afterEach((done) => {
  // Cleanup
  if (client1.connected) {
    client1.disconnect();
  }
  if (client2.connected) {
    client2.disconnect();
  }
  setTimeout(() => {
    expect(app.state.playerCount()).toBe(0),
    expect(app.state.roomCount()).toBe(0),
    done();
  },100);
  //done();
});


describe('The room', () =>{
  test('should increase size when players join', (done) => {

    let callback = (room_id) => {
      try {
        expect(app.state.getRoom(room_id).size).toBe(1);
        client2.emit('JoinRoom', room_id, 'Tarello', (data) => {
          expect(app.state.getRoom(room_id).size).toBe(2);
          done();
        });
      } catch (error) {
        done(error);
      }
    };

    client1.emit('CreateRoom', 'Johnny', callback);
  })

  test('should decrease size when players leave', (done) => {

    let callback = (room_id) => {
      try {
        expect(app.state.getRoom(room_id).size).toBe(1);
        client2.emit('JoinRoom', room_id, 'Tarello', (data) => {
          expect(app.state.getRoom(room_id).size).toBe(2);
          client2.disconnect();

          setTimeout(() => {
            expect(app.state.getRoom(room_id).size).toBe(1);
            done()
          }, 50);
        });
      } catch (error) {
        done(error);
      }
    };

    client1.emit('CreateRoom', 'Johnny', callback);
  })

});


describe('The room owner', () => {

  test('should receive a list of usernames when they join the room', (done) => {

    let callback = (room_id) => {
      try {
        client1.on('JoinRoom', (data) => {
          expect(data).toEqual(expect.arrayContaining(['Johnny', 'Tarello']));
          done()
        })
        client2.emit('JoinRoom', room_id, 'Tarello', (data) => {});

      } catch (error) {
        done(error);
      }
    };

    client1.emit('CreateRoom', 'Johnny', callback);
  });

  test('should receive an array of username when joining a room', (done) => {

    let callback = (room_id) => {
      try {
        expect(room_id.length).toBe(6);
        client2.emit('JoinRoom', room_id, 'Tarello', (data) => {
          try {
            expect(data).toEqual(expect.arrayContaining(['Tarello', 'Johnny']))
            done();
          } catch (error) {
            done(error);
          }
        });

      } catch (error) {
        done(error);
      }
    };

    client1.emit('CreateRoom', 'Johnny', callback);
  });
});

describe('The second player', () => {

  test('should be able to join a room', (done) => {

    let callback = (room_id) => {
      try {
        expect(app.state.getPlayer(client1.id).username).toBe('Johnny');
        expect(app.state.playerCount()).toBe(2); //the user is already connected
        expect(app.state.roomCount()).toBe(1);
        expect(room_id.length).toBe(6);

        client2.emit('JoinRoom', room_id, 'Tarello', (data) => {
          try {
            expect(app.state.getPlayer(client2.id).username).toBe('Tarello');
            expect(app.state.playerCount()).toBe(2);
            expect(app.state.roomCount()).toBe(1);

            done();
          } catch (error) {
            done(error);
          }
        });

      } catch (error) {
        done(error);
      }
    };

    client1.emit('CreateRoom', 'Johnny', callback);
  });

  test('should receive an array of username when joining a room', (done) => {

    let callback = (room_id) => {
      try {
        expect(room_id.length).toBe(6);
        client2.emit('JoinRoom', room_id, 'Tarello', (data) => {
          try {
            expect(data).toEqual(expect.arrayContaining(['Tarello', 'Johnny']))
            done();
          } catch (error) {
            done(error);
          }
        });

      } catch (error) {
        done(error);
      }
    };

    client1.emit('CreateRoom', 'Johnny', callback);
  });
});
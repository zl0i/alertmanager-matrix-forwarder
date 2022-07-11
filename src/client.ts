import * as sdk from 'matrix-js-sdk';
import striptags from 'striptags';

let joinedRoomsCache = [];
let connection: sdk.MatrixClient = undefined

const client = {
  connection,
  ensureInRoom: async function (roomId) {
    if (joinedRoomsCache.indexOf(roomId === -1)) {
      try {
        const room = await this.connection.joinRoom(roomId);
        if (room) {
          joinedRoomsCache.push(room.roomId);
        }
      } catch (ex) {
        console.warn(`Could not join room ${roomId} - ${ex}`);
      }
    }
  },
  init: async function () {
    // Init Matrix client
    const client = sdk.createClient(process.env['MATRIX_HOMESERVER_URL']);

    await client.login("m.login.password", { "user": process.env['MATRIX_USER'], "password": process.env['MATRIX_PASSWORD'] })

    const token = client.getAccessToken()

    this.connection = sdk.createClient({
      baseUrl: process.env['MATRIX_HOMESERVER_URL'],
      accessToken: token,
      userId: process.env['MATRIX_USER']
      // roomConfigs
    })


    // Ensure in right rooms
    const rooms = await this.connection.getJoinedRooms();
    const joinedRooms = rooms.joined_rooms;
    const roomConfigs = process.env.MATRIX_ROOMS.split('|');
    roomConfigs.forEach(async (roomConfig) => {
      const room = roomConfig.split('/');
      if (joinedRooms.indexOf(room[1]) === -1) {
        await this.ensureInRoom(room[1]);
      }
    });
  },
  sendAlert: async function (roomId, alert) {
    // await this.ensureInRoom(roomId);
    return this.connection.sendEvent(
      roomId,
      'm.room.message',
      {
        body: striptags(alert),
        formatted_body: alert,
        msgtype: 'm.text',
        format: 'org.matrix.custom.html',
      },
      ''
    );
  },
};


export default client
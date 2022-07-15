import * as matrix from 'matrix-js-sdk';
import striptags from 'striptags';

const MATRIX_SERVER = process.env['MATRIX_HOMESERVER_URL']
const MATRIX_USER = process.env['MATRIX_USER']
const MATRIX_PASSWORD = process.env['MATRIX_PASSWORD']


class MatrixClient {

  private homeserver: string
  private user: string
  private password: string
  private connection: matrix.MatrixClient

  constructor(user: string, password: string, homeserver: string) {
    this.user = user
    this.password = password
    this.homeserver = homeserver
  }

  async login() {
    const client = matrix.createClient(this.homeserver);

    await client.login("m.login.password", { "user": this.user, "password": this.password })
    const token = client.getAccessToken()

    this.connection = matrix.createClient({
      baseUrl: this.homeserver,
      accessToken: token,
      userId: this.user
    })
  }

  async joinAllRooms() {
    const rooms = await this.connection.getJoinedRooms();
    console.log(rooms)
    const roomConfigs = process.env.MATRIX_ROOMS.split('|');
    roomConfigs.forEach(async (roomConfig) => {
      const room = roomConfig.split('/');
      if (rooms.indexOf(room[1]) === -1) {
        await this.joinRoom(room[1]);
      }
    });
  }

  async joinRoom(roomId: string) {
    try {
      const room = await this.connection.joinRoom(roomId);
    } catch (ex) {
      console.warn(`Could not join room ${roomId} - ${ex}`);
    }
  }

  async sendMessage(roomId: string, alert: any) {
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
  }
}

const client = new MatrixClient(MATRIX_USER, MATRIX_PASSWORD, MATRIX_SERVER)
export default client

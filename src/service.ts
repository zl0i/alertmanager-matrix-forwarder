import client from './client';
import * as utils from './utils';

export default class AlertService {


    static async sendAlers(data: any) {
        const alerts = utils.parseAlerts(data);

        if (!alerts) {
            throw new Error('no alerts found in payload')
        }

        const roomId = utils.getRoomForReceiver(data.receiver);
        if (!roomId) {
            throw new Error('no rooms configured for this receiver')
        }

        try {
            const promises = alerts.map((alert) => client.sendMessage(roomId, alert));
            await Promise.all(promises);
            return { result: 'ok' };
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            throw new Error('error')
        }
    }

}
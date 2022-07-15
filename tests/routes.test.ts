/* eslint-disable no-undef */
import chai from 'chai';
import sinon from 'sinon';
import client from '../src/client';
import fixtures from './fixtures';
import * as utils from '../src/utils';
import AlertService from '../src/service';

const expect = chai.expect;
require('dotenv').config({ path: '.env.default' });

describe('service', function () {

  describe('sendAlerts', function () {
    const clientStub = sinon.stub(client, "sendMessage").resolves()
    const req = {
      body: fixtures.alerts,
      query: {
        secret: process.env.APP_ALERTMANAGER_SECRET,
      },
    };

    it('calls client sendAlert for each alert', async () => {
      await AlertService.sendAlers(req.body)
      expect(clientStub.calledTwice).to.be.true;
    });

    it('calls parseAlerts', async () => {
      const parseStub = sinon.stub(utils, 'parseAlerts').returns([]);

      await AlertService.sendAlers(req.body)

      expect(parseStub.calledOnce).to.be.true;
      expect(parseStub.firstCall.args[0]).to.eql(fixtures.alerts);

      parseStub.restore();
    });

    it('returns ok', async () => {
      const result = await AlertService.sendAlers(req.body)

      expect(result).to.eql({ result: 'ok' });
    });

    afterEach(() => {
      clientStub.reset();
      sinon.reset();
    });
  });
});

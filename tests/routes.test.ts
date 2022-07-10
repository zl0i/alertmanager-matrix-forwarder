/* eslint-disable no-undef */
import chai from 'chai';
import sinon from 'sinon';
const client = require('../src/client').default;
import fixtures from './fixtures';
import * as routes from '../src/routes';
import * as utils from '../src/utils';

const expect = chai.expect;
require('dotenv').config({ path: '.env.default' });

describe('routes', function () {

  describe('getRoot', function () {
    it('waves', function () {
      let req = {};
      let res = {
        send: sinon.spy(),
      };
      routes.getRoot(req, res);

      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.equal('Hey 👋');
    });
  });

  describe('postAlerts', function () {
    // before(async () => {
    const clientStub = sinon.stub(client, 'sendAlert').returns(true);
    const req = {
      body: fixtures.alerts,
      query: {
        secret: process.env.APP_ALERTMANAGER_SECRET,
      },
    };
    const res = {
      json: sinon.spy(),
    };
    // });

    it('calls client sendAlert for each alert', () => {
      routes.postAlerts(req, res);

      expect(clientStub.calledTwice).to.be.true;
    });

    it('calls parseAlerts', () => {
      const parseStub = sinon.stub(utils, 'parseAlerts').returns([]);

      routes.postAlerts(req, res);

      expect(parseStub.calledOnce).to.be.true;
      expect(parseStub.firstCall.args[0]).to.eql(fixtures.alerts);

      parseStub.restore();
    });

    it('returns ok', async () => {
      await routes.postAlerts(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.eql({ result: 'ok' });
    });

    afterEach(() => {
      clientStub.reset();
      sinon.reset();
    });
  });
});

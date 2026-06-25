const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

process.env.ERRORBOT_URL = 'http://localhost';
process.env.ERRORBOT_INGEST_KEY = 'test-key';
process.env.ERRORBOT_TOKEN = 'test-token';
process.env.ERRORBOT_CHAT = 'test-chat';

const { formatReport } = require('../server.js');

describe('formatReport', () => {
  it('renders legacy council payloads with inferred terminal impact', () => {
    const text = formatReport({
      service: 'council-dev',
      level: 'ERROR',
      context: 'AudioSystem',
      message: '[CLIENT TERMINAL] Error generating audio',
      time: '2026-06-17T12:00:00.000Z',
      error: { name: 'TypeError', message: 'boom', stack: 'TypeError: boom\n    at AudioSystem.ts:1' },
    });

    assert.match(text, /🔴.*ERROR/s);
    assert.match(text, /Client session ended/);
    assert.match(text, /AudioSystem/);
    assert.match(text, /Error generating audio/);
    assert.match(text, /TypeError: boom/);
  });

  it('renders warning with notified impact', () => {
    const text = formatReport({
      service: 'council-prod',
      severity: 'warning',
      clientImpact: 'notified',
      source: 'server',
      context: 'meeting 42',
      message: 'Validation error for submit_human_message',
      time: '2026-06-17T12:00:00.000Z',
    });

    assert.match(text, /⚠️.*WARNING/s);
    assert.match(text, /Client notified/);
    assert.match(text, /meeting 42/);
  });

  it('escapes html in user-controlled message text', () => {
    const text = formatReport({
      level: 'ERROR',
      message: '<script>alert(1)</script>',
    });

    assert.doesNotMatch(text, /<script>/);
    assert.match(text, /&lt;script&gt;/);
  });
});

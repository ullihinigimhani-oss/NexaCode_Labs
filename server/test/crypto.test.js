import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  generateSixDigitOtp,
  hmacSha256,
  normalizeEmail,
  safeEqual,
  sha256,
} from '../src/utils/crypto.js';

describe('auth crypto helpers', () => {
  it('normalizes email addresses', () => {
    assert.equal(normalizeEmail('  Admin@NexaCodeLabs.Local '), 'admin@nexacodelabs.local');
  });

  it('creates deterministic sha256 hashes', () => {
    assert.equal(sha256('token'), sha256('token'));
    assert.notEqual(sha256('token'), sha256('different-token'));
  });

  it('creates keyed OTP hashes', () => {
    assert.equal(hmacSha256('123456', 'secret'), hmacSha256('123456', 'secret'));
    assert.notEqual(hmacSha256('123456', 'secret'), hmacSha256('654321', 'secret'));
  });

  it('generates six-digit OTP codes', () => {
    const otp = generateSixDigitOtp();
    assert.match(otp, /^\d{6}$/);
  });

  it('compares equal strings safely', () => {
    assert.equal(safeEqual('same', 'same'), true);
    assert.equal(safeEqual('same', 'different'), false);
  });
});

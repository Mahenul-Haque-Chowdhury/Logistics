import { describe, it, expect } from 'vitest';
import { mockTrackingEvents } from './data';

describe('mockTrackingEvents', () => {
  it('returns ordered tracking events for a tracking number', () => {
    const events = mockTrackingEvents('ABC123');
    expect(events.length).toBeGreaterThan(0);
    const ids = events.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

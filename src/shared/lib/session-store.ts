// In-memory session store for shuffled tarot decks
// Sessions auto-expire after 30 minutes
import { randomInt, randomBytes } from 'crypto';

interface ReadingSession {
  deck: number[];       // Shuffled array of card_ids
  category: string;     // LOVE, CAREER, GENERAL, etc.
  cardCount: number;    // 1 or 3
  createdAt: number;    // Date.now()
}

const SESSION_TTL = 30 * 60 * 1000; // 30 minutes
const sessions = new Map<string, ReadingSession>();

// Cleanup expired sessions periodically
function cleanup() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.createdAt > SESSION_TTL) {
      sessions.delete(id);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanup, 5 * 60 * 1000);
}

// Fisher-Yates shuffle with crypto-secure randomness
function fisherYatesShuffle(arr: number[]): number[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1); // crypto.randomInt: truly random
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateSessionId(): string {
  return `rs_${Date.now()}_${randomBytes(8).toString('hex')}`;
}

export function createSession(cardIds: number[], category: string, cardCount: number): string {
  cleanup(); // Clean old sessions before creating new one
  const id = generateSessionId();
  sessions.set(id, {
    deck: fisherYatesShuffle(cardIds),
    category,
    cardCount,
    createdAt: Date.now(),
  });
  return id;
}

export function getSession(id: string): ReadingSession | undefined {
  const session = sessions.get(id);
  if (!session) return undefined;
  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessions.delete(id);
    return undefined;
  }
  return session;
}

export function deleteSession(id: string): void {
  sessions.delete(id);
}

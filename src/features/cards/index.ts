// ============================================================
// Feature: Cards — Barrel Export
// ============================================================

// Data (hardcoded — sẽ chuyển sang DB sau)
export {
  tarotCards,
  getCardBySlug,
  getMajorArcana,
  getMinorBySuit,
  getRandomCards,
  getCombinationMeaning,
  type TarotCard,
} from './data/tarot-cards';

// Components
export { default as CardOfTheDay } from './components/CardOfTheDay';

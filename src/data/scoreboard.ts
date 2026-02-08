import { Difficulty } from "./gameTypes";

export interface ScoreEntry {
  playerName: string;
  score: number;
  accuracy: number;
  bestStreak: number;
  difficulty: Difficulty;
  date: string;
}

const STORAGE_KEY = "pylearn_scoreboard";
const MAX_ENTRIES = 10;

export function getScoreboard(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScore(entry: ScoreEntry): void {
  const board = getScoreboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board.slice(0, MAX_ENTRIES)));
}

export function removeScore(index: number): void {
  const board = getScoreboard();
  board.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}

export function clearScoreboard(): void {
  localStorage.removeItem(STORAGE_KEY);
}

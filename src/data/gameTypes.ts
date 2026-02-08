export type Difficulty = "beginner" | "intermediate" | "advanced";
export type QuestionType = "text" | "multiple-choice" | "code";

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  topic: string;
  question: string;
  choices?: string[];
  correctAnswer: string;
  hint: string;
  points: number;
  codeTemplate?: string;
  expectedOutput?: string;
}

export interface GameState {
  playerName: string;
  difficulty: Difficulty;
  currentQuestionIndex: number;
  score: number;
  streak: number;
  bestStreak: number;
  answers: { questionId: string; correct: boolean; answer: string }[];
  phase: "welcome" | "difficulty" | "playing" | "results";
}

export const initialGameState: GameState = {
  playerName: "",
  difficulty: "beginner",
  currentQuestionIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  answers: [],
  phase: "welcome",
};

export const POINTS = {
  beginner: { text: 10, "multiple-choice": 10, code: 20 },
  intermediate: { text: 15, "multiple-choice": 15, code: 30 },
  advanced: { text: 20, "multiple-choice": 20, code: 40 },
};

export const STREAK_BONUS = 5;

export const ENCOURAGEMENTS = [
  "🎉 Excellent work!",
  "🚀 You're on fire!",
  "💪 Keep it up!",
  "⭐ Brilliant!",
  "🧠 Big brain move!",
  "✨ Fantastic!",
  "🐍 Pythonic!",
  "🎯 Spot on!",
];

export const HINTS_ON_WRONG = [
  "💡 Not quite — try thinking about it differently!",
  "🔍 Close! Review the concept and try again.",
  "📚 Good attempt! Here's a hint to help you.",
  "🤔 Almost there! Let's look at this another way.",
];

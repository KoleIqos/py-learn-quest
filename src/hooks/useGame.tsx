import { useState, createContext, useContext, ReactNode } from "react";
import { GameState, initialGameState, Difficulty, POINTS, STREAK_BONUS } from "@/data/gameTypes";
import { Question } from "@/data/gameTypes";
import { getQuestionsForDifficulty } from "@/data/questions";

interface GameContextType {
  state: GameState;
  questions: Question[];
  currentQuestion: Question | null;
  setPlayerName: (name: string) => void;
  setDifficulty: (d: Difficulty) => void;
  startGame: () => void;
  submitAnswer: (answer: string, correct: boolean) => void;
  nextQuestion: () => void;
  resetGame: () => void;
  totalQuestions: number;
  progress: number;
  isGameOver: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialGameState);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);

  const currentQuestion = gameQuestions[state.currentQuestionIndex] ?? null;
  const totalQuestions = gameQuestions.length;
  const progress = totalQuestions > 0 ? (state.currentQuestionIndex / totalQuestions) * 100 : 0;
  const isGameOver = state.currentQuestionIndex >= totalQuestions && totalQuestions > 0;

  const setPlayerName = (name: string) =>
    setState((s) => ({ ...s, playerName: name }));

  const setDifficulty = (d: Difficulty) =>
    setState((s) => ({ ...s, difficulty: d }));

  const startGame = () => {
    const qs = getQuestionsForDifficulty(state.difficulty);
    setGameQuestions(qs);
    setState((s) => ({ ...s, phase: "playing", currentQuestionIndex: 0, score: 0, streak: 0, bestStreak: 0, answers: [] }));
  };

  const submitAnswer = (answer: string, correct: boolean) => {
    setState((s) => {
      const newStreak = correct ? s.streak + 1 : 0;
      const basePoints = correct
        ? POINTS[s.difficulty][currentQuestion?.type ?? "text"]
        : 0;
      const streakBonus = correct && newStreak >= 3 ? STREAK_BONUS : 0;

      return {
        ...s,
        score: s.score + basePoints + streakBonus,
        streak: newStreak,
        bestStreak: Math.max(s.bestStreak, newStreak),
        answers: [...s.answers, { questionId: currentQuestion?.id ?? "", correct, answer }],
      };
    });
  };

  const nextQuestion = () => {
    setState((s) => {
      const next = s.currentQuestionIndex + 1;
      if (next >= totalQuestions) {
        return { ...s, currentQuestionIndex: next, phase: "results" };
      }
      return { ...s, currentQuestionIndex: next };
    });
  };

  const resetGame = () => {
    setState(initialGameState);
    setGameQuestions([]);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        questions: gameQuestions,
        currentQuestion,
        setPlayerName,
        setDifficulty,
        startGame,
        submitAnswer,
        nextQuestion,
        resetGame,
        totalQuestions,
        progress,
        isGameOver,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

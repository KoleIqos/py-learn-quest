import { motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { Trophy, Target, Flame, RotateCcw, Star } from "lucide-react";
import { saveScore } from "@/data/scoreboard";
import { useEffect, useRef } from "react";

export default function ResultsScreen() {
  const { state, totalQuestions, resetGame } = useGame();
  const saved = useRef(false);

  const correct = state.answers.filter((a) => a.correct).length;
  const accuracy = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  useEffect(() => {
    if (!saved.current && totalQuestions > 0) {
      saved.current = true;
      saveScore({
        playerName: state.playerName,
        score: state.score,
        accuracy,
        bestStreak: state.bestStreak,
        difficulty: state.difficulty,
        date: new Date().toISOString(),
      });
    }
  }, []);

  const grade =
    accuracy >= 90 ? { label: "🏆 Master", color: "text-accent" } :
    accuracy >= 70 ? { label: "⭐ Great Job", color: "text-primary" } :
    accuracy >= 50 ? { label: "👍 Good Effort", color: "text-primary" } :
    { label: "📚 Keep Learning", color: "text-muted-foreground" };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
        >
          <Trophy className="h-12 w-12 text-primary" />
        </motion.div>

        <h2 className="mb-1 text-3xl font-bold text-foreground">Session Complete!</h2>
        <p className={`mb-8 text-xl font-semibold ${grade.color}`}>{grade.label}</p>

        <div className="mb-8 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-card p-4 border border-border">
            <Star className="mx-auto mb-2 h-6 w-6 text-xp" />
            <p className="text-2xl font-bold text-foreground">{state.score}</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          <div className="rounded-xl bg-card p-4 border border-border">
            <Target className="mx-auto mb-2 h-6 w-6 text-primary" />
            <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          <div className="rounded-xl bg-card p-4 border border-border">
            <Flame className="mx-auto mb-2 h-6 w-6 text-streak" />
            <p className="text-2xl font-bold text-foreground">{state.bestStreak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-border bg-card p-4 text-left">
          <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Difficulty</span>
              <span className="font-medium text-foreground capitalize">{state.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Questions</span>
              <span className="font-medium text-foreground">{totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Correct</span>
              <span className="font-medium text-success">{correct}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Incorrect</span>
              <span className="font-medium text-destructive">{totalQuestions - correct}</span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={resetGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground"
        >
          <RotateCcw className="h-5 w-5" />
          Play Again
        </motion.button>
      </motion.div>
    </div>
  );
}

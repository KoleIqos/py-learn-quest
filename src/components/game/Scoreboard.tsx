import { motion, AnimatePresence } from "framer-motion";
import { getScoreboard, ScoreEntry } from "@/data/scoreboard";
import { Trophy, Target, Flame, Crown } from "lucide-react";
import { useState } from "react";

export default function Scoreboard() {
  const [scores] = useState<ScoreEntry[]>(getScoreboard);

  if (scores.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 w-full max-w-md"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Crown className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-bold text-foreground">Scoreboard</h3>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2rem_1fr_4rem_3.5rem_3rem] gap-2 px-4 py-2.5 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span>#</span>
          <span>Player</span>
          <span className="text-right">Score</span>
          <span className="text-right">Acc</span>
          <span className="text-right">🔥</span>
        </div>

        {/* Rows */}
        <AnimatePresence>
          {scores.map((entry, i) => (
            <motion.div
              key={`${entry.playerName}-${entry.date}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`grid grid-cols-[2rem_1fr_4rem_3.5rem_3rem] gap-2 px-4 py-3 text-sm border-t border-border items-center ${
                i === 0 ? "bg-primary/5" : ""
              }`}
            >
              <span className={`font-bold ${i === 0 ? "text-accent" : "text-muted-foreground"}`}>
                {i + 1}
              </span>
              <div className="truncate">
                <span className="font-medium text-foreground">{entry.playerName}</span>
                <span className="ml-1.5 text-xs text-muted-foreground capitalize">{entry.difficulty}</span>
              </div>
              <span className="text-right font-semibold text-foreground">{entry.score}</span>
              <span className="text-right text-muted-foreground">{entry.accuracy}%</span>
              <span className="text-right text-muted-foreground">{entry.bestStreak}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

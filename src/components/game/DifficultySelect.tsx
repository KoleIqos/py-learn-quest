import { motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { Difficulty } from "@/data/gameTypes";
import { Sprout, Flame, Zap, ArrowRight } from "lucide-react";

const levels: { key: Difficulty; label: string; desc: string; icon: typeof Sprout; topics: string[] }[] = [
  {
    key: "beginner",
    label: "Beginner",
    desc: "Start from scratch",
    icon: Sprout,
    topics: ["Variables", "Data Types", "Print", "Input/Output"],
  },
  {
    key: "intermediate",
    label: "Intermediate",
    desc: "Level up your skills",
    icon: Flame,
    topics: ["Conditionals", "Loops", "Lists", "Functions"],
  },
  {
    key: "advanced",
    label: "Advanced",
    desc: "Challenge yourself",
    icon: Zap,
    topics: ["Recursion", "Algorithms", "Nested Loops", "Problem Solving"],
  },
];

const colorMap: Record<Difficulty, string> = {
  beginner: "border-level-beginner bg-level-beginner/10 text-level-beginner",
  intermediate: "border-level-intermediate bg-level-intermediate/10 text-level-intermediate",
  advanced: "border-level-advanced bg-level-advanced/10 text-level-advanced",
};

const selectedColorMap: Record<Difficulty, string> = {
  beginner: "border-level-beginner bg-level-beginner text-primary-foreground",
  intermediate: "border-level-intermediate bg-level-intermediate text-accent-foreground",
  advanced: "border-level-advanced bg-level-advanced text-destructive-foreground",
};

export default function DifficultySelect() {
  const { state, setDifficulty, startGame } = useGame();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <h2 className="mb-2 text-center text-3xl font-bold text-foreground">
          Welcome, <span className="text-primary">{state.playerName}</span>!
        </h2>
        <p className="mb-8 text-center text-muted-foreground">Choose your difficulty level</p>

        <div className="space-y-3">
          {levels.map((lvl, i) => {
            const selected = state.difficulty === lvl.key;
            const Icon = lvl.icon;
            return (
              <motion.button
                key={lvl.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setDifficulty(lvl.key)}
                className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                  selected ? selectedColorMap[lvl.key] : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${selected ? "bg-white/20" : colorMap[lvl.key]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${selected ? "" : "text-card-foreground"}`}>
                      {lvl.label}
                    </h3>
                    <p className={`text-sm ${selected ? "opacity-80" : "text-muted-foreground"}`}>{lvl.desc}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lvl.topics.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        selected ? "bg-white/20" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={startGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground"
        >
          Start Learning
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}

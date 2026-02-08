import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { Terminal, ArrowRight } from "lucide-react";
import Scoreboard from "./Scoreboard";

export default function WelcomeScreen() {
  const { setPlayerName, state } = useGame();
  const [name, setName] = useState(state.playerName);

  const handleContinue = () => {
    if (name.trim()) setPlayerName(name.trim());
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary"
          animate={{ boxShadow: ["0 0 0 0 hsl(162 63% 41% / 0.4)", "0 0 30px 10px hsl(162 63% 41% / 0.1)", "0 0 0 0 hsl(162 63% 41% / 0.4)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Terminal className="h-10 w-10 text-primary-foreground" />
        </motion.div>

        <h1 className="mb-2 text-5xl font-bold tracking-tight text-foreground">
          Py<span className="text-primary">Learn</span>
        </h1>
        <p className="mb-10 text-lg text-muted-foreground">
          Master Python through play
        </p>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              maxLength={30}
              className="w-full rounded-xl border border-border bg-card px-5 py-4 text-center text-lg font-medium text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <motion.button
            onClick={handleContinue}
            disabled={!name.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Learn variables, loops, functions & more
        </p>

        <Scoreboard />
      </motion.div>
    </div>
  );
}

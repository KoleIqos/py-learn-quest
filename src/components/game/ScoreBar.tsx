import { Trophy, Flame, Star } from "lucide-react";
import { useGame } from "@/hooks/useGame";

export default function ScoreBar() {
  const { state, progress, totalQuestions } = useGame();

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Star className="h-4 w-4 text-xp" />
            <span>{state.score}</span>
          </div>
          {state.streak >= 2 && (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-streak animate-streak-fire">
              <Flame className="h-4 w-4" />
              <span>{state.streak}x streak</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {state.currentQuestionIndex + 1}/{totalQuestions}
          </span>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

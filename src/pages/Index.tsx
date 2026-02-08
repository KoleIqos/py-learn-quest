import { GameProvider, useGame } from "@/hooks/useGame";
import WelcomeScreen from "@/components/game/WelcomeScreen";
import DifficultySelect from "@/components/game/DifficultySelect";
import QuestionCard from "@/components/game/QuestionCard";
import ScoreBar from "@/components/game/ScoreBar";
import ResultsScreen from "@/components/game/ResultsScreen";
import ThemeToggle from "@/components/game/ThemeToggle";

function GameRouter() {
  const { state } = useGame();

  if (!state.playerName) return <WelcomeScreen />;
  if (state.phase === "welcome" || state.phase === "difficulty") return <DifficultySelect />;
  if (state.phase === "results") return <ResultsScreen />;

  return (
    <div className="min-h-screen">
      <ScoreBar />
      <QuestionCard />
    </div>
  );
}

const Index = () => (
  <GameProvider>
    <ThemeToggle />
    <GameRouter />
  </GameProvider>
);

export default Index;

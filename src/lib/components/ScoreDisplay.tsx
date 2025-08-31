import { useScoringContext } from "../contexts/ScoringContext";

function ScoreDisplay() {
  const { scoring } = useScoringContext();

  return (
    <div className="fixed top-4 left-4 z-10 text-white font-mono">
      <div className="bg-black bg-opacity-50 p-4 rounded-lg backdrop-blur-sm">
        <div className="text-2xl font-bold mb-2">
          Score: {scoring.score.toLocaleString()}
        </div>
        <div className="text-lg mb-1">
          Streak: {scoring.streak}
        </div>
        <div className="text-sm mb-1">
          Multiplier: {scoring.multiplier}x
        </div>
        <div className="text-sm mb-1">
          Accuracy: {scoring.accuracy}%
        </div>
        <div className="text-xs text-gray-300">
          Max Streak: {scoring.maxStreak}
        </div>
      </div>
    </div>
  );
}

export default ScoreDisplay;
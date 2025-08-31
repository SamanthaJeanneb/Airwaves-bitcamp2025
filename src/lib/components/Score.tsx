import React from 'react';
import base from "../base";
import { useScoringContext } from "../contexts/ScoringContext";

type Props = {
  setScreen: React.Dispatch<React.SetStateAction<'menu' | 'game' | 'score' | 'demo'>>;
};

const Score = ({ setScreen }: Props) => {
  const { scoring, resetScoring } = useScoringContext();

  const handleBackToMenu = () => {
    resetScoring();
    setScreen('menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 flex items-center justify-center">
      <div className="text-center text-white p-8 bg-black bg-opacity-50 rounded-lg backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-4">Song Complete!</h1>
        
        <div className="mb-6">
          <div className="text-6xl font-bold text-yellow-400 mb-2">
            {scoring.score.toLocaleString()}
          </div>
          <div className="text-xl text-gray-300">Final Score</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-lg">
          <div className="bg-blue-600 bg-opacity-50 p-4 rounded">
            <div className="text-2xl font-bold">{scoring.accuracy}%</div>
            <div className="text-sm">Accuracy</div>
          </div>
          <div className="bg-green-600 bg-opacity-50 p-4 rounded">
            <div className="text-2xl font-bold">{scoring.maxStreak}</div>
            <div className="text-sm">Max Streak</div>
          </div>
          <div className="bg-purple-600 bg-opacity-50 p-4 rounded">
            <div className="text-2xl font-bold">{scoring.hitNotes}</div>
            <div className="text-sm">Notes Hit</div>
          </div>
          <div className="bg-red-600 bg-opacity-50 p-4 rounded">
            <div className="text-2xl font-bold">{scoring.totalNotes - scoring.hitNotes}</div>
            <div className="text-sm">Notes Missed</div>
          </div>
        </div>

        <img 
          src={`${base}/yourock.png`} 
          alt="You Rock" 
          className="w-72 mx-auto mb-6" 
        />
        
        <button 
          onClick={handleBackToMenu}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Score;
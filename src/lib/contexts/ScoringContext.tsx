import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction
} from "react";

type ScoringState = {
  score: number;
  streak: number;
  maxStreak: number;
  multiplier: number;
  totalNotes: number;
  hitNotes: number;
  accuracy: number;
};

type ScoringContextType = {
  scoring: ScoringState;
  setScoringState: Dispatch<SetStateAction<ScoringState>>;
  addHit: (noteValue?: number) => void;
  addMiss: () => void;
  resetScoring: () => void;
};

const initialScoringState: ScoringState = {
  score: 0,
  streak: 0,
  maxStreak: 0,
  multiplier: 1,
  totalNotes: 0,
  hitNotes: 0,
  accuracy: 100
};

export const ScoringContext = createContext<ScoringContextType | null>(null);

export const useScoringContext = () => {
  const context = useContext(ScoringContext);
  if (!context) {
    throw new Error("useScoringContext must be used within a ScoringProvider");
  }
  return context;
};

export const ScoringProvider = ({ children }: { children: ReactNode }) => {
  const [scoring, setScoringState] = useState<ScoringState>(initialScoringState);

  const calculateMultiplier = (streak: number): number => {
    if (streak >= 30) return 4;
    if (streak >= 20) return 3;
    if (streak >= 10) return 2;
    return 1;
  };

  const addHit = (noteValue: number = 50) => {
    setScoringState(prev => {
      const newStreak = prev.streak + 1;
      const newMultiplier = calculateMultiplier(newStreak);
      const points = noteValue * newMultiplier;
      const newHitNotes = prev.hitNotes + 1;
      const newTotalNotes = prev.totalNotes + 1;
      
      return {
        ...prev,
        score: prev.score + points,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        multiplier: newMultiplier,
        hitNotes: newHitNotes,
        totalNotes: newTotalNotes,
        accuracy: newTotalNotes > 0 ? Math.round((newHitNotes / newTotalNotes) * 100) : 100
      };
    });
  };

  const addMiss = () => {
    setScoringState(prev => ({
      ...prev,
      streak: 0,
      multiplier: 1,
      totalNotes: prev.totalNotes + 1,
      accuracy: prev.totalNotes + 1 > 0 ? Math.round((prev.hitNotes / (prev.totalNotes + 1)) * 100) : 100
    }));
  };

  const resetScoring = () => {
    setScoringState(initialScoringState);
  };

  return (
    <ScoringContext.Provider value={{ scoring, setScoringState, addHit, addMiss, resetScoring }}>
      {children}
    </ScoringContext.Provider>
  );
};
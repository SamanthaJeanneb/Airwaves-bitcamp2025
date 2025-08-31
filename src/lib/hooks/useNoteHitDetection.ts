import { useContext, useEffect, useRef } from "react";
import { TimePositionContext, useDistanceContext } from "../contexts";
import { useScoringContext } from "../contexts/ScoringContext";

const HIT_WINDOW = 150; // ms tolerance for hitting notes
const TILE_POSITIONS = [-4, -1.3, 1.3, 4]; // x positions of tiles
const DISTANCE_THRESHOLD = 0.05; // threshold for finger being "active"

export const useNoteHitDetection = (notes: ChartFile.Note[]) => {
  const [timePosition] = useContext(TimePositionContext);
  const [distances] = useDistanceContext();
  const { addHit, addMiss } = useScoringContext();
  const processedNotes = useRef(new Set<number>());

  useEffect(() => {
    if (!notes || distances.length === 0) return;

    // Get currently active fingers (distance < threshold)
    const activeFingers = distances.map(d => d < DISTANCE_THRESHOLD);

    // Find notes that are within the hit window
    const currentNotes = notes.filter(note => {
      const timeDiff = Math.abs(note.ms - timePosition);
      return timeDiff <= HIT_WINDOW && !processedNotes.current.has(note.point);
    });

    currentNotes.forEach(note => {
      // Check if any required frets are pressed
      const requiredFrets = note.notes.slice(0, 4); // Only check first 4 frets (excluding open notes)
      const hasRequiredFrets = requiredFrets.some((required, index) => 
        required && activeFingers[index]
      );

      // Check if note is within perfect hit timing (closer = better score)
      const timeDiff = Math.abs(note.ms - timePosition);
      const isWithinWindow = timeDiff <= HIT_WINDOW;

      if (isWithinWindow) {
        // Mark note as processed
        processedNotes.current.add(note.point);

        if (hasRequiredFrets) {
          // Calculate score based on timing accuracy
          let baseScore = 50;
          if (timeDiff <= 25) baseScore = 100; // Perfect
          else if (timeDiff <= 50) baseScore = 75; // Great
          else if (timeDiff <= 100) baseScore = 50; // Good
          else baseScore = 25; // OK

          addHit(baseScore);
        } else {
          addMiss();
        }
      }
    });

    // Clean up old processed notes to prevent memory leaks
    const cutoffTime = timePosition - HIT_WINDOW * 2;
    const notesToRemove = Array.from(processedNotes.current).filter(point => {
      const note = notes.find(n => n.point === point);
      return note && note.ms < cutoffTime;
    });
    notesToRemove.forEach(point => processedNotes.current.delete(point));

  }, [timePosition, distances, notes, addHit, addMiss]);

  return { processedNotes: processedNotes.current };
};
import { useEffect, useRef, useState } from "react";
import { TimePositionContext } from "../contexts";
import Note from "./Note";
import Tile from "./Tile";
import base from "../base";
import { parse } from "../ChartParser";
import HandTrackingCanvas from "./HandTrackingCanvas";
import { ScoringProvider } from "../contexts/ScoringContext";
import ScoreDisplay from "./ScoreDisplay";
import { useNoteHitDetection } from "../hooks/useNoteHitDetection";

function NotesContent(props: { 
  level: string; 
  onSongEnd?: () => void;
}) {
  const { level, onSongEnd } = props;

  const frametime = 16;
  const [timePosition, setTimePosition] = useState(0);
  const [loading, load] = useState(false);
  const [chart, setChart] = useState<ChartFile.Chart | null>(null);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const audio = new Audio();

  // Use hit detection hook
  useNoteHitDetection(chart?.notes.expert || []);
  const start = () => {
  // Check if song has ended
  useEffect(() => {
    if (!audio || !onSongEnd) return;
    
    const handleSongEnd = () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
      onSongEnd();
    };
    
    audio.addEventListener('ended', handleSongEnd);
    
    return () => {
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, [audio, onSongEnd]);
    load(true);

    Promise.all([
      // Get chart file
      new Promise<ChartFile.Chart>((resolve) => {
        fetch(`${base}/${level}/waves.chart`).then((r) => {
          r.text().then((text) => {
            const parsed = parse(text);
            resolve(parsed);
          });
        });
      }),
      // Get song file
      new Promise<HTMLAudioElement>((resolve) => {
        audio.src = `${base}/${level}/song.ogg`;
        audio.addEventListener("canplay", () => resolve(audio));
      })
    ])
      .then(([chart, audio]) => {
        load(false);
        setChart(chart);
        if (!audio || !chart) throw "Failed.";
        console.log({ audio, chart });

        interval.current = setInterval(() => {
          const ms = audio.currentTime * 1000;
          setTimePosition(ms);
        }, frametime);
        audio.addEventListener("timeupdate", () => {
          const ms = audio.currentTime * 1000;
          setTimePosition(ms);
        });
        audio.play();
      })
      .finally(() => {
        load(false);
      });
  };

  useEffect(start, [level]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
      audio.pause();
    };
  }, []);
  return (
    <>
      {!loading && (
        <>
          <ScoreDisplay />
          <TimePositionContext.Provider value={[timePosition, setTimePosition]}>
            {chart && (<HandTrackingCanvas />)}
            {chart &&
              chart.notes.expert?.map((note, k) => (
                <Note note={note} key={k} />
              ))}
          </TimePositionContext.Provider>
          <Tile name="indexFinger" color={0x54bed8} position={[-4, -1, 0]} />
          <Tile name="middleFinger" color={0xe15971} position={[-1.3, -1, 0]} />
          <Tile name="ringFinger" color={0xffe113} position={[1.3, -1, 0]} />
          <Tile name="pinky" color={0x8f48b7} position={[4, -1, 0]} />
        </>
      )}
    </>
  );
}

function Notes(props: { level: string }) {
  return (
    <ScoringProvider>
      <NotesContent 
        level={props.level} 
        onSongEnd={() => {
          // This will be handled by the parent App component
          // when the song ends, it should transition to score screen
        }} 
      />
    </ScoringProvider>
  );
}

export default Notes;

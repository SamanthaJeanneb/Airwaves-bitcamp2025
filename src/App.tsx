import { useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Notes from "./lib/components/Notes";
import Menu from "./lib/components/Menu.tsx";
import Game from "./lib/components/Game";
import Score from "./lib/components/Score.tsx";
import Demo from "./lib/components/Demo.tsx";
import { TipDistanceContext } from "./lib/contexts.ts";
import { ScoringProvider } from "./lib/contexts/ScoringContext";

// Audio instance to track song completion
let gameAudio: HTMLAudioElement | null = null;
function Lighting() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2}></ambientLight>
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    </>
  );
}

function Three() {
  useThree((state) => {
    state.camera.position.x = 0;
    state.camera.position.y = 3;
    state.camera.position.z = 5;

    // Lock camera angle to center
    const y = Math.atan2(state.camera.position.x, state.camera.position.z);
    const x = -1 * Math.atan2(state.camera.position.y, state.camera.position.z);
    state.camera.rotation.set(x, y, 0, "YXZ");
  });

  return <></>;
}

function App() {
  const [screen, setScreen] = useState<"menu" | "game" | "score" | "demo">(
    "menu"
  );
  const [level, setLevel] = useState<string | null>(null);
  const distanceState = useState<number[]>([]);

  // Handle song completion
  useEffect(() => {
    if (!level) return;
    
    // Create audio instance when level starts
    gameAudio = new Audio();
    gameAudio.addEventListener('ended', () => {
      setScreen('score');
    });
    
    return () => {
      if (gameAudio) {
        gameAudio.removeEventListener('ended', () => {});
        gameAudio = null;
      }
    };
  }, [level]);
  return (
    <div className="h-screen w-screen absolute top-0 left-0">
      <ScoringProvider>
        <TipDistanceContext.Provider value={distanceState}>
          {level ? (
            <Canvas>
              <Three />
              <Lighting />
              {level != undefined && <Notes level={level} />}
            </Canvas>
          ) : (
            <div className="App">
              {screen === "menu" && <Menu setScreen={setScreen} />}
              {screen === "game" && (
                <Game setScreen={setScreen} setLevel={setLevel} />
              )}
              {screen === "score" && (
                <Score setScreen={setScreen} />
              )}
              {screen === "demo" && <Demo setScreen={setScreen} />}
            </div>
          )}
        </TipDistanceContext.Provider>
      </ScoringProvider>
    </div>
  );
}

export default App;

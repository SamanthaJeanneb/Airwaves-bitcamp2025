import { ThreeElements } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { useDistanceContext } from "../contexts";
import HitEffect from "./HitEffect";

type Finger = "indexFinger" | "middleFinger" | "ringFinger" | "pinky";

function Tile(props: ThreeElements["mesh"] & { color: number; name: Finger }) {
  const { color, name } = props;
  const [distances] = useDistanceContext();
  const [isArrowKeyActive, setIsArrowKeyActive] = useState(false);
  const [showHitEffect, setShowHitEffect] = useState(false);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (name === "indexFinger") setIsArrowKeyActive(true);
          break;
        case "ArrowUp":
          if (name === "middleFinger") setIsArrowKeyActive(true);
          break;
        case "ArrowRight":
          if (name === "pinky") setIsArrowKeyActive(true); 
          break;
        case "ArrowDown":
          if (name === "ringFinger") setIsArrowKeyActive(true); 
          break;
        default:
          break;
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (name === "indexFinger") setIsArrowKeyActive(false);
          break;
        case "ArrowUp":
          if (name === "middleFinger") setIsArrowKeyActive(false);
          break;
        case "ArrowRight":
          if (name === "pinky") setIsArrowKeyActive(false); // Switched with pinky
          break;
        case "ArrowDown":
          if (name === "ringFinger") setIsArrowKeyActive(false); // Switched with ring finger
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [name]);

  const order = ["indexFinger", "middleFinger", "ringFinger", "pinky"]
  const isActive = distances[order.indexOf(name)] < 0.05 || isArrowKeyActive;

  // Trigger hit effect when tile becomes active
  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      setShowHitEffect(true);
    }
    wasActiveRef.current = isActive;
  }, [isActive]);
  return (
    <>
      <mesh {...props} scale={[1, isActive ? 0.8 : 1, 1]}>
        <boxGeometry args={[1.5, isActive ? 0.2 : 0.1, 1]} />
        <meshStandardMaterial
          color={isActive ? `#${color.toString(16)}` : "rgba(0,0,0)"}
          transparent={true}
        />
      </mesh>
      <HitEffect
        position={props.position}
        trigger={showHitEffect}
        color={color}
        onComplete={() => setShowHitEffect(false)}
      />
    </>
  );
}

export default Tile;

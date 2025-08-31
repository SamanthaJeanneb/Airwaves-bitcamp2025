import { ThreeElements } from "@react-three/fiber";
import { useContext, useEffect, useState, memo, useRef } from "react";
import { TimePositionContext } from "../contexts";
import { useScoringContext } from "../contexts/ScoringContext";

const settings = {
  noteSpeed: 5000,
  approachDistance: 100,
  fadeDistance: 40,
};

const SingleNote = memo(
  (props: ThreeElements["mesh"] & { color: number; fade: number }) => {
    return (
      <mesh {...props}>
        <sphereGeometry args={[0.5, 16, 16]} /> 
        <meshStandardMaterial
          color={props.color}
          opacity={props.fade}
          transparent={true}
        />
      </mesh>
    );
  }
);

function Note(props: { note: ChartFile.Note }) {
  const { note } = props;
  const [timePosition] = useContext(TimePositionContext);
  const { addMiss } = useScoringContext();
  const missedRef = useRef(false);

  const [z, setZ] = useState(0);
  const [fade, setFade] = useState(1);

  useEffect(() => {
    const z =
      -1 *
      settings.approachDistance *
      ((note.ms - timePosition) / settings.noteSpeed);
    // setFade(1 - Math.max(z - settings.fadeDistance, 0));
    setFade(1 - Math.max(z - settings.fadeDistance, 0) / settings.fadeDistance); 
    setZ(z);
  }, [note, timePosition]);

  // Check if note has passed without being hit
  useEffect(() => {
    const timeDiff = timePosition - note.ms;
    const HIT_WINDOW = 150;
    
    if (timeDiff > HIT_WINDOW && !missedRef.current) {
      // Note has passed the hit window without being processed
      missedRef.current = true;
      addMiss();
    }
  }, [timePosition, note.ms, addMiss]);
  return (
    <>
      {note.ms < timePosition + settings.noteSpeed && (
        <>
          {note.notes[0] && (
            <SingleNote color={0x54bed8} fade={fade} position={[-4, -1, z]} />
          )}
          {note.notes[1] && (
            <SingleNote color={0xe15971} fade={fade} position={[-1.3, -1, z]} />
          )}
          {note.notes[2] && (
            <SingleNote color={0xffe113} fade={fade} position={[1.3, -1, z]} />
          )}
          {note.notes[3] && (
            <SingleNote color={0x8f48b7} fade={fade} position={[4, -1, z]} />
          )}
        </>
      )}
    </>
  );
}

export default Note;

import { useState, useEffect } from "react";
import { ThreeElements } from "@react-three/fiber";

type HitEffectProps = ThreeElements["mesh"] & {
  trigger: boolean;
  color: number;
  onComplete?: () => void;
};

function HitEffect({ trigger, color, onComplete, ...props }: HitEffectProps) {
  const [scale, setScale] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (trigger) {
      setScale(0);
      setOpacity(1);
      
      const startTime = Date.now();
      const duration = 300; // 300ms animation
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Scale grows from 0 to 2
        setScale(progress * 2);
        // Opacity fades from 1 to 0
        setOpacity(1 - progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onComplete?.();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [trigger, onComplete]);

  if (!trigger || scale === 0) return null;

  return (
    <mesh {...props} scale={[scale, scale, scale]}>
      <ringGeometry args={[0.5, 1, 16]} />
      <meshBasicMaterial
        color={color}
        opacity={opacity}
        transparent={true}
      />
    </mesh>
  );
}

export default HitEffect;
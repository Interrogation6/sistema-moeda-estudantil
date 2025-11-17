import "../styles/background.css";
import { useMemo } from "react";

type Bubble = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
};

export function Background() {
  const bubbles = useMemo<Bubble[]>(() => {
    const quantidade = 50;
    const maxSize = 300;
    const minSize = 50;
    let delay = 0;

    return Array.from({ length: quantidade }).map((_, i) => {
      const size = minSize + Math.random() * (maxSize - minSize);
      const rot = (1 - (Math.random() * 2));
      delay++;
      if(delay > quantidade) delay = 0;
      return {
        id: i,
        left: Math.random() * 100,
        size,
        duration: 20 + Math.random() * 10,
        delay: delay/2,
        rotation: rot^2 * Math.sign(rot) * 180,
      };
    });
  }, []);

  return (
    <div
      className="
        pointer-events-none
        fixed inset-0
        -z-10
        overflow-hidden
        bg-linear-to-r
        from-slate-900/40
        via-slate-700/50
        to-slate-900/40
      "
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="
            absolute
            bottom-0
            border border-blue-500/10
            bg-slate-700/20
            bubble-anim
            shadow-xl/20
          "
          style={{
            left: `${b.left}vw`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            "--rot": `${b.rotation}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
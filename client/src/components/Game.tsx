import { useEffect, useRef } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { GameCanvas } from "./GameCanvas";
import { GameUI } from "./GameUI";
import { MainMenu } from "./MainMenu";

export function Game() {
  const { gamePhase, initializeGame } = useGameState();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Initialize audio
      const bgMusic = new Audio("/sounds/background.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.3;
      setBackgroundMusic(bgMusic);

      const hitAudio = new Audio("/sounds/hit.mp3");
      hitAudio.volume = 0.5;
      setHitSound(hitAudio);

      const successAudio = new Audio("/sounds/success.mp3");
      successAudio.volume = 0.7;
      setSuccessSound(successAudio);

      // Initialize game
      initializeGame();
      initialized.current = true;
    }
  }, [setBackgroundMusic, setHitSound, setSuccessSound, initializeGame]);

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      {gamePhase === "menu" && <MainMenu />}
      
      {(gamePhase === "playing" || gamePhase === "paused" || gamePhase === "level-complete") && (
        <>
          <GameCanvas />
          <GameUI />
        </>
      )}
    </div>
  );
}

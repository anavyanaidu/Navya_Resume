import { useEffect, useRef, useCallback } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { GameEngine } from "../lib/gameEngine";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number>();
  
  const { 
    gamePhase, 
    currentLevel, 
    level,
    playerPosition, 
    collectibles, 
    score, 
    lives,
    updatePlayerPosition, 
    collectItem, 
    completeLevel,
    loseLife,
    resetLevel 
  } = useGameState();
  
  const { playHit, playSuccess, isMuted } = useAudio();

  // Initialize game engine
  useEffect(() => {
    if (canvasRef.current && !gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(canvasRef.current);
      console.log("Game engine initialized");
    }
  }, []);

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!gameEngineRef.current || gamePhase !== "playing") return;

    const key = event.key.toLowerCase();
    console.log("Key pressed:", key);

    switch (key) {
      case "w":
      case "arrowup":
        gameEngineRef.current.movePlayer("up");
        break;
      case "s":
      case "arrowdown":
        gameEngineRef.current.movePlayer("down");
        break;
      case "a":
      case "arrowleft":
        gameEngineRef.current.movePlayer("left");
        break;
      case "d":
      case "arrowright":
        gameEngineRef.current.movePlayer("right");
        break;
      case " ":
        event.preventDefault();
        gameEngineRef.current.playerJump();
        break;
    }
  }, [gamePhase]);

  // Handle touch controls for mobile
  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    if (!gameEngineRef.current || gamePhase !== "playing") return;

    const touch = event.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50) {
        gameEngineRef.current.movePlayer("right");
      } else if (deltaX < -50) {
        gameEngineRef.current.movePlayer("left");
      }
    } else {
      if (deltaY > 50) {
        gameEngineRef.current.movePlayer("down");
      } else if (deltaY < -50) {
        gameEngineRef.current.movePlayer("up");
      }
    }
  }, [gamePhase]);

  // Setup event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [handleKeyDown, handleTouchStart]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameEngineRef.current || gamePhase !== "playing") return;

    const engine = gameEngineRef.current;
    engine.update();

    // Check for collectible collisions
    const playerCollisions = engine.checkCollectibleCollisions();
    playerCollisions.forEach(collectibleId => {
      collectItem(collectibleId);
      playSuccess();
    });

    // Check for hazard collisions
    if (engine.checkHazardCollision()) {
      loseLife();
      playHit();
      resetLevel();
    }

    // Check for level completion
    if (engine.checkLevelComplete()) {
      completeLevel();
      playSuccess();
    }

    // Update game state with new player position
    const newPosition = engine.getPlayerPosition();
    updatePlayerPosition(newPosition);

    engine.render();
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gamePhase, collectItem, playSuccess, loseLife, playHit, resetLevel, completeLevel, updatePlayerPosition]);

  // Start/stop game loop
  useEffect(() => {
    if (gamePhase === "playing") {
      gameLoop();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gamePhase, gameLoop]);

  // Update engine with current game state
  useEffect(() => {
    if (gameEngineRef.current && level) {
      gameEngineRef.current.setLevel(level);
      gameEngineRef.current.setCollectibles(collectibles);
      gameEngineRef.current.setPlayerPosition(playerPosition);
    }
  }, [level, collectibles, playerPosition]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && gameEngineRef.current) {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gameEngineRef.current.resize(canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full touch-none"
      style={{ touchAction: "none" }}
    />
  );
}

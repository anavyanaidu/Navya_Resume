import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { levels } from "../levels";

export type GamePhase = "menu" | "playing" | "paused" | "level-complete" | "game-over";

export interface Position {
  x: number;
  y: number;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  type: "gem" | "coin" | "key";
}

export interface Level {
  id: number;
  width: number;
  height: number;
  playerStart: Position;
  collectibles: Collectible[];
  hazards: Position[];
  platforms: { x: number; y: number; width: number; height: number }[];
  goal: Position;
}

interface GameState {
  // Game state
  gamePhase: GamePhase;
  currentLevel: number;
  score: number;
  lives: number;
  bestScore: number;
  
  // Player state
  playerPosition: Position;
  playerVelocity: Position;
  
  // Level state
  collectibles: Collectible[];
  level: Level | null;
  
  // Actions
  initializeGame: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  goToMenu: () => void;
  
  // Game mechanics
  updatePlayerPosition: (position: Position) => void;
  collectItem: (itemId: string) => void;
  completeLevel: () => void;
  loseLife: () => void;
  resetLevel: () => void;
  nextLevel: () => void;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gamePhase: "menu",
    currentLevel: 1,
    score: 0,
    lives: 3,
    bestScore: parseInt(localStorage.getItem("puzzleAdventureBestScore") || "0"),
    
    playerPosition: { x: 100, y: 400 },
    playerVelocity: { x: 0, y: 0 },
    
    collectibles: [],
    level: null,
    
    // Initialize game
    initializeGame: () => {
      const firstLevel = levels[0];
      if (firstLevel) {
        set({
          level: firstLevel,
          playerPosition: { ...firstLevel.playerStart },
          collectibles: firstLevel.collectibles.map(c => ({ ...c, collected: false })),
        });
      }
    },
    
    // Game flow actions
    startGame: () => {
      const firstLevel = levels[0];
      set({
        gamePhase: "playing",
        currentLevel: 1,
        score: 0,
        lives: 3,
        level: firstLevel,
        playerPosition: { ...firstLevel.playerStart },
        collectibles: firstLevel.collectibles.map(c => ({ ...c, collected: false })),
      });
    },
    
    pauseGame: () => {
      set({ gamePhase: "paused" });
    },
    
    resumeGame: () => {
      set({ gamePhase: "playing" });
    },
    
    restartGame: () => {
      const { currentLevel } = get();
      const level = levels[currentLevel - 1];
      if (level) {
        set({
          gamePhase: "playing",
          playerPosition: { ...level.playerStart },
          collectibles: level.collectibles.map(c => ({ ...c, collected: false })),
        });
      }
    },
    
    goToMenu: () => {
      set({ gamePhase: "menu" });
    },
    
    // Game mechanics
    updatePlayerPosition: (position: Position) => {
      set({ playerPosition: position });
    },
    
    collectItem: (itemId: string) => {
      set((state) => {
        const newCollectibles = state.collectibles.map(item =>
          item.id === itemId ? { ...item, collected: true } : item
        );
        
        // Calculate score based on item type
        const collectedItem = state.collectibles.find(item => item.id === itemId);
        let scoreIncrease = 0;
        if (collectedItem) {
          switch (collectedItem.type) {
            case "gem":
              scoreIncrease = 100;
              break;
            case "coin":
              scoreIncrease = 50;
              break;
            case "key":
              scoreIncrease = 200;
              break;
          }
        }
        
        return {
          collectibles: newCollectibles,
          score: state.score + scoreIncrease,
        };
      });
    },
    
    completeLevel: () => {
      const { score, bestScore, currentLevel } = get();
      
      // Update best score
      if (score > bestScore) {
        localStorage.setItem("puzzleAdventureBestScore", score.toString());
        set({ bestScore: score });
      }
      
      // Check if there's a next level
      if (currentLevel < levels.length) {
        set({ gamePhase: "level-complete" });
      } else {
        // Game completed
        set({ gamePhase: "menu" });
      }
    },
    
    loseLife: () => {
      set((state) => {
        const newLives = state.lives - 1;
        if (newLives <= 0) {
          return { lives: 0, gamePhase: "menu" };
        }
        return { lives: newLives };
      });
    },
    
    resetLevel: () => {
      const { currentLevel } = get();
      const level = levels[currentLevel - 1];
      if (level) {
        set({
          playerPosition: { ...level.playerStart },
          collectibles: level.collectibles.map(c => ({ ...c, collected: false })),
        });
      }
    },
    
    nextLevel: () => {
      const { currentLevel } = get();
      const nextLevelIndex = currentLevel;
      const nextLevel = levels[nextLevelIndex];
      
      if (nextLevel) {
        set({
          gamePhase: "playing",
          currentLevel: currentLevel + 1,
          level: nextLevel,
          playerPosition: { ...nextLevel.playerStart },
          collectibles: nextLevel.collectibles.map(c => ({ ...c, collected: false })),
        });
      } else {
        // No more levels, go to menu
        set({ gamePhase: "menu" });
      }
    },
  }))
);

import { Level } from "./stores/useGameState";

export const levels: Level[] = [
  // Level 1 - Tutorial
  {
    id: 1,
    width: 1200,
    height: 600,
    playerStart: { x: 50, y: 500 },
    collectibles: [
      { id: "coin1", x: 200, y: 450, collected: false, type: "coin" },
      { id: "coin2", x: 400, y: 350, collected: false, type: "coin" },
      { id: "gem1", x: 600, y: 250, collected: false, type: "gem" },
    ],
    hazards: [
      { x: 300, y: 520 },
      { x: 500, y: 520 },
    ],
    platforms: [
      { x: 150, y: 480, width: 100, height: 20 },
      { x: 350, y: 380, width: 100, height: 20 },
      { x: 550, y: 280, width: 100, height: 20 },
      { x: 750, y: 380, width: 100, height: 20 },
      { x: 0, y: 580, width: 1200, height: 20 }, // Ground
    ],
    goal: { x: 1100, y: 500 },
  },
  
  // Level 2 - More Complex
  {
    id: 2,
    width: 1600,
    height: 800,
    playerStart: { x: 50, y: 700 },
    collectibles: [
      { id: "coin3", x: 250, y: 650, collected: false, type: "coin" },
      { id: "key1", x: 450, y: 550, collected: false, type: "key" },
      { id: "gem2", x: 750, y: 350, collected: false, type: "gem" },
      { id: "coin4", x: 1000, y: 450, collected: false, type: "coin" },
      { id: "gem3", x: 1300, y: 250, collected: false, type: "gem" },
    ],
    hazards: [
      { x: 200, y: 720 },
      { x: 400, y: 720 },
      { x: 600, y: 620 },
      { x: 800, y: 520 },
      { x: 1100, y: 620 },
    ],
    platforms: [
      { x: 150, y: 680, width: 80, height: 20 },
      { x: 300, y: 620, width: 80, height: 20 },
      { x: 400, y: 580, width: 100, height: 20 },
      { x: 550, y: 520, width: 80, height: 20 },
      { x: 700, y: 380, width: 100, height: 20 },
      { x: 850, y: 480, width: 80, height: 20 },
      { x: 950, y: 480, width: 100, height: 20 },
      { x: 1100, y: 380, width: 80, height: 20 },
      { x: 1250, y: 280, width: 100, height: 20 },
      { x: 1400, y: 380, width: 100, height: 20 },
      { x: 0, y: 780, width: 1600, height: 20 }, // Ground
    ],
    goal: { x: 1500, y: 700 },
  },
  
  // Level 3 - Advanced
  {
    id: 3,
    width: 2000,
    height: 1000,
    playerStart: { x: 50, y: 900 },
    collectibles: [
      { id: "coin5", x: 200, y: 850, collected: false, type: "coin" },
      { id: "gem4", x: 400, y: 750, collected: false, type: "gem" },
      { id: "key2", x: 650, y: 650, collected: false, type: "key" },
      { id: "coin6", x: 900, y: 550, collected: false, type: "coin" },
      { id: "gem5", x: 1200, y: 450, collected: false, type: "gem" },
      { id: "coin7", x: 1500, y: 350, collected: false, type: "coin" },
      { id: "key3", x: 1750, y: 250, collected: false, type: "key" },
    ],
    hazards: [
      { x: 150, y: 920 },
      { x: 300, y: 920 },
      { x: 500, y: 820 },
      { x: 700, y: 720 },
      { x: 850, y: 620 },
      { x: 1000, y: 620 },
      { x: 1150, y: 520 },
      { x: 1350, y: 420 },
      { x: 1600, y: 320 },
      { x: 1800, y: 720 },
    ],
    platforms: [
      { x: 100, y: 880, width: 60, height: 20 },
      { x: 200, y: 820, width: 80, height: 20 },
      { x: 320, y: 780, width: 80, height: 20 },
      { x: 450, y: 720, width: 60, height: 20 },
      { x: 550, y: 680, width: 100, height: 20 },
      { x: 700, y: 620, width: 60, height: 20 },
      { x: 800, y: 580, width: 80, height: 20 },
      { x: 920, y: 520, width: 60, height: 20 },
      { x: 1050, y: 480, width: 100, height: 20 },
      { x: 1200, y: 420, width: 80, height: 20 },
      { x: 1320, y: 380, width: 60, height: 20 },
      { x: 1450, y: 320, width: 80, height: 20 },
      { x: 1580, y: 280, width: 100, height: 20 },
      { x: 1720, y: 220, width: 80, height: 20 },
      { x: 1850, y: 680, width: 100, height: 20 },
      { x: 0, y: 980, width: 2000, height: 20 }, // Ground
    ],
    goal: { x: 1900, y: 600 },
  },
];

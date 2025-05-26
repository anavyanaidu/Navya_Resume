import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Pause, Play, VolumeX, Volume2, RotateCcw } from "lucide-react";

export function GameUI() {
  const { 
    gamePhase, 
    currentLevel, 
    score, 
    lives, 
    collectibles,
    pauseGame, 
    resumeGame, 
    restartGame,
    goToMenu 
  } = useGameState();
  
  const { isMuted, toggleMute } = useAudio();

  const collectedCount = collectibles.filter(c => c.collected).length;
  const totalCount = collectibles.length;

  if (gamePhase === "level-complete") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
        <Card className="w-96 bg-gray-800 border-gray-600">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Level Complete!</h2>
            <p className="text-gray-300 mb-4">Score: {score}</p>
            <p className="text-gray-300 mb-6">Collectibles: {collectedCount}/{totalCount}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={restartGame} className="bg-blue-600 hover:bg-blue-700">
                Next Level
              </Button>
              <Button onClick={goToMenu} variant="outline" className="border-gray-600 text-gray-300">
                Main Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Game HUD */}
      <div className="absolute top-4 left-4 flex gap-4 z-10">
        <Card className="bg-gray-800 bg-opacity-90 border-gray-600">
          <CardContent className="p-3">
            <div className="text-white text-sm">
              <div>Level: {currentLevel}</div>
              <div>Score: {score}</div>
              <div>Lives: {lives}</div>
              <div>Items: {collectedCount}/{totalCount}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          onClick={isMuted ? toggleMute : toggleMute}
          variant="outline"
          size="sm"
          className="bg-gray-800 bg-opacity-90 border-gray-600 text-white hover:bg-gray-700"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        
        <Button
          onClick={gamePhase === "playing" ? pauseGame : resumeGame}
          variant="outline"
          size="sm"
          className="bg-gray-800 bg-opacity-90 border-gray-600 text-white hover:bg-gray-700"
        >
          {gamePhase === "playing" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button
          onClick={restartGame}
          variant="outline"
          size="sm"
          className="bg-gray-800 bg-opacity-90 border-gray-600 text-white hover:bg-gray-700"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile touch controls hint */}
      <div className="absolute bottom-4 left-4 right-4 text-center z-10 md:hidden">
        <Card className="bg-gray-800 bg-opacity-75 border-gray-600">
          <CardContent className="p-2">
            <p className="text-white text-xs">
              Touch screen to move • WASD or Arrow keys to move • Space to jump
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pause overlay */}
      {gamePhase === "paused" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
          <Card className="w-80 bg-gray-800 border-gray-600">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold text-white mb-6">Game Paused</h2>
              <div className="flex gap-3 justify-center">
                <Button onClick={resumeGame} className="bg-green-600 hover:bg-green-700">
                  Resume
                </Button>
                <Button onClick={restartGame} variant="outline" className="border-gray-600 text-gray-300">
                  Restart
                </Button>
                <Button onClick={goToMenu} variant="outline" className="border-gray-600 text-gray-300">
                  Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

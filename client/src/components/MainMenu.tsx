import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { VolumeX, Volume2, Play } from "lucide-react";

export function MainMenu() {
  const { startGame, bestScore } = useGameState();
  const { isMuted, toggleMute } = useAudio();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        {/* Game Title */}
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Puzzle Adventure
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Collect items, avoid hazards, and complete challenging levels!
        </p>

        {/* Main Menu Card */}
        <Card className="w-96 mx-auto bg-gray-800 bg-opacity-90 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Ready to Adventure?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={startGame} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Game
            </Button>
            
            {bestScore > 0 && (
              <div className="text-center text-gray-300">
                Best Score: {bestScore}
              </div>
            )}
            
            <div className="flex justify-center">
              <Button
                onClick={toggleMute}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {isMuted ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                {isMuted ? "Unmute" : "Mute"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="w-96 mx-auto mt-6 bg-gray-800 bg-opacity-90 border-gray-600">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3">How to Play</h3>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• Use WASD or Arrow keys to move</div>
              <div>• Press Space to jump</div>
              <div>• Collect all items to complete levels</div>
              <div>• Avoid red hazards</div>
              <div>• Touch screen on mobile to move</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

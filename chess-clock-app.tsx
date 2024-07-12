import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ChessClockApp = () => {
  const [player1Time, setPlayer1Time] = useState(300);
  const [player2Time, setPlayer2Time] = useState(300);
  const [activePlayer, setActivePlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameDuration, setGameDuration] = useState(5);
  const [increment, setIncrement] = useState(0);

  useEffect(() => {
    const newTime = gameDuration * 60;
    setPlayer1Time(newTime);
    setPlayer2Time(newTime);
  }, [gameDuration]);

  useEffect(() => {
    let interval;
    if (activePlayer && !gameOver) {
      interval = setInterval(() => {
        if (activePlayer === 1) {
          setPlayer1Time(prevTime => {
            if (prevTime <= 1) {
              clearInterval(interval);
              setGameOver(true);
              return 0;
            }
            return prevTime - 1;
          });
        } else {
          setPlayer2Time(prevTime => {
            if (prevTime <= 1) {
              clearInterval(interval);
              setGameOver(true);
              return 0;
            }
            return prevTime - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePlayer, gameOver]);

  const startGame = () => {
    setActivePlayer(1);
  };

  const switchPlayer = () => {
    if (activePlayer === 1) {
      setPlayer1Time(prevTime => prevTime + increment);
      setActivePlayer(2);
    } else {
      setPlayer2Time(prevTime => prevTime + increment);
      setActivePlayer(1);
    }
  };

  const resetGame = () => {
    const newTime = gameDuration * 60;
    setPlayer1Time(newTime);
    setPlayer2Time(newTime);
    setActivePlayer(null);
    setGameOver(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md border-4 border-yellow-400">
        <CardHeader>
          <CardTitle className="text-center">Chess Clock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Player 1</h2>
              <div className={`text-4xl font-mono ${activePlayer === 1 ? 'text-blue-600' : ''}`}>
                {formatTime(player1Time)}
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Player 2</h2>
              <div className={`text-4xl font-mono ${activePlayer === 2 ? 'text-blue-600' : ''}`}>
                {formatTime(player2Time)}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mb-4">
            <div>
              <Label htmlFor="game-duration">Game Duration</Label>
              <Select 
                onValueChange={(value) => setGameDuration(parseInt(value))}
                value={gameDuration.toString()}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="increment">Increment (seconds)</Label>
              <Select 
                onValueChange={(value) => setIncrement(parseInt(value))}
                value={increment.toString()}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select increment" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(11)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>{i} seconds</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            {!activePlayer && !gameOver && (
              <Button 
                onClick={startGame}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                Start Game
              </Button>
            )}
            {activePlayer && !gameOver && (
              <Button 
                onClick={switchPlayer}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                {activePlayer === 1 ? "Player 1 Move" : "Player 2 Move"}
              </Button>
            )}
            <Button 
              onClick={resetGame}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Reset
            </Button>
          </div>
          {gameOver && (
            <div className="text-center mt-4 text-xl font-bold text-red-600">
              Game Over! {player1Time === 0 ? "Player 2" : "Player 1"} wins!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChessClockApp;

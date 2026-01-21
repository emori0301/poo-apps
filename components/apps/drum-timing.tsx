"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

type GameState = "waiting" | "countdown" | "silence" | "ready" | "finished";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: {
            start?: number;
            autoplay?: number;
            controls?: number;
            rel?: number;
            modestbranding?: number;
          };
          events?: {
            onReady?: (event: { target: YT.Player }) => void;
            onStateChange?: (event: { data: number; target: YT.Player }) => void;
          };
        },
      ) => YT.Player;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function DrumTimingApp() {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [timeDiff, setTimeDiff] = useState<number | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const silenceStartTime = useRef<number | null>(null);
  const drumTime = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const drumHitTimeRef = useRef<number>(190);
  const videoStartTimeRef = useRef<number>(177);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
        return;
      }

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    };

    const initializePlayer = () => {
      if (playerRef.current) {
        setPlayerReady(true);
        return;
      }

      if (!playerContainerRef.current) {
        setTimeout(initializePlayer, 100);
        return;
      }

      const container = playerContainerRef.current;
      const containerId = container.id || "youtube-player-container";
      if (!container.id) {
        container.id = containerId;
      }

      try {
        const videoId = "3JWTaaS7LdU";
        const startTime = videoStartTimeRef.current;

        playerRef.current = new window.YT.Player(containerId, {
          videoId,
          playerVars: {
            start: startTime,
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            showinfo: 0,
          },
          events: {
            onReady: (event) => {
              setPlayerReady(true);
              event.target.pauseVideo();
            },
            onError: (event) => {
              console.error("YouTube player error:", event);
            },
          },
        });
      } catch (error) {
        console.error("Failed to initialize YouTube player:", error);
        setTimeout(initializePlayer, 1000);
      }
    };

    loadYouTubeAPI();

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      if (videoCheckIntervalRef.current) {
        clearInterval(videoCheckIntervalRef.current);
        videoCheckIntervalRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const startGame = useCallback(() => {
    if (!playerRef.current) {
      return;
    }

    if (!playerReady) {
      return;
    }

    try {
      const state = playerRef.current.getPlayerState();
      if (state === undefined || state === null) {
        return;
      }
    } catch (error) {
      return;
    }

    setGameState("countdown");
    setScore(null);
    setTimeDiff(null);
    setShowVideo(false);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          countdownIntervalRef.current = null;

          if (!playerRef.current) {
            return null;
          }

          const startTime = videoStartTimeRef.current;
          playerRef.current.seekTo(startTime, true);
          playerRef.current.playVideo();

          setGameState("silence");
          const videoStartRealTime = Date.now();
          silenceStartTime.current = videoStartRealTime;

          const targetTime = drumHitTimeRef.current;
          const timeUntilDrum = (targetTime - startTime) * 1000;

          setTimeout(() => {
            drumTime.current = Date.now();
            setGameState("ready");
          }, timeUntilDrum);

          return null;
        }
        return prev - 1;
      });
    }, 1000);

    countdownIntervalRef.current = countdownInterval;
  }, [playerReady]);

  const handleButtonClick = useCallback(() => {
    if (gameState === "waiting" || gameState === "countdown") {
      return;
    }

    if (gameState === "finished") {
      startGame();
      return;
    }

    if (gameState === "silence" || gameState === "ready") {
      if (silenceStartTime.current === null) {
        return;
      }

      const clickTime = Date.now();
      
      const videoStartTime = videoStartTimeRef.current;
      const targetTime = drumHitTimeRef.current;
      const timeUntilDrum = (targetTime - videoStartTime) * 1000;
      const expectedDrumTime = silenceStartTime.current + timeUntilDrum;
      const diff = clickTime - expectedDrumTime;
      const absDiff = Math.abs(diff);

      setShowVideo(true);
      setTimeDiff(diff);
      setScore(absDiff);
      setGameState("finished");

      if (bestScore === null || absDiff < bestScore) {
        setBestScore(absDiff);
        localStorage.setItem("drumTiming_bestScore", String(absDiff));
      }
    }
  }, [gameState, bestScore, startGame]);

  useEffect(() => {
    const stored = localStorage.getItem("drumTiming_bestScore");
    if (stored) {
      setBestScore(Number.parseInt(stored, 10));
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            I Will Always Love You ドラムタイミングゲーム
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="aspect-video w-full max-w-2xl mx-auto relative bg-black">
              <div
                ref={playerContainerRef}
                id="youtube-player-container"
                className="w-full h-full absolute inset-0 z-0"
              />
              {gameState !== "waiting" && !showVideo && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
                  {gameState === "countdown" && countdown !== null && (
                    <div className="text-8xl font-bold text-white">
                      {countdown}
                    </div>
                  )}
                  {gameState === "silence" && (
                    <div className="text-6xl animate-pulse text-white">...</div>
                  )}
                </div>
              )}
            </div>
            <p className="text-center text-muted-foreground">
              サビ前の無音の後に来るドラムの音に合わせてボタンを押してください
            </p>
          </div>
          <div className="text-center space-y-4">
            {gameState === "waiting" && (
              <div className="space-y-4">
                <p className="text-lg font-semibold">準備はできましたか？</p>
                <Button size="lg" onClick={startGame}>
                  ゲーム開始
                </Button>
              </div>
            )}

            {(gameState === "countdown" ||
              gameState === "silence" ||
              gameState === "ready" ||
              gameState === "finished") && (
              <div className="space-y-4">
                <button
                  onClick={handleButtonClick}
                  className={`
                    w-32 h-32 rounded-full
                    bg-gradient-to-b from-amber-600 to-amber-800
                    border-4 border-amber-900
                    shadow-2xl
                    active:scale-95
                    transition-all duration-100
                    hover:from-amber-500 hover:to-amber-700
                    focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-offset-2
                    ${gameState === "silence" || gameState === "ready" ? "animate-pulse" : ""}
                  `}
                  style={{
                    background: gameState === "silence" || gameState === "ready"
                      ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%), linear-gradient(to bottom, #d97706, #92400e)"
                      : "linear-gradient(to bottom, #d97706, #92400e)",
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="w-16 h-16 rounded-full bg-amber-900/50 border-2 border-amber-950" />
                  </div>
                </button>
              </div>
            )}

            {gameState === "finished" && score !== null && timeDiff !== null && (
              <div className="space-y-4">
                <div className="text-4xl font-bold">
                  ずれ: {score.toFixed(0)}ms
                </div>
                {timeDiff > 0 && (
                  <p className="text-lg text-blue-600">
                    {timeDiff.toFixed(0)}ms 遅れました
                  </p>
                )}
                {timeDiff < 0 && (
                  <p className="text-lg text-red-600">
                    {Math.abs(timeDiff).toFixed(0)}ms 早すぎました
                  </p>
                )}
                {timeDiff === 0 && (
                  <p className="text-lg text-green-600">完璧なタイミング！</p>
                )}
                {score < 50 && timeDiff !== 0 && (
                  <p className="text-lg text-green-600">完璧なタイミング！</p>
                )}
                {score >= 50 && score < 100 && (
                  <p className="text-lg text-blue-600">素晴らしい！</p>
                )}
                {score >= 100 && score < 200 && (
                  <p className="text-lg text-yellow-600">良いタイミング！</p>
                )}
                {score >= 200 && (
                  <p className="text-lg text-red-600">
                    もう少しタイミングを合わせましょう
                  </p>
                )}
              </div>
            )}

            {bestScore !== null && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  ベストスコア: {bestScore.toFixed(0)}ms
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


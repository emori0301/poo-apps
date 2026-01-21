"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
  "#F8B739",
  "#E74C3C",
];

export function ColorFlasherApp() {
  const [currentColor, setCurrentColor] = useState<string>(colors[0]);

  const handleClick = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    setCurrentColor(colors[randomIndex]);
  }, []);

  return (
    <div
      className="min-h-[60vh] flex items-center justify-center cursor-pointer transition-colors duration-300"
      style={{ backgroundColor: currentColor }}
      onClick={handleClick}
    >
      <Card className="bg-background/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-center">現在の色</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="w-full h-24 rounded-lg border-2 border-border"
              style={{ backgroundColor: currentColor }}
            />
            <p className="text-center font-mono text-sm">{currentColor}</p>
            <p className="text-center text-sm text-muted-foreground">
              画面をクリックして色を変更
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


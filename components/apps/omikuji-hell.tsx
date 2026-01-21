"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const omikujiResults = ["凶", "大凶", "超凶", "極凶", "絶凶"];

export function OmikujiHellApp() {
  const [result, setResult] = useState<string | null>(null);

  const handleDraw = () => {
    const randomIndex = Math.floor(Math.random() * omikujiResults.length);
    setResult(omikujiResults[randomIndex]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <Button
          size="lg"
          onClick={handleDraw}
          className="active:scale-95 transition-transform"
        >
          おみくじを引く
        </Button>
      </div>

      {result && (
        <Card className="border-2 border-destructive">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-destructive">
              {result}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              今日も最悪の一日になりそうです...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


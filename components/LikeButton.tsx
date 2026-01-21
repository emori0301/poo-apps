"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

export function LikeButton() {
  const [likeCount, setLikeCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pooApps_likeCount");
      if (stored) {
        setLikeCount(Number.parseInt(stored, 10));
      }
    }
  }, []);

  const handleLike = () => {
    if (typeof window === "undefined") {
      return;
    }
    const newCount = likeCount + 1;
    setLikeCount(newCount);
    localStorage.setItem("pooApps_likeCount", String(newCount));
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLike}
      className="flex items-center gap-2"
    >
      <Heart className="size-4" />
      <span>無限いいね</span>
      {likeCount > 0 && (
        <span className="text-sm text-muted-foreground">({likeCount})</span>
      )}
    </Button>
  );
}


"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function UselessButtonApp() {
  const handleClick = () => {
    toast.info("虚無です");
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Button
        size="lg"
        onClick={handleClick}
        className="active:scale-95 transition-transform"
      >
        押してください
      </Button>
    </div>
  );
}


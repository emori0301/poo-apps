"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setMounted(true);
    const stored = localStorage.getItem("pooApps_theme");
    const shouldBeDark = stored === "dark";
    setIsDark(shouldBeDark);
    const htmlElement = document.documentElement;
    if (shouldBeDark) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("pooApps_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("pooApps_theme", "light");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-lg font-bold"
          >
            pooApps
          </Button>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}


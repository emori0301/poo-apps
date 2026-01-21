"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { appsData } from "@/lib/appsData";
import { AppLayout } from "@/components/AppLayout";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  const handleCardClick = (appId: string) => {
    router.push(`/apps/${appId}`);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(236, 72, 153), rgb(168, 85, 247), rgb(99, 102, 241))",
            }}
          >
            pooApps
          </h1>
          <p className="text-muted-foreground">
            ジョークアプリ（クソアプリ）のアーカイブサイト
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appsData.map((app) => (
            <Card
              key={app.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              onClick={() => handleCardClick(app.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Image
                    src={app.iconPath}
                    alt={app.title}
                    width={150}
                    height={150}
                    className="rounded-lg"
                    unoptimized
                    priority={false}
                  />
                </div>
                <CardTitle className="text-center">{app.title}</CardTitle>
                <CardDescription className="text-center">
                  {app.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

import { notFound } from "next/navigation";
import { getAppDataById } from "@/lib/appsData";
import { UselessButtonApp } from "@/components/apps/useless-button";
import { OmikujiHellApp } from "@/components/apps/omikuji-hell";
import { ColorFlasherApp } from "@/components/apps/color-flasher";
import { DrumTimingApp } from "@/components/apps/drum-timing";
import { AppLayout } from "@/components/AppLayout";
import { LikeButton } from "@/components/LikeButton";

type PageProps = {
  params: Promise<{ "app-slug": string }>;
};

export default async function AppPage(props: PageProps) {
  const params = await props.params;
  const appData = getAppDataById(params["app-slug"]);

  if (!appData) {
    notFound();
  }

  const renderApp = () => {
    switch (appData.id) {
      case "useless-button":
        return <UselessButtonApp />;
      case "omikuji-hell":
        return <OmikujiHellApp />;
      case "color-flasher":
        return <ColorFlasherApp />;
      case "drum-timing":
        return <DrumTimingApp />;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{appData.title}</h1>
          <p className="text-muted-foreground">{appData.description}</p>
        </div>
        {renderApp()}
        <div className="flex justify-center pt-6">
          <LikeButton />
        </div>
      </div>
    </AppLayout>
  );
}


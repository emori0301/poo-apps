export type AppData = {
  id: string;
  title: string;
  description: string;
  iconPath: string;
};

export const appsData: AppData[] = [
  {
    id: "useless-button",
    title: "無駄ボタン",
    description: "押しても何も起こらないボタンです",
    iconPath: "https://placehold.co/150/FF6B6B/FFFFFF?text=Button",
  },
  {
    id: "omikuji-hell",
    title: "おみくじ地獄",
    description: "凶以上しか出ないおみくじです",
    iconPath: "https://placehold.co/150/8B4513/FFFFFF?text=凶",
  },
  {
    id: "color-flasher",
    title: "カラーフラッシャー",
    description: "クリックで背景色が変わるアプリです",
    iconPath: "https://placehold.co/150/FFD700/000000?text=Color",
  },
  {
    id: "drum-timing",
    title: "ドラムタイミングゲーム",
    description: "I Will Always Love Youのドラムに合わせてボタンを押すゲーム",
    iconPath: "https://placehold.co/150/9B59B6/FFFFFF?text=🎵",
  },
];

export function getAppDataById(id: string): AppData | undefined {
  return appsData.find((app) => app.id === id);
}


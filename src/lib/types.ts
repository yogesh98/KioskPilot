import { Record } from "pocketbase";

export type kiosk = Record & {
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  id: string;
  name: string;
  notes: string;
};

export type modules = {
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  id: string;
  icon: string;
  icon_text: string;
  metadata: Object;
  module: string;
  title: string;
  type: string;
};

export type MainScreenData = {
  collectionId: string;
  collectionName: string;
  created: string;
  kiosk: string;
  module: Array<modules>;
  id: string;
  updated: string;
};

export enum PanelTabKey {
  SEARCH = 'search',
  PINNED = 'pinned',
}

export interface PanelTab {
  label: string;
  value: PanelTabKey;
}

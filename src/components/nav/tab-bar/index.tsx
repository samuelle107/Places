import clsx from 'clsx';
import React, { type FC, StrictMode } from 'react';

export enum TabKey {
  SEARCH = 'search',
  PINNED = 'pinned',
}

interface Tab {
  label: string;
  value: TabKey;
}

const tabs: Tab[] = [
  {
    label: 'Search',
    value: TabKey.SEARCH,
  },
  {
    label: 'Pinned',
    value: TabKey.PINNED,
  },
];

interface Props {
  selectedTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const TabBar: FC<Props> = ({ onTabChange, selectedTab }) => {
  return (
    <StrictMode>
      <div className="flex px-5 gap-x-3 border-b border-gray-300 items-center">
        {tabs.map((tab) => (
          <button
            className={clsx(
              selectedTab === tab.value
                ? 'border-gray-800 text-gray-800'
                : ' border-transparent text-gray-400 hover:text-gray-500',

              'font-medium py-2 border-b-[3px] transition-colors'
            )}
            onClick={() => {
              onTabChange(tab.value);
            }}
            key={tab.value}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </StrictMode>
  );
};

export default TabBar;

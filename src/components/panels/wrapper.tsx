import clsx from 'clsx';
import React, { type ReactNode, type FC, StrictMode } from 'react';
import TabBar, { type TabKey } from '../nav/tab-bar';

interface Props {
  children: ReactNode;
  title: string;
  isOpen: boolean;

  className?: string;

  selectedTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const PanelWrapper: FC<Props> = ({
  children,
  className,
  title,
  isOpen,
  selectedTab,
  onTabChange,
}) => {
  return (
    <StrictMode>
      {isOpen && (
        <div
          id="panel-parent"
          className={clsx(
            className,
            'shadow-xl w-[480px] absolute z-20 left-0 top-0 bottom-0 flex flex-col max-h-full'
          )}
        >
          {/* <div className="h-[164px] flex-shrink-0 p-4 flex flex-col justify-end backdrop-blur-xl bg-black/5">
            <h1 className="text-white font-semibold text-3xl">{title}</h1>
          </div> */}

          <div className="flex-grow bg-white flex flex-col overflow-hidden">
            <TabBar selectedTab={selectedTab} onTabChange={onTabChange} />

            <div className="flex-grow overflow-hidden">
              <div className="max-h-full overflow-scroll">{children}</div>
            </div>
          </div>
        </div>
      )}
    </StrictMode>
  );
};

PanelWrapper.defaultProps = {
  className: '',
};

export default PanelWrapper;

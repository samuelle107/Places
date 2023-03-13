import React, {
  type Dispatch,
  type SetStateAction,
  type FC,
  useState,
  useMemo,
  useEffect,
} from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CollapsePanelButton: FC<Props> = ({ isOpen, setIsOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState(32);

  const buttonText = useMemo(() => {
    if (isOpen && isHovered) {
      return 'Show Full Map';
    } else if (isOpen) {
      return '';
    }

    return 'Show List';
  }, [isHovered, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setOffset(
        (document?.getElementById('panel-parent')?.clientWidth ?? 0) + 32
      );
    } else {
      setOffset(32);
      setIsHovered(false);
    }
  }, [isOpen]);

  return (
    <button
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={() => {
        setIsOpen((prev) => !prev);
      }}
      id="collapse-panel-button"
      className="absolute z-30 bg-light-gray px-4 py-2 rounded-full shadow-lg transition-all"
      style={{
        top: 32,
        left: offset,
      }}
    >
      <span className="font-medium">
        {isOpen ? '<' : '>'} {buttonText}
      </span>
    </button>
  );
};

export default CollapsePanelButton;

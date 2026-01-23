import { useState } from 'react';
import type { GlossaryTerm } from '../types';
import './GlossaryTooltip.css';

interface GlossaryTooltipProps {
  term: string;
  glossary: GlossaryTerm[];
  children: string;
}

export const GlossaryTooltip = ({ term, glossary, children }: GlossaryTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const glossaryItem = glossary.find(
    (item) => item.term.toLowerCase() === term.toLowerCase()
  );

  if (!glossaryItem) {
    return <>{children}</>;
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  return (
    <>
      <button
        type="button"
        className="glossary-term"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={`${term}: ${glossaryItem.definition}`}
      >
        {children}
      </button>
      {isVisible && (
        <span
          className="glossary-tooltip"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          role="tooltip"
          aria-live="polite"
        >
          <strong>{glossaryItem.term}:</strong> {glossaryItem.definition}
        </span>
      )}
    </>
  );
};

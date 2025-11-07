import { ComponentChildren } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { Css } from 'fluxio';
import { isArray } from 'fluxio';
import { isSearched } from 'fluxio';
import { ChevronDown } from 'lucide-react';

const FIELD_HEIGHT = 22;

const c = Css('Select', {
  '': {
    position: 'relative',
    col: ['stretch', 'start'],
    w: '100%',
    wMax: '100%',
  },
  Container: {
    position: 'absolute',
    inset: 0,
    row: 1,
    wh: '100%',
    border: 'g2',
    rounded: 3,
    bg: 'b0',
    cursor: 'pointer',
  },
  'Container:hover': {
    borderColor: 'p5',
    elevation: 1,
  },
  'Container:focus-within': {
    borderColor: 'p5',
    elevation: 1,
  },
  Input: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    hMin: FIELD_HEIGHT,
  },
  InputText: {
    position: 'absolute',
    xy: 0,
    row: ['center', 'start'],
    pl: 4,
  },
  Dropdown: {
    position: 'absolute',
    x: 0,
    y: '100%',
    w: '100%',
    mt: 2,
    bg: 'b1',
    fg: 't1',
    border: 'g2',
    borderTop: 'none',
    rounded: [0, 0, 4, 4],
    hMax: 100,
    overflowY: 'auto',
    zIndex: 1000,
    elevation: 2,
  },
  Option: {
    py: 4,
    px: 8,
    cursor: 'pointer',
    transition: 0.2,
  },
  'Option:hover': {
    bg: 'b2',
  },
  'Option-selected': {
    bg: 'p2',
    fg: 'p6',
  },
  'Option-highlighted': {
    bg: 'b2',
  },
  Arrow: {
    center: 1,
    w: 12,
    h: 12,
    opacity: 0.6,
    transition: 0.3,
    lineHeight: 1,
    pointerEvents: 'none',
    flexShrink: 0,
  },
  '-open &Arrow': {
    transform: 'rotate(180deg)',
  },
});

export interface SelectProps {
  class?: string;
  name?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  items?: ([string, ComponentChildren] | false | null | undefined)[];
  placeholder?: string;
  searchable?: boolean;
  props?: any;
}

export const Select = ({
  name,
  required,
  value = '',
  onChange,
  items = [],
  placeholder = 'Sélectionner...',
  searchable = true,
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const validItems = items.filter((item) => isArray(item)) as [string, ComponentChildren][];

  const filteredItems =
    searchable && search ?
      validItems.filter(
        ([key, label]) =>
          isSearched(key, search) || (typeof label === 'string' && isSearched(label, search))
      )
    : validItems;

  const selectedItem = validItems.find(([key]) => key === value);
  const displayValue = selectedItem ? selectedItem[1] : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.contains &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && searchable) {
      setSearch('');
    }
  };

  const handleInputChange = (e: Event) => {
    if (!searchable) return;
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearch('');
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
        if (!isOpen) setIsOpen(true);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
        if (!isOpen) setIsOpen(true);
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          handleOptionClick(filteredItems[highlightedIndex][0]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div ref={dropdownRef} {...props} {...c('', isOpen && `-open`, props)}>
      <div {...c('Container')} onClick={handleInputClick}>
        {searchable && isOpen ?
          <input
            ref={inputRef}
            {...c('Input')}
            name={name}
            required={required}
            value={search}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autocomplete="off"
            onClick={(e) => e.stopPropagation()}
          />
        : <div {...c('Input')} onKeyDown={handleKeyDown}>
            <div {...c('InputText')}>{displayValue || placeholder}</div>
            <input
              ref={inputRef}
              name={name}
              required={required}
              value={value || ''}
              style={{ display: 'none' }}
              tabIndex={-1}
            />
          </div>
        }
        <div {...c('Arrow')}>
          <ChevronDown />
        </div>
      </div>

      {isOpen && (
        <div {...c('Dropdown')}>
          {filteredItems.length === 0 ?
            <div {...c('Option')}>Aucun résultat</div>
          : filteredItems.map(([key, label], index) => (
              <div
                key={key}
                {...c(
                  `Option`,
                  key === value && `Option-selected`,
                  index === highlightedIndex && `Option-highlighted`
                )}
                onClick={() => handleOptionClick(key)}
              >
                {label}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

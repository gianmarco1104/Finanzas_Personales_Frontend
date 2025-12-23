import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './CustomDropdown.module.scss';

interface Option {
  value: string | number;
  label: string;
}

interface CustomDropdownProps {
  value: string | number;
  onChange: (value: any) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar',
  className,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);
  const labelToShow = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`${styles.container} ${className || 'w-full'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ''}`}
      >
        <span className={selectedOption ? styles.textSelected : styles.textPlaceholder}>{labelToShow}</span>

        <ChevronDown size={16} className={`${styles.icon} ${isOpen ? styles.iconRotate : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <ul className={styles.list}>
            {options.map((opt) => {
              const isSelected = opt.value === value;

              return (
                <li
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={14} className="text-indigo-600" />}
                </li>
              );
            })}

            {options.length === 0 && <li className={styles.emptyItem}>No hay opciones</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

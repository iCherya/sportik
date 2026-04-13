import React, { useEffect } from 'react';

import { useColors } from '../context/ThemeContext';
import { Space } from '../theme';

type Props = {
  value: string;
  onChange: (date: string) => void;
  error?: boolean;
  placeholder?: string;
};

const NativeInput = 'input' as unknown as React.ComponentType<
  React.InputHTMLAttributes<HTMLInputElement>
>;

const STYLE_ID = 'sportik-date-field';

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    .sportik-date::-webkit-calendar-picker-indicator {
      cursor: pointer;
      filter: invert(1) opacity(0.35);
    }
    .sportik-date[data-has-value="true"]::-webkit-calendar-picker-indicator {
      filter: invert(1) opacity(0.85);
    }
  `;
  document.head.appendChild(el);
}

export function DateField({ value, onChange, error, placeholder }: Props) {
  const colors = useColors();

  useEffect(injectStyles, []);

  return (
    <NativeInput
      type="date"
      className="sportik-date"
      data-has-value={value ? 'true' : 'false'}
      value={value}
      placeholder={placeholder}
      onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
      onChange={(e) => onChange((e as React.ChangeEvent<HTMLInputElement>).target.value)}
      style={
        {
          display: 'block',
          width: '100%',
          backgroundColor: colors.card,
          border: `1px solid ${error ? colors.heart : colors.border}`,
          borderRadius: Space.radius.md,
          padding: 14,
          color: value ? colors.text : colors.textDim,
          fontSize: 14,
          fontFamily: 'Inter',
          marginBottom: 10,
          boxSizing: 'border-box',
          cursor: 'pointer',
          outline: 'none',
          colorScheme: 'inherit',
        } as React.CSSProperties
      }
    />
  );
}

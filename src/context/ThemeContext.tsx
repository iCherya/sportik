import { createContext, useContext } from 'react';

import { type ColorPalette, getColors } from '../theme';

export const ThemeContext = createContext<boolean>(true); // true = dark
export const useIsDark = () => useContext(ThemeContext);
export const useColors = (): ColorPalette => getColors(useContext(ThemeContext));

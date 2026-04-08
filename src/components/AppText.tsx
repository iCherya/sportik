import { Text, type TextStyle } from 'react-native';

import { useColors } from '../context/ThemeContext';
import { Font } from '../theme';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

type Props = {
  children: React.ReactNode;
  size?: number;
  weight?: Weight;
  condensed?: boolean;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
  uppercase?: boolean;
};

function resolveFont(condensed: boolean, weight: Weight): string {
  if (condensed) {
    if (weight === 'black') return Font.condensedBlack;
    if (weight === 'extrabold') return Font.condensedBold;
    return Font.condensed; // bold, semibold, medium, regular → 700
  }
  if (weight === 'semibold' || weight === 'bold') return Font.bodySemiBold;
  if (weight === 'medium') return Font.bodyMedium;
  return Font.body;
}

export function AppText({
  children,
  size = 14,
  weight = 'regular',
  condensed = false,
  color,
  style,
  numberOfLines,
  uppercase = false,
}: Props) {
  const colors = useColors();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontFamily: resolveFont(condensed, weight),
          fontSize: size,
          color: color ?? colors.text,
          textTransform: uppercase ? 'uppercase' : undefined,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

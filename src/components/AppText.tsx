import { Text, type TextStyle } from 'react-native';

import { useColors } from '../context/ThemeContext';

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

function resolveFont(weight: Weight): string {
  if (weight === 'semibold' || weight === 'bold' || weight === 'extrabold' || weight === 'black')
    return 'InterBold';
  if (weight === 'medium') return 'InterMedium';
  return 'Inter';
}

export function AppText({
  children,
  size = 14,
  weight = 'regular',
  condensed: _condensed,
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
          fontFamily: resolveFont(weight),
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

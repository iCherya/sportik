import { Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold } from '@expo-google-fonts/barlow';
import {
  BarlowCondensed_700Bold,
  BarlowCondensed_800ExtraBold,
  BarlowCondensed_900Black,
} from '@expo-google-fonts/barlow-condensed';
import { useFonts } from 'expo-font';

export function useSportikFonts() {
  return useFonts({
    BarlowCondensed: BarlowCondensed_700Bold,
    BarlowCondensedBold: BarlowCondensed_800ExtraBold,
    BarlowCondensedBlack: BarlowCondensed_900Black,
    Barlow: Barlow_400Regular,
    BarlowMedium: Barlow_500Medium,
    BarlowSemiBold: Barlow_600SemiBold,
  });
}

import { BarlowCondensed_900Black } from '@expo-google-fonts/barlow-condensed';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';

export function useSportikFonts() {
  return useFonts({
    // Numeric inputs only
    BarlowCondensedBlack: BarlowCondensed_900Black,
    // All other text
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
  });
}

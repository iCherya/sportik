import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Overlay } from '../components/Overlay';
import { useColors } from '../context/ThemeContext';
import { useT } from '../i18n';
import { type ColorPalette } from '../theme';

type Props = {
  onBack: () => void;
};

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    container: { alignItems: 'center', paddingTop: 20 },
    phaseBadge: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 24,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 16,
      width: '100%',
    },
    featureDivider: {
      borderTopWidth: 1,
      borderTopColor: c.borderSub,
    },
    featuresCard: {
      width: '100%',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      overflow: 'hidden',
      marginTop: 24,
    },
  });

export function PlanOverlay({ onBack }: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const features = [
    'plans_soon_feat1' as const,
    'plans_soon_feat2' as const,
    'plans_soon_feat3' as const,
  ];

  return (
    <Overlay onBack={onBack} title={t('home_plans')} backLabel={t('nav_home')}>
      <View style={styles.container}>
        <View style={styles.phaseBadge}>
          <AppText
            condensed
            weight="bold"
            size={11}
            color={colors.textDim}
            uppercase
            style={{ letterSpacing: 1.5 }}>
            {t('plans_soon_badge')}
          </AppText>
        </View>

        <AppText size={52} style={{ marginBottom: 16 }}>
          📋
        </AppText>

        <AppText
          condensed
          weight="black"
          size={24}
          style={{ textAlign: 'center', marginBottom: 12, lineHeight: 28 }}>
          {t('plans_soon_title')}
        </AppText>

        <AppText
          size={14}
          color={colors.textMid}
          style={{ textAlign: 'center', lineHeight: 22, marginBottom: 4 }}>
          {t('plans_soon_sub')}
        </AppText>

        <View style={styles.featuresCard}>
          {features.map((k, i) => (
            <View key={k} style={[styles.featureRow, i > 0 && styles.featureDivider]}>
              <AppText size={14} color={colors.textMid}>
                {t(k)}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </Overlay>
  );
}

import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

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
    wordmarkSection: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingBottom: 32,
    },
    betaBadge: {
      marginTop: 16,
      backgroundColor: `${c.accent}22`,
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 8,
    },
    infoCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      overflow: 'hidden',
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 13,
      paddingHorizontal: 16,
    },
    madeRow: {
      paddingVertical: 13,
      paddingHorizontal: 16,
    },
    linkRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
    },
  });

export function AboutOverlay({ onBack }: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const infoRows = [
    { label: t('about_platform'), val: 'React Native' },
    { label: t('about_target'), val: 'iOS & Android' },
    { label: t('about_country'), val: '🇺🇦 Ukraine (v1)' },
    { label: t('about_units_row'), val: 'Metric (km, kg, °C)' },
    { label: t('about_data'), val: 'Stored locally, no sync' },
  ];

  const links = [t('about_privacy'), t('about_terms'), t('about_oss')];

  return (
    <Overlay onBack={onBack} title={t('about_title')} backLabel={t('nav_account')}>
      {/* Wordmark */}
      <View style={styles.wordmarkSection}>
        <AppText condensed weight="black" size={48} style={{ letterSpacing: 6 }}>
          SPORT
          <AppText condensed weight="black" size={48} color={colors.accent}>
            IK
          </AppText>
        </AppText>
        <AppText size={13} color={colors.textMid} style={{ marginTop: 6 }}>
          Version 1.0.0 · Build 2025.03
        </AppText>
        <View style={styles.betaBadge}>
          <AppText
            condensed
            weight="black"
            size={12}
            color={colors.accent}
            uppercase
            style={{ letterSpacing: 1 }}>
            {t('about_beta')}
          </AppText>
        </View>
      </View>

      {/* Info rows */}
      <View style={styles.infoCard}>
        {infoRows.map((r, i) => (
          <View
            key={r.label}
            style={[
              styles.infoRow,
              i < infoRows.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.borderSub,
              },
            ]}>
            <AppText weight="medium" size={13} color={colors.textMid}>
              {r.label}
            </AppText>
            <AppText weight="bold" size={13}>
              {r.val}
            </AppText>
          </View>
        ))}
        <View style={styles.madeRow}>
          <AppText size={13} color={colors.textMid}>
            {t('about_made')}
          </AppText>
        </View>
      </View>

      {/* Links */}
      {links.map((l) => (
        <Pressable key={l} style={styles.linkRow}>
          <AppText weight="medium" size={14}>
            {l}
          </AppText>
          <AppText size={14} color={colors.textDim}>
            ›
          </AppText>
        </Pressable>
      ))}
    </Overlay>
  );
}

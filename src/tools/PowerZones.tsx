import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type LangKey, useT } from '../i18n';
import { type ColorPalette } from '../theme';

const ZONES: { z: number; nameKey: LangKey; pct: [number, number]; color: string }[] = [
  { z: 1, nameKey: 'pz_z1', pct: [0, 55], color: '#4BEBA4' },
  { z: 2, nameKey: 'pz_z2', pct: [55, 75], color: '#3B9EFF' },
  { z: 3, nameKey: 'pz_z3', pct: [75, 90], color: '#E8FF47' },
  { z: 4, nameKey: 'pz_z4', pct: [90, 105], color: '#FF8B3B' },
  { z: 5, nameKey: 'pz_z5', pct: [105, 120], color: '#FF4F6A' },
  { z: 6, nameKey: 'pz_z6', pct: [120, 150], color: '#B57BFF' },
  { z: 7, nameKey: 'pz_z7', pct: [150, 999], color: '#FF2255' },
];

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    field: { marginBottom: 16 },
    fieldLabel: { letterSpacing: 2, marginBottom: 6 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    input: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 14,
      fontFamily: 'BarlowCondensedBlack',
      fontSize: 24,
      color: c.text,
      textAlign: 'center',
    },
    unit: {
      paddingHorizontal: 10,
      paddingVertical: 12,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
    },
    zonesCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 12,
    },
    zoneRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    footnote: { lineHeight: 16, textAlign: 'center' },
  });

export function PowerZones() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const t = useT();
  const [ftp, setFtp] = useState('245');
  const f = parseInt(ftp) || 0;

  return (
    <View>
      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase>
          {t('pz_ftp_label')}
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={ftp}
            onChangeText={setFtp}
            placeholder="245"
            placeholderTextColor={colors.textDim}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              W
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.zonesCard}>
        {ZONES.map((z, i) => {
          const lo = z.pct[0] === 0 ? 0 : Math.round((f * z.pct[0]) / 100);
          const hi = z.pct[1] === 999 ? t('pz_max') : Math.round((f * z.pct[1]) / 100);
          return (
            <View
              key={z.z}
              style={[
                styles.zoneRow,
                i < ZONES.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderSub,
                },
              ]}>
              <AppText condensed weight="black" size={16} color={z.color} style={{ width: 24 }}>
                Z{z.z}
              </AppText>
              <AppText weight="semibold" size={13} style={{ flex: 1 }}>
                {t(z.nameKey)}
              </AppText>
              <AppText condensed weight="bold" size={14} color={z.color}>
                {f > 0 ? `${lo}–${hi}` : '--'} W
              </AppText>
            </View>
          );
        })}
      </View>

      <AppText size={11} color={colors.textDim} style={styles.footnote}>
        {t('pz_hint')}
      </AppText>
    </View>
  );
}

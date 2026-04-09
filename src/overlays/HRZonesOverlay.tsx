import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Overlay } from '../components/Overlay';
import { useColors } from '../context/ThemeContext';
import { useT } from '../i18n';
import { type ColorPalette, Space } from '../theme';

type Props = {
  maxHR: string;
  hrMethod: string;
  onSave: (v: unknown) => void;
  onBack: () => void;
};

type ZoneDef = {
  z: number;
  nameKey: 'hr_z1' | 'hr_z2' | 'hr_z3' | 'hr_z4' | 'hr_z5';
  noteKey: 'hr_z1_note' | 'hr_z2_note' | 'hr_z3_note' | 'hr_z4_note' | 'hr_z5_note';
  pct: [number, number];
  color: string;
};

const ZONES: ZoneDef[] = [
  { z: 1, nameKey: 'hr_z1', noteKey: 'hr_z1_note', pct: [50, 60], color: '#4BEBA4' },
  { z: 2, nameKey: 'hr_z2', noteKey: 'hr_z2_note', pct: [60, 70], color: '#3B9EFF' },
  { z: 3, nameKey: 'hr_z3', noteKey: 'hr_z3_note', pct: [70, 80], color: '#E8FF47' },
  { z: 4, nameKey: 'hr_z4', noteKey: 'hr_z4_note', pct: [80, 90], color: '#FF8B3B' },
  { z: 5, nameKey: 'hr_z5', noteKey: 'hr_z5_note', pct: [90, 100], color: '#FF4F6A' },
];

type Override = { lo?: string; hi?: string };

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    section: {
      marginBottom: 16,
    },
    sectionLabel: {
      letterSpacing: 2,
      marginBottom: 8,
    },
    methodBtn: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 12,
      borderWidth: 1.5,
      alignItems: 'center',
    },
    bigInput: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 12,
      fontFamily: 'BarlowCondensedBlack',
      fontSize: 28,
      color: c.text,
      textAlign: 'center',
    },
    unitBadge: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 14,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
    },
    ageBtn: {
      flex: 1,
      paddingVertical: 6,
      paddingHorizontal: 2,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
    },
    zonesCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      overflow: 'hidden',
      marginBottom: 16,
    },
    zoneRow: {},
    zoneHeader: {
      padding: Space.screen - 4,
      paddingHorizontal: 16,
    },
    miniBarBg: {
      marginLeft: 34,
      height: 4,
      backgroundColor: c.surface,
      borderRadius: 2,
      overflow: 'hidden',
      marginTop: 6,
    },
    miniBarFill: {
      height: '100%',
      borderRadius: 2,
    },
    expandedPanel: {
      paddingHorizontal: 16,
      paddingBottom: 14,
    },
    zoneInput: {
      width: '100%',
      backgroundColor: c.surface,
      borderWidth: 1.5,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 8,
      fontFamily: 'BarlowCondensedBlack',
      fontSize: 20,
      color: c.text,
      textAlign: 'center',
    },
  });

export function HRZonesOverlay({ maxHR: initHR, hrMethod: initMethod, onSave, onBack }: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [maxHR, setMaxHR] = useState(initHR || '185');
  const [method, setMethod] = useState(initMethod || 'Max HR %');
  const [rhr, setRhr] = useState('52');
  const [overrides, setOverrides] = useState<Record<number, Override>>({});
  const [expanded, setExpanded] = useState<number | null>(null);

  const hr = parseInt(maxHR) || 0;
  const rh = parseInt(rhr) || 0;

  const calcAuto = (pct: number) =>
    method === 'HR Reserve'
      ? Math.round(rh + (hr - rh) * (pct / 100))
      : Math.round(hr * (pct / 100));

  const getZone = (z: ZoneDef) => {
    const ov = overrides[z.z];
    return {
      lo: ov?.lo ?? (hr > 0 ? String(calcAuto(z.pct[0])) : '--'),
      hi: ov?.hi ?? (hr > 0 ? String(calcAuto(z.pct[1])) : '--'),
      isManual: !!ov,
    };
  };

  const setOverride = (zNum: number, field: 'lo' | 'hi', val: string) => {
    setOverrides((o) => ({ ...o, [zNum]: { ...o[zNum], [field]: val.replace(/\D/g, '') } }));
  };

  const resetZone = (zNum: number) => {
    setOverrides((o) => {
      const n = { ...o };
      delete n[zNum];
      return n;
    });
  };

  const hasAnyOverride = Object.keys(overrides).length > 0;

  const badge = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <AppText size={15}>❤️</AppText>
      <AppText
        condensed
        weight="black"
        size={11}
        color={colors.heart}
        style={{ letterSpacing: 1.5 }}
        uppercase>
        {t('hr_title')}
      </AppText>
    </View>
  );

  return (
    <Overlay onBack={onBack} title={t('hr_title')} backLabel={t('nav_account')} badge={badge}>
      {/* Method */}
      <View style={styles.section}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase
          style={styles.sectionLabel}>
          {t('hr_method')}
        </AppText>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[
            { id: 'Max HR %', label: t('hrmethod_maxhr') },
            { id: 'HR Reserve', label: t('hrmethod_hrr') },
          ].map((m) => {
            const active = method === m.id;
            return (
              <Pressable
                key={m.id}
                style={[
                  styles.methodBtn,
                  { borderColor: active ? colors.heart : colors.border },
                  { backgroundColor: active ? `${colors.heart}18` : colors.card },
                ]}
                onPress={() => {
                  setMethod(m.id);
                  setOverrides({});
                }}>
                <AppText
                  weight="semibold"
                  size={13}
                  color={active ? colors.heart : colors.textMid}
                  style={{ textAlign: 'center' }}>
                  {m.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Max HR */}
      <View style={styles.section}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase
          style={styles.sectionLabel}>
          {t('hr_max')}
        </AppText>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
          <TextInput
            value={maxHR}
            onChangeText={(v) => {
              setMaxHR(v.replace(/\D/g, ''));
              setOverrides({});
            }}
            keyboardType="numeric"
            placeholder="185"
            placeholderTextColor={colors.textDim}
            style={styles.bigInput}
          />
          <View style={styles.unitBadge}>
            <AppText weight="semibold" size={13} color={colors.textMid}>
              {t('hrz_bpm')}
            </AppText>
          </View>
        </View>
        <AppText size={11} color={colors.textDim} style={{ marginBottom: 8 }}>
          {t('hr_estimate')}
        </AppText>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[
            { l: '25', v: '195' },
            { l: '30', v: '190' },
            { l: '35', v: '185' },
            { l: '40', v: '180' },
            { l: '45', v: '175' },
          ].map((p) => {
            const active = maxHR === p.v;
            return (
              <Pressable
                key={p.l}
                style={[
                  styles.ageBtn,
                  {
                    borderColor: active ? colors.heart : colors.border,
                    backgroundColor: active ? `${colors.heart}22` : colors.surface,
                  },
                ]}
                onPress={() => {
                  setMaxHR(p.v);
                  setOverrides({});
                }}>
                <AppText size={10} color={active ? colors.heart : colors.textDim}>
                  {p.l}
                </AppText>
                <AppText
                  condensed
                  weight="bold"
                  size={14}
                  color={active ? colors.heart : colors.textDim}>
                  {p.v}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Resting HR — HR Reserve only */}
      {method === 'HR Reserve' && (
        <View style={styles.section}>
          <AppText
            condensed
            weight="bold"
            size={11}
            color={colors.textDim}
            uppercase
            style={styles.sectionLabel}>
            {t('hr_resting')}
          </AppText>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              value={rhr}
              onChangeText={(v) => {
                setRhr(v.replace(/\D/g, ''));
                setOverrides({});
              }}
              keyboardType="numeric"
              placeholder="52"
              placeholderTextColor={colors.textDim}
              style={styles.bigInput}
            />
            <View style={styles.unitBadge}>
              <AppText weight="semibold" size={13} color={colors.textMid}>
                {t('hrz_bpm')}
              </AppText>
            </View>
          </View>
        </View>
      )}

      {/* Zone header */}
      <View
        style={[
          styles.section,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        ]}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase
          style={{ letterSpacing: 2 }}>
          {t('hrzo_zones')}
        </AppText>
        {hasAnyOverride && (
          <Pressable onPress={() => setOverrides({})}>
            <AppText size={11} color={colors.textDim} style={{ textDecorationLine: 'underline' }}>
              {t('hrzo_reset_all')}
            </AppText>
          </Pressable>
        )}
      </View>

      {/* Zones */}
      <View style={styles.zonesCard}>
        {ZONES.map((z) => {
          const { lo, hi, isManual } = getZone(z);
          const isOpen = expanded === z.z;

          return (
            <View
              key={z.z}
              style={[
                styles.zoneRow,
                z.z < 5 && { borderBottomWidth: 1, borderBottomColor: colors.borderSub },
              ]}>
              {/* Tappable header row */}
              <Pressable
                style={[styles.zoneHeader, isOpen && { backgroundColor: `${z.color}08` }]}
                onPress={() => setExpanded(isOpen ? null : z.z)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <AppText condensed weight="black" size={18} color={z.color} style={{ width: 24 }}>
                    Z{z.z}
                  </AppText>
                  <AppText weight="semibold" size={13} style={{ flex: 1 }}>
                    {t(z.nameKey)}
                  </AppText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {isManual && (
                      <View
                        style={{
                          backgroundColor: `${z.color}22`,
                          paddingHorizontal: 5,
                          paddingVertical: 2,
                          borderRadius: 4,
                        }}>
                        <AppText
                          condensed
                          weight="black"
                          size={9}
                          color={z.color}
                          uppercase
                          style={{ letterSpacing: 0.5 }}>
                          {t('hrzo_custom')}
                        </AppText>
                      </View>
                    )}
                    <AppText
                      condensed
                      weight="bold"
                      size={14}
                      color={isManual ? z.color : colors.text}>
                      {lo !== '--' ? `${lo}–${hi}` : '--'} {t('hrz_bpm')}
                    </AppText>
                    <AppText
                      size={12}
                      color={colors.textDim}
                      style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                      ▼
                    </AppText>
                  </View>
                </View>
                {/* Mini bar */}
                <View style={styles.miniBarBg}>
                  <View
                    style={[
                      styles.miniBarFill,
                      { width: `${z.pct[1]}%` as `${number}%`, backgroundColor: `${z.color}55` },
                    ]}
                  />
                </View>
              </Pressable>

              {/* Expanded edit panel */}
              {isOpen && (
                <View style={[styles.expandedPanel, { backgroundColor: `${z.color}06` }]}>
                  <AppText
                    size={11}
                    color={colors.textDim}
                    style={{ lineHeight: 18, marginBottom: 10 }}>
                    {t(z.noteKey)}
                  </AppText>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <AppText
                        condensed
                        weight="bold"
                        size={10}
                        color={colors.textDim}
                        uppercase
                        style={{ letterSpacing: 1.5, marginBottom: 4 }}>
                        {t('hrzo_from')}
                      </AppText>
                      <TextInput
                        value={overrides[z.z]?.lo ?? lo}
                        onChangeText={(v) => setOverride(z.z, 'lo', v)}
                        keyboardType="numeric"
                        placeholderTextColor={colors.textDim}
                        style={[
                          styles.zoneInput,
                          { borderColor: isManual ? z.color : colors.border },
                        ]}
                      />
                    </View>
                    <AppText size={18} color={colors.textDim} style={{ marginTop: 14 }}>
                      –
                    </AppText>
                    <View style={{ flex: 1 }}>
                      <AppText
                        condensed
                        weight="bold"
                        size={10}
                        color={colors.textDim}
                        uppercase
                        style={{ letterSpacing: 1.5, marginBottom: 4 }}>
                        {t('hrzo_to')}
                      </AppText>
                      <TextInput
                        value={overrides[z.z]?.hi ?? hi}
                        onChangeText={(v) => setOverride(z.z, 'hi', v)}
                        keyboardType="numeric"
                        placeholderTextColor={colors.textDim}
                        style={[
                          styles.zoneInput,
                          { borderColor: isManual ? z.color : colors.border },
                        ]}
                      />
                    </View>
                    <AppText size={13} color={colors.textDim} style={{ marginTop: 14 }}>
                      {t('hrz_bpm')}
                    </AppText>
                  </View>
                  {isManual && (
                    <Pressable onPress={() => resetZone(z.z)} style={{ marginTop: 8 }}>
                      <AppText
                        size={11}
                        color={colors.textDim}
                        style={{ textDecorationLine: 'underline' }}>
                        {t('hrzo_reset_auto')}
                      </AppText>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <Button
        label={t('hr_save')}
        variant="accent"
        onPress={() => onSave({ maxHR, hrMethod: method, zoneOverrides: overrides })}
        style={{ marginTop: 8 }}
      />
    </Overlay>
  );
}

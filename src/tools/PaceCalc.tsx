import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { useT } from '../i18n';
import { type ColorPalette, Sports, type SportKey } from '../theme';

const SPORTS: SportKey[] = ['run', 'bike', 'swim'];

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    segGroup: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    segBtn: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
    },
    field: { marginBottom: 14 },
    fieldLabel: { letterSpacing: 2, marginBottom: 6 },
    timeRow: { flexDirection: 'row', gap: 6 },
    stepperWrap: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      alignItems: 'center',
      overflow: 'hidden',
    },
    stepBtn: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: 6,
      backgroundColor: c.surface,
    },
    stepValue: {
      paddingVertical: 8,
      width: '100%',
      alignItems: 'center',
    },
    stepUnit: {
      paddingBottom: 10,
      paddingTop: 8,
    },
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
    resultBox: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 20,
      alignItems: 'center',
      marginBottom: 14,
    },
    infoBox: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      overflow: 'hidden',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
    },
  });

function Stepper({
  value,
  onChange,
  min,
  max,
  unit,
  color,
  styles,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
  color: string;
  styles: ReturnType<typeof makeStyles>;
}) {
  const colors = useColors();
  const [editing, setEditing] = useState('');
  const [focused, setFocused] = useState(false);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const commitEdit = () => {
    const parsed = parseInt(editing, 10);
    if (!isNaN(parsed)) onChange(clamp(parsed));
    setEditing('');
    setFocused(false);
  };

  return (
    <View style={styles.stepperWrap}>
      <Pressable style={styles.stepBtn} onPress={() => onChange(clamp(value + 1))}>
        <AppText size={14} color={colors.textMid}>▲</AppText>
      </Pressable>
      <View style={styles.stepValue}>
        <TextInput
          value={focused ? editing : String(value).padStart(2, '0')}
          onChangeText={setEditing}
          onFocus={() => { setEditing(String(value)); setFocused(true); }}
          onBlur={commitEdit}
          onSubmitEditing={commitEdit}
          keyboardType="number-pad"
          selectTextOnFocus
          style={{
            fontFamily: 'BarlowCondensedBlack',
            fontSize: 28,
            color,
            textAlign: 'center',
            width: '100%',
            paddingVertical: 4,
          }}
        />
      </View>
      <Pressable style={styles.stepBtn} onPress={() => onChange(clamp(value - 1))}>
        <AppText size={14} color={colors.textMid}>▼</AppText>
      </Pressable>
      <View style={styles.stepUnit}>
        <AppText size={11} color={colors.textDim} uppercase style={{ letterSpacing: 1 }}>
          {unit}
        </AppText>
      </View>
    </View>
  );
}

export function PaceCalc() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const t = useT();

  const [h, setH] = useState(0);
  const [m, setM] = useState(45);
  const [s, setS] = useState(0);
  const [dist, setDist] = useState('10');
  const [sport, setSport] = useState<SportKey>('run');
  const [paceMin, setPaceMin] = useState(4);
  const [paceSec, setPaceSec] = useState(30);
  const [lastEdited, setLastEdited] = useState<'time' | 'pace'>('time');

  const sp = Sports[sport];
  const d = parseFloat(dist) || 0;
  const dk = sport === 'swim' ? d / 10 : d;

  // Derived values depending on what was last edited
  let displayH = h, displayM = m, displayS = s;
  let displayPaceMin = paceMin, displayPaceSec = paceSec;

  if (lastEdited === 'time') {
    const totalS = h * 3600 + m * 60 + s;
    const pS = dk > 0 ? totalS / dk : 0;
    displayPaceMin = Math.floor(pS / 60);
    displayPaceSec = Math.round(pS % 60);
  } else {
    const paceTotal = paceMin * 60 + paceSec;
    const totalS = Math.round(paceTotal * dk);
    displayH = Math.floor(totalS / 3600);
    displayM = Math.floor((totalS % 3600) / 60);
    displayS = totalS % 60;
  }

  const handleTimeChange = (field: 'h' | 'm' | 's', val: number) => {
    if (field === 'h') setH(val);
    else if (field === 'm') setM(val);
    else setS(val);
    setLastEdited('time');
  };

  const handlePaceChange = (field: 'min' | 'sec', val: number) => {
    if (field === 'min') setPaceMin(val);
    else setPaceSec(val);
    setLastEdited('pace');
  };

  const speedKph =
    dk > 0 && (displayH * 3600 + displayM * 60 + displayS) > 0
      ? (dk / ((displayH * 3600 + displayM * 60 + displayS) / 3600)).toFixed(1)
      : '--';

  const marathonEquiv =
    dk > 0 && (displayPaceMin * 60 + displayPaceSec) > 0
      ? (() => {
          const total = Math.round((displayPaceMin * 60 + displayPaceSec) * 42.2);
          return `${Math.floor(total / 3600)}${t('unit_h')} ${Math.floor((total % 3600) / 60)}${t('unit_min')}`;
        })()
      : '--';

  return (
    <View>
      {/* Sport selector */}
      <View style={styles.segGroup}>
        {SPORTS.map((id) => {
          const active = sport === id;
          return (
            <Pressable
              key={id}
              style={[
                styles.segBtn,
                active && { borderColor: Sports[id].color, backgroundColor: `${Sports[id].color}18` },
              ]}
              onPress={() => setSport(id)}>
              <AppText size={13} weight="semibold" color={active ? Sports[id].color : colors.textMid}>
                {Sports[id].icon}{' '}
                {({ run: t('sport_run'), bike: t('sport_bike'), swim: t('sport_swim') } as Record<string, string>)[id]}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Time input */}
      <View style={styles.field}>
        <AppText style={styles.fieldLabel} condensed weight="bold" size={11} color={colors.textDim} uppercase>
          {t('tool_target_time')}
        </AppText>
        <View style={styles.timeRow}>
          <Stepper
            value={displayH}
            onChange={(v) => handleTimeChange('h', v)}
            min={0}
            max={23}
            unit={t('unit_h')}
            color={sp.color}
            styles={styles}
          />
          <Stepper
            value={displayM}
            onChange={(v) => handleTimeChange('m', v)}
            min={0}
            max={59}
            unit={t('unit_min')}
            color={sp.color}
            styles={styles}
          />
          <Stepper
            value={displayS}
            onChange={(v) => handleTimeChange('s', v)}
            min={0}
            max={59}
            unit={t('unit_sec')}
            color={sp.color}
            styles={styles}
          />
        </View>
      </View>

      {/* Distance input */}
      <View style={styles.field}>
        <AppText style={styles.fieldLabel} condensed weight="bold" size={11} color={colors.textDim} uppercase>
          {t('tool_distance')}
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={dist}
            onChangeText={(v) => { setDist(v); setLastEdited('time'); }}
            placeholder="10"
            placeholderTextColor={colors.textDim}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              {sport === 'swim' ? t('unit_x100m') : t('unit_km')}
            </AppText>
          </View>
        </View>
      </View>

      {/* Pace — adjustable */}
      <View style={styles.field}>
        <AppText style={styles.fieldLabel} condensed weight="bold" size={11} color={colors.textDim} uppercase>
          {t('pc_your_pace')}
        </AppText>
        <View style={[styles.timeRow, { maxWidth: 160 }]}>
          <Stepper
            value={displayPaceMin}
            onChange={(v) => handlePaceChange('min', v)}
            min={0}
            max={59}
            unit={t('unit_min')}
            color={sp.color}
            styles={styles}
          />
          <Stepper
            value={displayPaceSec}
            onChange={(v) => handlePaceChange('sec', v)}
            min={0}
            max={59}
            unit={t('unit_sec')}
            color={sp.color}
            styles={styles}
          />
        </View>
        <AppText size={11} color={colors.textDim} style={{ marginTop: 4 }}>
          {sport === 'swim' ? t('unit_per_100m') : t('unit_per_km')}
        </AppText>
      </View>

      {/* Info rows */}
      <View style={styles.infoBox}>
        {[
          [t('tool_speed_label'), `${speedKph} ${t('unit_kmh')}`],
          [t('pc_marathon'), marathonEquiv],
        ].map(([l, v]) => (
          <View key={l} style={styles.infoRow}>
            <AppText size={13} color={colors.textMid}>{l}</AppText>
            <AppText condensed weight="bold" size={14}>{v}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

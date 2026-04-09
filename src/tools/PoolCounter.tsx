import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { useT } from '../i18n';
import { type ColorPalette, Sports } from '../theme';

type Lap = { time: number; total: number };

type Swimmer = {
  id: number;
  name: string;
  laps: Lap[];
  running: boolean;
  startTime: number | null;
  elapsed: number;
  lapStart: number | null;
};

const makeSw = (id: number, name: string): Swimmer => ({
  id,
  name,
  laps: [],
  running: false,
  startTime: null,
  elapsed: 0,
  lapStart: null,
});

const fmtMs = (ms: number | null | undefined): string => {
  if (ms === null || ms === undefined) return '--:--.--';
  const s = Math.floor(ms / 1000);
  const mn = Math.floor(s / 60);
  const sc = s % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(mn).padStart(2, '0')}:${String(sc).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
};

const fmtShort = (ms: number): string => {
  if (!ms) return '--';
  const s = ms / 1000;
  const mn = Math.floor(s / 60);
  return mn > 0 ? `${mn}:${String(Math.floor(s % 60)).padStart(2, '0')}` : `${s.toFixed(1)}s`;
};

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    configRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
    fieldLabel: { letterSpacing: 2, marginBottom: 6 },
    segGroup: { flexDirection: 'row', gap: 6 },
    segBtn: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
    },
    inputRow: { flexDirection: 'row' },
    input: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 12,
      fontFamily: 'BarlowCondensedBlack',
      fontSize: 20,
      color: c.text,
      textAlign: 'center',
    },
    swTabRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
    swTab: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      position: 'relative',
    },
    swRemove: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addSwBtn: {
      width: 38,
      height: 38,
      borderRadius: 10,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    liveDisplay: { alignItems: 'center', paddingVertical: 8 },
    progressBg: {
      height: 5,
      backgroundColor: c.surface,
      borderRadius: 3,
      overflow: 'hidden',
      marginVertical: 8,
    },
    progressFill: { height: '100%', borderRadius: 3 },
    tapBtn: {
      backgroundColor: c.accent,
      paddingVertical: 20,
      borderRadius: 18,
      alignItems: 'center',
      marginBottom: 8,
    },
    ctrlRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
    ctrlBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
    },
    lapTable: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      overflow: 'hidden',
    },
    lapRow: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
    },
    lapCell: { flex: 1 },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.65)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: c.surface,
      borderRadius: 28,
      padding: 20,
      paddingBottom: 32,
    },
    modalHandle: {
      width: 36,
      height: 4,
      backgroundColor: c.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 18,
    },
    modalInput: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 14,
      fontFamily: 'Inter',
      fontSize: 16,
      color: c.text,
      marginBottom: 16,
    },
    modalBtns: { flexDirection: 'row', gap: 8 },
    modalCancelBtn: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
    },
    modalConfirmBtn: {
      flex: 2,
      paddingVertical: 13,
      borderRadius: 12,
      backgroundColor: c.accent,
      alignItems: 'center',
    },
  });

export function PoolCounter() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const t = useT();
  const [poolLen, setPoolLen] = useState('50');
  const [targetLaps, setTargetLaps] = useState('40');
  const [activeSw, setActiveSw] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [swimmers, setSwimmers] = useState<Swimmer[]>([makeSw(1, 'Lane 1')]);
  const [_tick, setTick] = useState(0);

  // 100ms ticker for live display
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(iv);
  }, []);

  const updSw = (idx: number, fn: (s: Swimmer) => Swimmer) =>
    setSwimmers((prev) => prev.map((s, i) => (i === idx ? fn(s) : s)));

  const getLiveElapsed = (sw: Swimmer) =>
    sw.running && sw.startTime !== null ? sw.elapsed + (Date.now() - sw.startTime) : sw.elapsed;

  const getLiveLap = (sw: Swimmer) =>
    sw.running && sw.lapStart !== null ? Date.now() - sw.lapStart : null;

  const handleTap = () => {
    const now = Date.now();
    updSw(activeSw, (sw) => {
      if (!sw.running) return { ...sw, running: true, startTime: now, lapStart: now };
      const lt = now - (sw.lapStart ?? now);
      const te = sw.elapsed + (now - (sw.startTime ?? now));
      return { ...sw, laps: [...sw.laps, { time: lt, total: te }], lapStart: now };
    });
  };

  const sw = swimmers[activeSw] ?? swimmers[0];
  const le = getLiveElapsed(sw);
  const ll = getLiveLap(sw);
  const lc = sw.laps.length;
  const dist = ((lc * parseInt(poolLen)) / 1000).toFixed(2);
  const tgt = parseInt(targetLaps) || 0;
  const pct = tgt > 0 ? Math.min((lc / tgt) * 100, 100) : 0;
  const bestLap = sw.laps.length > 0 ? Math.min(...sw.laps.map((l) => l.time)) : null;
  const avgLap = sw.laps.length > 0 ? sw.laps.reduce((a, l) => a + l.time, 0) / sw.laps.length : 0;

  const addSw = () => {
    if (!newName.trim()) return;
    setSwimmers((prev) => [...prev, makeSw(Date.now(), newName.trim())]);
    setActiveSw(swimmers.length);
    setNewName('');
    setShowModal(false);
  };

  const remSw = (idx: number) => {
    if (swimmers.length === 1) return;
    setSwimmers((prev) => prev.filter((_, i) => i !== idx));
    setActiveSw((prev) => Math.max(0, prev - (idx <= prev ? 1 : 0)));
  };

  return (
    <View>
      {/* Config row */}
      <View style={styles.configRow}>
        <View style={{ flex: 1 }}>
          <AppText
            style={styles.fieldLabel}
            condensed
            weight="bold"
            size={11}
            color={colors.textDim}
            uppercase>
            Pool
          </AppText>
          <View style={styles.segGroup}>
            {(['25', '50'] as const).map((v) => (
              <Pressable
                key={v}
                style={[
                  styles.segBtn,
                  poolLen === v && {
                    borderColor: Sports.swim.color,
                    backgroundColor: `${Sports.swim.color}18`,
                  },
                ]}
                onPress={() => setPoolLen(v)}>
                <AppText
                  size={13}
                  weight="semibold"
                  color={poolLen === v ? Sports.swim.color : colors.textMid}>
                  {v}m
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <AppText
            style={styles.fieldLabel}
            condensed
            weight="bold"
            size={11}
            color={colors.textDim}
            uppercase>
            {t('pool_target')}
          </AppText>
          <View style={styles.inputRow}>
            <TextInput
              value={targetLaps}
              onChangeText={setTargetLaps}
              placeholder="40"
              placeholderTextColor={colors.textDim}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>
      </View>

      {/* Swimmer tabs */}
      <AppText
        style={{ letterSpacing: 2, marginBottom: 6 }}
        condensed
        weight="bold"
        size={11}
        color={colors.textDim}
        uppercase>
        {t('pool_swimmers')}
      </AppText>
      <View style={styles.swTabRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {swimmers.map((s, i) => (
              <Pressable
                key={s.id}
                style={[
                  styles.swTab,
                  activeSw === i && {
                    borderColor: Sports.swim.color,
                    backgroundColor: `${Sports.swim.color}11`,
                  },
                ]}
                onPress={() => setActiveSw(i)}>
                {swimmers.length > 1 && (
                  <Pressable
                    style={styles.swRemove}
                    onPress={(e) => {
                      e.stopPropagation();
                      remSw(i);
                    }}>
                    <AppText size={10} color={colors.textDim}>
                      ×
                    </AppText>
                  </Pressable>
                )}
                <AppText
                  weight="semibold"
                  size={13}
                  color={activeSw === i ? Sports.swim.color : colors.textMid}>
                  {s.name}
                </AppText>
                <AppText condensed weight="black" size={18} color={Sports.swim.color}>
                  {`${s.laps.length} ${t('pool_laps')}`}
                </AppText>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <Pressable style={styles.addSwBtn} onPress={() => setShowModal(true)}>
          <AppText size={20} color={colors.textDim}>
            ＋
          </AppText>
        </Pressable>
      </View>

      {/* Live display */}
      <View style={styles.liveDisplay}>
        <AppText condensed weight="black" size={72} color={Sports.swim.color}>
          {lc}
        </AppText>
        <AppText size={14} color={colors.textMid}>
          {dist} km
        </AppText>
        <AppText condensed weight="bold" size={22} color={colors.text} style={{ marginTop: 4 }}>
          {fmtMs(le)}
        </AppText>
        <AppText size={12} color={colors.textDim} style={{ marginTop: 4 }}>
          {sw.running && ll !== null
            ? `${t('pool_current_lap')} ${fmtMs(ll)}`
            : lc > 0
              ? `${t('pool_last')} ${fmtMs(sw.laps[lc - 1].time)}`
              : 'Tap to start'}
        </AppText>
      </View>

      {/* Progress bar */}
      {tgt > 0 && (
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${pct}%` as `${number}%`,
                backgroundColor: lc >= tgt ? colors.accent : Sports.swim.color,
              },
            ]}
          />
        </View>
      )}

      {/* Main tap button */}
      <Pressable style={styles.tapBtn} onPress={handleTap}>
        <AppText
          condensed
          weight="black"
          size={18}
          color="#000"
          uppercase
          style={{ letterSpacing: 2 }}>
          {!sw.running && lc === 0
            ? t('pool_tap_start')
            : sw.running
              ? `${t('pool_col_lap')} ${lc + 1}  ▸  ${t('pool_tap_label')}`
              : t('pool_resume')}
        </AppText>
      </Pressable>

      {/* Pause / Resume / Undo / Reset */}
      <View style={styles.ctrlRow}>
        {sw.running ? (
          <Pressable
            style={styles.ctrlBtn}
            onPress={() => {
              const now = Date.now();
              updSw(activeSw, (s) => ({
                ...s,
                running: false,
                elapsed: s.elapsed + (now - (s.startTime ?? now)),
                startTime: null,
              }));
            }}>
            <AppText condensed weight="bold" size={14} color={colors.textMid}>
              {t('pool_pause')}
            </AppText>
          </Pressable>
        ) : lc > 0 ? (
          <Pressable
            style={styles.ctrlBtn}
            onPress={() => {
              const now = Date.now();
              updSw(activeSw, (s) => ({ ...s, running: true, startTime: now, lapStart: now }));
            }}>
            <AppText condensed weight="bold" size={14} color={colors.textMid}>
              {t('pool_unpause')}
            </AppText>
          </Pressable>
        ) : null}
        {lc > 0 && (
          <Pressable
            style={styles.ctrlBtn}
            onPress={() => updSw(activeSw, (s) => ({ ...s, laps: s.laps.slice(0, -1) }))}>
            <AppText condensed weight="bold" size={14} color={colors.textMid}>
              {t('pool_undo')}
            </AppText>
          </Pressable>
        )}
        {lc > 0 && (
          <Pressable
            style={[styles.ctrlBtn, { borderColor: `${colors.heart}33` }]}
            onPress={() =>
              updSw(activeSw, (s) => ({
                ...s,
                laps: [],
                running: false,
                startTime: null,
                elapsed: 0,
                lapStart: null,
              }))
            }>
            <AppText condensed weight="bold" size={14} color={colors.heart}>
              {t('pool_reset')}
            </AppText>
          </Pressable>
        )}
      </View>

      {/* Lap history */}
      {sw.laps.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <AppText
            condensed
            weight="bold"
            size={11}
            color={colors.textDim}
            uppercase
            style={{ letterSpacing: 2, marginBottom: 8 }}>
            {t('pool_history')}
          </AppText>
          <View style={styles.lapTable}>
            {/* Header */}
            <View style={[styles.lapRow, { backgroundColor: colors.surface }]}>
              {[
                t('pool_col_lap'),
                t('pool_col_time'),
                t('pool_col_total'),
                t('pool_col_delta'),
              ].map((h) => (
                <AppText
                  key={h}
                  condensed
                  weight="bold"
                  size={10}
                  color={colors.textDim}
                  uppercase
                  style={styles.lapCell}>
                  {h}
                </AppText>
              ))}
            </View>
            {[...sw.laps].reverse().map((lap, ri) => {
              const i = sw.laps.length - 1 - ri;
              const isBest = lap.time === bestLap;
              const delta = lap.time - avgLap;
              const ds =
                Math.abs(delta) < 500 ? '±0' : (delta < 0 ? '-' : '+') + fmtShort(Math.abs(delta));
              const deltaColor =
                Math.abs(delta) < 500
                  ? colors.textDim
                  : delta < 0
                    ? Sports.run.color
                    : colors.heart;
              return (
                <View
                  key={i}
                  style={[styles.lapRow, isBest && { backgroundColor: `${colors.accent}08` }]}>
                  <View
                    style={[
                      styles.lapCell,
                      { flexDirection: 'row', alignItems: 'center', gap: 4 },
                    ]}>
                    <AppText
                      condensed
                      weight="bold"
                      size={13}
                      color={isBest ? colors.accent : colors.text}>
                      {i + 1}
                    </AppText>
                    {isBest && (
                      <View
                        style={{
                          backgroundColor: `${colors.accent}22`,
                          paddingHorizontal: 4,
                          paddingVertical: 1,
                          borderRadius: 4,
                        }}>
                        <AppText size={9} color={colors.accent}>
                          ★
                        </AppText>
                      </View>
                    )}
                  </View>
                  <AppText
                    condensed
                    weight="bold"
                    size={13}
                    color={isBest ? colors.accent : colors.text}
                    style={styles.lapCell}>
                    {fmtMs(lap.time)}
                  </AppText>
                  <AppText condensed size={12} color={colors.textMid} style={styles.lapCell}>
                    {fmtMs(lap.total)}
                  </AppText>
                  <AppText
                    condensed
                    weight="bold"
                    size={12}
                    color={deltaColor}
                    style={styles.lapCell}>
                    {ds}
                  </AppText>
                </View>
              );
            })}
          </View>
          {bestLap && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 6,
                paddingHorizontal: 2,
              }}>
              <AppText size={11} color={colors.textDim}>
                {t('pool_best')}{' '}
                <AppText size={11} color={colors.accent} weight="bold">
                  {fmtMs(bestLap)}
                </AppText>
              </AppText>
              <AppText size={11} color={colors.textDim}>
                {t('pool_avg')} {fmtMs(avgLap)}
              </AppText>
            </View>
          )}
        </View>
      )}

      {/* Add swimmer modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <AppText condensed weight="black" size={22} style={{ marginBottom: 16 }}>
              {t('pool_add_swimmer')}
            </AppText>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder={t('pool_lane_ph')}
              placeholderTextColor={colors.textDim}
              style={styles.modalInput}
              autoFocus
              onSubmitEditing={addSw}
            />
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalCancelBtn} onPress={() => setShowModal(false)}>
                <AppText condensed weight="bold" size={14} color={colors.textMid}>
                  {t('cancel')}
                </AppText>
              </Pressable>
              <Pressable style={styles.modalConfirmBtn} onPress={addSw}>
                <AppText condensed weight="black" size={14} color="#000">
                  {t('pool_add_swimmer')}
                </AppText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

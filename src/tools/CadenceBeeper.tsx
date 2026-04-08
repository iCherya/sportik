import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Colors, Sports, type SportKey } from '../theme';

const PRESETS: Record<SportKey, number[]> = {
  run: [160, 170, 175, 180, 185, 190],
  bike: [75, 80, 85, 90, 95, 100],
  swim: [160, 170, 175, 180, 185, 190],
  tri: [160, 170, 175, 180, 185, 190],
  all: [160, 170, 175, 180, 185, 190],
};

const SPORT_OPTIONS: SportKey[] = ['run', 'bike'];

export function CadenceBeeper() {
  const [bpm, setBpm] = useState(85);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(false);
  const [sport, setSport] = useState<SportKey>('run');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const click = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setBeat(true);
    setTimeout(() => setBeat(false), 80);
  };

  useEffect(() => {
    if (playing) {
      click();
      intervalRef.current = setInterval(click, (60 / bpm) * 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, bpm, sport]);

  const presets = PRESETS[sport];
  const sp = Sports[sport];

  const minBpm = sport === 'run' ? 120 : 50;
  const maxBpm = sport === 'run' ? 220 : 130;

  const adjustBpm = (delta: number) => {
    setBpm((prev) => Math.min(maxBpm, Math.max(minBpm, prev + delta)));
  };

  return (
    <View>
      {/* Sport selector */}
      <View style={styles.segGroup}>
        {SPORT_OPTIONS.map((id) => {
          const active = sport === id;
          return (
            <Pressable
              key={id}
              style={[
                styles.segBtn,
                active && {
                  borderColor: Sports[id].color,
                  backgroundColor: `${Sports[id].color}18`,
                },
              ]}
              onPress={() => {
                setSport(id);
                setPlaying(false);
                setBpm(id === 'run' ? 175 : 85);
              }}>
              <AppText
                size={13}
                weight="semibold"
                color={active ? Sports[id].color : Colors.textMid}>
                {Sports[id].icon} {Sports[id].label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* BPM display */}
      <View style={styles.bpmDisplay}>
        <AppText condensed weight="black" size={72} color={Colors.text}>
          {bpm}
        </AppText>
        <AppText size={14} color={Colors.textMid}>
          BPM
        </AppText>
      </View>

      {/* Beat indicator */}
      <View style={styles.beatOuter}>
        <View
          style={[
            styles.beatDot,
            {
              backgroundColor: playing && beat ? sp.color : `${sp.color}33`,
              transform: [{ scale: playing && beat ? 1.2 : 1 }],
            },
          ]}
        />
      </View>

      {/* +/- BPM controls */}
      <View style={styles.bpmControls}>
        <Pressable style={styles.bpmBtn} onPress={() => adjustBpm(-5)}>
          <AppText condensed weight="black" size={20} color={Colors.textMid}>
            −5
          </AppText>
        </Pressable>
        <Pressable style={styles.bpmBtn} onPress={() => adjustBpm(-1)}>
          <AppText condensed weight="black" size={20} color={Colors.textMid}>
            −1
          </AppText>
        </Pressable>
        <Pressable style={styles.bpmBtn} onPress={() => adjustBpm(1)}>
          <AppText condensed weight="black" size={20} color={Colors.textMid}>
            +1
          </AppText>
        </Pressable>
        <Pressable style={styles.bpmBtn} onPress={() => adjustBpm(5)}>
          <AppText condensed weight="black" size={20} color={Colors.textMid}>
            +5
          </AppText>
        </Pressable>
      </View>

      {/* Play / Stop */}
      <Pressable
        style={[styles.playBtn, { backgroundColor: playing ? Colors.heart : Colors.accent }]}
        onPress={() => setPlaying((p) => !p)}>
        <AppText
          condensed
          weight="black"
          size={16}
          color={playing ? '#fff' : '#000'}
          uppercase
          style={{ letterSpacing: 1 }}>
          {playing ? '⏹  Stop Beeper' : '▶  Start Beeper'}
        </AppText>
      </Pressable>

      {/* Presets */}
      <View style={styles.presets}>
        {presets.map((v) => {
          const active = bpm === v;
          return (
            <Pressable
              key={v}
              style={[
                styles.preset,
                active && { borderColor: sp.color, backgroundColor: `${sp.color}22` },
              ]}
              onPress={() => setBpm(v)}>
              <AppText condensed weight="bold" size={13} color={active ? sp.color : Colors.textDim}>
                {v}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  segGroup: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  segBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  bpmDisplay: { alignItems: 'center', marginVertical: 8 },
  beatOuter: { alignItems: 'center', marginBottom: 16 },
  beatDot: { width: 20, height: 20, borderRadius: 10 },
  bpmControls: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  bpmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  playBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  presets: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  preset: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    minWidth: '14%',
  },
});

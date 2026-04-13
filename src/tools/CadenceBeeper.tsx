import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { useT } from '../i18n';
import { type ColorPalette, Sports, type SportKey } from '../theme';

const PRESETS: Record<SportKey, number[]> = {
  run: [160, 170, 175, 180, 185, 190],
  bike: [75, 80, 85, 90, 95, 100],
  swim: [160, 170, 175, 180, 185, 190],
  tri: [160, 170, 175, 180, 185, 190],
  all: [160, 170, 175, 180, 185, 190],
};

const SPORT_OPTIONS: SportKey[] = ['run', 'bike'];

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    segGroup: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    segBtn: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
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
      borderColor: c.border,
      backgroundColor: c.card,
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
      borderColor: c.border,
      backgroundColor: c.surface,
      alignItems: 'center',
      minWidth: '14%',
    },
  });

// Web Audio API beep (browser only)
// AudioContext is kept as a module-level singleton so it survives re-renders.
let webAudioCtx: AudioContext | null = null;

/** Must be called from a user-gesture handler to un-suspend the context on iOS PWA. */
function resumeWebAudio() {
  if (
    typeof AudioContext === 'undefined' &&
    typeof (window as unknown as Record<string, unknown>).webkitAudioContext === 'undefined'
  )
    return;
  if (!webAudioCtx) {
    const Ctx = (AudioContext ??
      (window as unknown as Record<string, unknown>).webkitAudioContext) as typeof AudioContext;
    webAudioCtx = new Ctx();
  }
  if (webAudioCtx.state === 'suspended') {
    webAudioCtx.resume().catch(() => {});
  }
}

function playWebBeep() {
  const ctx = webAudioCtx;
  if (!ctx || ctx.state !== 'running') return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.07);
}

export function CadenceBeeper() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const t = useT();
  const [bpm, setBpm] = useState(175);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(false);
  const [sport, setSport] = useState<SportKey>('run');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    }).catch(() => {});
    Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../assets/beep.wav'),
      { shouldPlay: false, volume: 1 }
    )
      .then(({ sound }) => {
        soundRef.current = sound;
      })
      .catch(() => {});
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const click = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (Platform.OS === 'web') {
      playWebBeep();
    } else if (soundRef.current) {
      soundRef.current
        .setPositionAsync(0)
        .then(() => soundRef.current?.playAsync())
        .catch(() => {});
    }
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
                color={active ? Sports[id].color : colors.textMid}>
                {Sports[id].icon} {id === 'run' ? t('sport_run') : t('sport_bike')}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* BPM display */}
      <View style={styles.bpmDisplay}>
        <AppText condensed weight="black" size={72} color={colors.text}>
          {bpm}
        </AppText>
        <AppText size={14} color={colors.textMid}>
          {t('hrz_bpm')}
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
          <AppText condensed weight="black" size={20} color={colors.textMid}>
            −5
          </AppText>
        </Pressable>
        <Pressable style={styles.bpmBtn} onPress={() => adjustBpm(-1)}>
          <AppText condensed weight="black" size={20} color={colors.textMid}>
            −1
          </AppText>
        </Pressable>
        <Pressable style={styles.bpmBtn} onPress={() => adjustBpm(1)}>
          <AppText condensed weight="black" size={20} color={colors.textMid}>
            +1
          </AppText>
        </Pressable>
        <Pressable style={styles.bpmBtn} onPress={() => adjustBpm(5)}>
          <AppText condensed weight="black" size={20} color={colors.textMid}>
            +5
          </AppText>
        </Pressable>
      </View>

      {/* Play / Stop */}
      <Pressable
        style={[styles.playBtn, { backgroundColor: playing ? colors.heart : colors.accent }]}
        onPress={() => {
          if (Platform.OS === 'web') resumeWebAudio();
          setPlaying((p) => !p);
        }}>
        <AppText
          condensed
          weight="black"
          size={16}
          color={playing ? '#fff' : '#000'}
          uppercase
          style={{ letterSpacing: 1 }}>
          {playing ? t('cad_stop') : t('cad_start')}
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
              <AppText condensed weight="bold" size={13} color={active ? sp.color : colors.textDim}>
                {v}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

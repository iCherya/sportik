import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { DateField } from '../components/DateField';
import { type Lang, useLang } from '../context/LangContext';
import { useColors } from '../context/ThemeContext';
import { useT } from '../i18n';
import { type ColorPalette, Sports } from '../theme';

export type OBData = {
  sports: string[];
  raceType: string;
  raceDate: string;
  maxHR: string;
  ftp: string;
  name: string;
};

type Props = {
  onComplete: (data: OBData) => void;
  onSkipAll: () => void;
  setLang: (v: Lang) => void;
};

const { width: SCREEN_W } = Dimensions.get('window');

/* ── Slide wrapper ── */
function SlideIn({ dir, children }: { dir: 'fwd' | 'bwd'; children: React.ReactNode }) {
  const x = useSharedValue(dir === 'fwd' ? SCREEN_W : -SCREEN_W);

  useEffect(() => {
    x.value = withTiming(0, { duration: 320 });
  }, [x]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return <Animated.View style={[StyleSheet.absoluteFill, style]}>{children}</Animated.View>;
}

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    shell: { flex: 1 },
    screen: { flex: 1, backgroundColor: c.bg },

    /* progress */
    progressWrap: { paddingHorizontal: 20, flexShrink: 0 },
    progressTrack: {
      height: 3,
      backgroundColor: c.surface,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 16,
    },
    progressFill: { height: '100%', borderRadius: 3, backgroundColor: c.accent },
    progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    progressBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
    progressSkipBtn: { paddingVertical: 4, width: 60, alignItems: 'flex-end' },
    progressSlot: { width: 60 },

    /* header */
    stepHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4 },

    /* cta button */
    ctaBtn: {
      width: '100%',
      paddingVertical: 18,
      borderRadius: 18,
      backgroundColor: c.accent,
      alignItems: 'center',
    },
    ctaBtnDisabled: { backgroundColor: c.surface },
    bottomPad: { paddingHorizontal: 20, paddingTop: 16 },

    /* welcome */
    welcomeSkipRow: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    },
    skipChip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
    },
    langToggle: {
      flexDirection: 'row',
      borderRadius: 8,
      borderWidth: 1,
      overflow: 'hidden',
    },
    langBtn: {
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    welcomeCenter: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingBottom: 20,
    },
    accentBar: {
      width: 48,
      height: 3,
      backgroundColor: c.accent,
      borderRadius: 2,
      marginVertical: 16,
    },
    featureChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      marginTop: 28,
    },
    featureChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: `${c.accent}18`,
      borderWidth: 1,
      borderColor: `${c.accent}33`,
    },
    sportIcons: { flexDirection: 'row', gap: 16, marginTop: 32 },
    sportIconBox: {
      width: 52,
      height: 52,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    /* sport focus */
    sportList: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, gap: 10 },
    sportCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderRadius: 20,
      padding: 16,
    },
    sportCardIcon: {
      width: 52,
      height: 52,
      borderRadius: 15,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    sportCardCheck: {
      width: 24,
      height: 24,
      borderRadius: 8,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },

    /* goal race */
    yesNoRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 16 },
    yesNoBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 16,
      borderWidth: 2,
      alignItems: 'center',
    },
    raceList: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    raceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1.5,
      marginBottom: 8,
    },
    noRaceCenter: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    /* baseline */
    baselineList: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    baseCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 20,
      padding: 20,
    },
    baseCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
    baseCardIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    baseInput: {
      flex: 1,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 14,
      fontFamily: 'BarlowCondensedBlack',
      fontSize: 28,
      color: c.text,
      textAlign: 'center',
    },
    unitBadge: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
    },
    agePresets: { flexDirection: 'row', gap: 6, marginTop: 10 },
    ageBtn: {
      flex: 1,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    /* ready */
    readyList: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    nameInput: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderRadius: 14,
      padding: 16,
      fontFamily: 'InterBold',
      fontSize: 22,
      color: c.text,
      marginBottom: 20,
    },
    summaryCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      paddingHorizontal: 16,
    },
    skippedCard: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      padding: 14,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    skippedChip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    promiseCard: {
      flexDirection: 'row',
      gap: 12,
      borderRadius: 16,
      borderWidth: 1,
      padding: 14,
      alignItems: 'flex-start',
    },

    /* skip-all pill */
    skipAllWrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      pointerEvents: 'box-none',
    },
    skipAllBtn: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
    },
  });

/* ── Progress bar + back/skip row ── */
function OBProgress({
  step,
  total,
  onBack,
  onSkip,
  showBack,
  showSkip,
}: {
  step: number;
  total: number;
  onBack: () => void;
  onSkip: () => void;
  showBack: boolean;
  showSkip: boolean;
}) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.progressWrap, { paddingTop: insets.top + 16 }]}>
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${(step / total) * 100}%` as `${number}%` }]}
        />
      </View>
      <View style={styles.progressRow}>
        {showBack ? (
          <Pressable style={styles.progressBtn} onPress={onBack}>
            <AppText size={18} color={colors.textMid}>
              ←
            </AppText>
            <AppText size={13} weight="medium" color={colors.textMid}>
              {t('back')}
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.progressSlot} />
        )}
        <AppText size={12} weight="semibold" color={colors.textDim} style={{ letterSpacing: 1 }}>
          {step} / {total}
        </AppText>
        {showSkip ? (
          <Pressable style={styles.progressSkipBtn} onPress={onSkip}>
            <AppText size={13} weight="semibold" color={colors.textDim}>
              {t('skip')}
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.progressSlot} />
        )}
      </View>
    </View>
  );
}

/* ── Big CTA button ── */
function OBBtn({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <Pressable
      style={[styles.ctaBtn, disabled && styles.ctaBtnDisabled]}
      onPress={disabled ? undefined : onPress}>
      <AppText
        condensed
        weight="black"
        size={20}
        style={{ letterSpacing: 2 }}
        color={disabled ? colors.textDim : '#000'}
        uppercase>
        {label}
      </AppText>
    </Pressable>
  );
}

/* ── Screen 1: Welcome ── */
function OBWelcome({
  onNext,
  onSkipAll,
  setLang,
}: {
  onNext: () => void;
  onSkipAll: () => void;
  setLang: (v: Lang) => void;
}) {
  const t = useT();
  const lang = useLang();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const features = [
    t('tool_pace'),
    t('nav_events'),
    t('home_plans'),
    t('tool_hr'),
    t('ob_multi_sport'),
  ];
  const sportIcons = [
    { icon: '🏊', color: Sports.swim.color },
    { icon: '🚴', color: Sports.bike.color },
    { icon: '🏃', color: Sports.run.color },
    { icon: '🔱', color: Sports.tri.color },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Top row: lang toggle left, skip right */}
      <View style={[styles.welcomeSkipRow, { paddingTop: insets.top + 12 }]}>
        <View style={[styles.langToggle, { borderColor: colors.border }]}>
          {(['en', 'uk'] as Lang[]).map((l) => (
            <Pressable
              key={l}
              style={[
                styles.langBtn,
                { backgroundColor: lang === l ? colors.accent : colors.surface },
              ]}
              onPress={() => setLang(l)}>
              <AppText
                size={12}
                weight="bold"
                color={lang === l ? '#000' : colors.textDim}
                style={{ letterSpacing: 0.5 }}>
                {l === 'en' ? 'EN' : 'UA'}
              </AppText>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={[styles.skipChip, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={onSkipAll}>
          <AppText size={13} weight="semibold" color={colors.textDim}>
            {t('ob_skip')}
          </AppText>
        </Pressable>
      </View>

      {/* Centre content */}
      <View style={styles.welcomeCenter}>
        <AppText condensed weight="black" size={52} style={{ letterSpacing: 8, lineHeight: 52 }}>
          SPORT
          <AppText condensed weight="black" size={52} color={colors.accent}>
            IK
          </AppText>
        </AppText>

        <View style={styles.accentBar} />

        <AppText
          condensed
          weight="bold"
          size={22}
          color={colors.textMid}
          style={{ letterSpacing: 1, lineHeight: 30, textAlign: 'center' }}>
          {t('ob_tagline')}
        </AppText>

        <View style={styles.featureChips}>
          {features.map((f) => (
            <View key={f} style={styles.featureChip}>
              <AppText size={12} weight="bold" color={colors.accent} style={{ letterSpacing: 0.3 }}>
                {f}
              </AppText>
            </View>
          ))}
        </View>

        <View style={styles.sportIcons}>
          {sportIcons.map((s) => (
            <View
              key={s.icon}
              style={[
                styles.sportIconBox,
                { backgroundColor: `${s.color}18`, borderColor: `${s.color}33` },
              ]}>
              <AppText size={24}>{s.icon}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={[styles.bottomPad, { paddingBottom: insets.bottom + 36 }]}>
        <OBBtn label={t('ob_get_started')} onPress={onNext} />
        <AppText
          size={12}
          color={colors.textDim}
          style={{ textAlign: 'center', marginTop: 14, lineHeight: 18 }}>
          {t('ob_takes')}
        </AppText>
      </View>
    </View>
  );
}

/* ── Screen 2: Sport Focus ── */
function OBSportFocus({
  onNext,
  onBack,
  data,
  setData,
}: {
  onNext: () => void;
  onBack: () => void;
  data: OBData;
  setData: React.Dispatch<React.SetStateAction<OBData>>;
}) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const sports = [
    {
      id: 'tri',
      icon: '🔱',
      label: t('ob_sport_tri'),
      sub: t('ob_sport_tri_sub'),
      color: Sports.tri.color,
    },
    {
      id: 'run',
      icon: '🏃',
      label: t('ob_sport_run'),
      sub: t('ob_sport_run_sub'),
      color: Sports.run.color,
    },
    {
      id: 'bike',
      icon: '🚴',
      label: t('ob_sport_bike'),
      sub: t('ob_sport_bike_sub'),
      color: Sports.bike.color,
    },
    {
      id: 'swim',
      icon: '🏊',
      label: t('ob_sport_swim'),
      sub: t('ob_sport_swim_sub'),
      color: Sports.swim.color,
    },
    {
      id: 'tbd',
      icon: '🤔',
      label: t('ob_sport_tbd'),
      sub: t('ob_sport_tbd_sub'),
      color: colors.textMid,
    },
  ];
  const select = (id: string) => setData((d) => ({ ...d, sports: [id] }));

  return (
    <View style={styles.screen}>
      <OBProgress step={1} total={4} onBack={onBack} onSkip={() => {}} showBack showSkip={false} />
      <View style={styles.stepHeader}>
        <AppText condensed weight="black" size={32} style={{ letterSpacing: 0.5, lineHeight: 36 }}>
          {t('ob_sport_q')}
        </AppText>
        <AppText size={14} color={colors.textMid} style={{ marginTop: 8, lineHeight: 21 }}>
          {t('ob_sport_sub')}
        </AppText>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.sportList}
        showsVerticalScrollIndicator={false}>
        {sports.map((s) => {
          const sel = data.sports.includes(s.id);
          return (
            <Pressable
              key={s.id}
              style={[
                styles.sportCard,
                {
                  backgroundColor: sel ? `${s.color}18` : colors.card,
                  borderColor: sel ? s.color : colors.border,
                  borderWidth: sel ? 2 : 1,
                },
              ]}
              onPress={() => select(s.id)}>
              <View
                style={[
                  styles.sportCardIcon,
                  { backgroundColor: `${s.color}22`, borderColor: `${s.color}33` },
                ]}>
                <AppText size={26}>{s.icon}</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText condensed weight="bold" size={18} color={sel ? s.color : colors.text}>
                  {s.label}
                </AppText>
                <AppText size={12} color={colors.textMid} style={{ marginTop: 2 }}>
                  {s.sub}
                </AppText>
              </View>
              <View
                style={[
                  styles.sportCardCheck,
                  {
                    backgroundColor: sel ? s.color : 'transparent',
                    borderColor: sel ? s.color : colors.border,
                  },
                ]}>
                {sel && (
                  <AppText size={14} weight="black" color="#fff">
                    ✓
                  </AppText>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={[styles.bottomPad, { paddingBottom: insets.bottom + 36 }]}>
        <OBBtn label={t('ob_continue')} onPress={onNext} disabled={data.sports.length === 0} />
      </View>
    </View>
  );
}

/* ── Screen 3: Goal Race ── */
function OBGoalRace({
  onNext,
  onBack,
  onSkip,
  data,
  setData,
}: {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  data: OBData;
  setData: React.Dispatch<React.SetStateAction<OBData>>;
}) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [hasRace, setHasRace] = useState<boolean | null>(data.raceType ? true : null);

  const primarySport = data.sports[0];
  const allRaceTypes = [
    {
      id: 'sprint',
      sport: 'tri',
      label: t('ob_race_sprint'),
      detail: t('ob_race_sprint_dist'),
      color: Sports.tri.color,
    },
    {
      id: 'olympic',
      sport: 'tri',
      label: t('ob_race_olympic'),
      detail: t('ob_race_olympic_dist'),
      color: Sports.tri.color,
    },
    {
      id: '703',
      sport: 'tri',
      label: t('ob_race_703'),
      detail: t('ob_race_703_dist'),
      color: Sports.tri.color,
    },
    {
      id: 'ironman',
      sport: 'tri',
      label: t('ob_race_im'),
      detail: t('ob_race_im_dist'),
      color: Sports.tri.color,
    },
    {
      id: 'marathon',
      sport: 'run',
      label: t('ob_race_marathon'),
      detail: t('ob_race_marathon_dist'),
      color: Sports.run.color,
    },
    {
      id: 'hm',
      sport: 'run',
      label: t('ob_race_hm'),
      detail: t('ob_race_hm_dist'),
      color: Sports.run.color,
    },
    {
      id: '10k',
      sport: 'run',
      label: t('ob_race_10k'),
      detail: t('ob_race_10k_dist'),
      color: Sports.run.color,
    },
    {
      id: '5k',
      sport: 'run',
      label: t('ob_race_5k'),
      detail: t('ob_race_5k_dist'),
      color: Sports.run.color,
    },
    {
      id: 'fondo',
      sport: 'bike',
      label: t('ob_race_fondo'),
      detail: t('ob_race_fondo_dist'),
      color: Sports.bike.color,
    },
    {
      id: 'sotka',
      sport: 'bike',
      label: t('ob_race_sotka'),
      detail: t('ob_race_sotka_dist'),
      color: Sports.bike.color,
    },
    {
      id: 'bike40',
      sport: 'bike',
      label: t('ob_race_bike40'),
      detail: t('ob_race_bike40_dist'),
      color: Sports.bike.color,
    },
    {
      id: 'swim1000',
      sport: 'swim',
      label: t('ob_race_swim1000'),
      detail: t('ob_race_swim1000_dist'),
      color: Sports.swim.color,
    },
    {
      id: 'swim2000',
      sport: 'swim',
      label: t('ob_race_swim2000'),
      detail: t('ob_race_swim2000_dist'),
      color: Sports.swim.color,
    },
    {
      id: 'swim5000',
      sport: 'swim',
      label: t('ob_race_swim5000'),
      detail: t('ob_race_swim5000_dist'),
      color: Sports.swim.color,
    },
    {
      id: 'swim10000',
      sport: 'swim',
      label: t('ob_race_swim10000'),
      detail: t('ob_race_swim10000_dist'),
      color: Sports.swim.color,
    },
  ];
  const raceTypes = allRaceTypes.filter((r) => !primarySport || r.sport === primarySport);

  return (
    <View style={styles.screen}>
      <OBProgress step={2} total={4} onBack={onBack} onSkip={onSkip} showBack showSkip />
      <View style={styles.stepHeader}>
        <AppText condensed weight="black" size={32} style={{ letterSpacing: 0.5, lineHeight: 36 }}>
          {t('ob_race_q')}
        </AppText>
        <AppText size={14} color={colors.textMid} style={{ marginTop: 8 }}>
          {t('ob_race_sub')}
        </AppText>
      </View>

      <View style={styles.yesNoRow}>
        {[
          { v: true, l: t('ob_race_yes') },
          { v: false, l: t('ob_race_no') },
        ].map((opt) => (
          <Pressable
            key={String(opt.v)}
            style={[
              styles.yesNoBtn,
              {
                borderColor: hasRace === opt.v ? colors.accent : colors.border,
                backgroundColor: hasRace === opt.v ? `${colors.accent}18` : colors.card,
              },
            ]}
            onPress={() => {
              setHasRace(opt.v);
              if (!opt.v) setData((d) => ({ ...d, raceType: '', raceDate: '' }));
            }}>
            <AppText
              condensed
              weight="bold"
              size={15}
              color={hasRace === opt.v ? colors.accent : colors.textMid}>
              {opt.l}
            </AppText>
          </Pressable>
        ))}
      </View>

      {hasRace === true && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.raceList}
          showsVerticalScrollIndicator={false}>
          <AppText
            condensed
            weight="bold"
            size={11}
            color={colors.textDim}
            uppercase
            style={{ letterSpacing: 2, marginBottom: 10 }}>
            {t('ob_race_type')}
          </AppText>
          {raceTypes.map((r) => {
            const sel = data.raceType === r.id;
            return (
              <Pressable
                key={r.id}
                style={[
                  styles.raceRow,
                  {
                    borderColor: sel ? r.color : colors.border,
                    backgroundColor: sel ? `${r.color}18` : colors.card,
                  },
                ]}
                onPress={() => setData((d) => ({ ...d, raceType: r.id }))}>
                <View style={{ flex: 1 }}>
                  <AppText condensed weight="bold" size={15} color={sel ? r.color : colors.text}>
                    {r.label}
                  </AppText>
                  <AppText size={12} color={colors.textDim}>
                    {r.detail}
                  </AppText>
                </View>
                {sel && (
                  <AppText size={16} color={r.color}>
                    ✓
                  </AppText>
                )}
              </Pressable>
            );
          })}

          <AppText
            condensed
            weight="bold"
            size={11}
            color={colors.textDim}
            uppercase
            style={{ letterSpacing: 2, marginBottom: 8, marginTop: 20 }}>
            {t('ob_race_date')}
          </AppText>
          <DateField
            value={data.raceDate}
            onChange={(v) => setData((d) => ({ ...d, raceDate: v }))}
          />
        </ScrollView>
      )}

      {hasRace === false && (
        <View style={styles.noRaceCenter}>
          <AppText size={40}>🗓</AppText>
          <AppText
            condensed
            weight="black"
            size={18}
            color={colors.textMid}
            style={{ marginTop: 12 }}>
            {t('ob_race_none')}
          </AppText>
          <AppText
            size={13}
            color={colors.textDim}
            style={{ marginTop: 6, lineHeight: 20, textAlign: 'center' }}>
            {t('ob_race_none_sub')}
          </AppText>
        </View>
      )}

      {hasRace === null && <View style={{ flex: 1 }} />}

      <View style={[styles.bottomPad, { paddingBottom: insets.bottom + 36 }]}>
        <OBBtn
          label={t('ob_continue')}
          onPress={onNext}
          disabled={hasRace === null || (hasRace === true && !data.raceType)}
        />
      </View>
    </View>
  );
}

/* ── Screen 4: Baseline Numbers ── */
function OBBaseline({
  onNext,
  onBack,
  onSkip,
  data,
  setData,
}: {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  data: OBData;
  setData: React.Dispatch<React.SetStateAction<OBData>>;
}) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const showFTP = data.sports.includes('bike') || data.sports.includes('tri');
  const agePresets = [
    { l: '25', v: '195' },
    { l: '30', v: '190' },
    { l: '35', v: '185' },
    { l: '40', v: '180' },
    { l: '45', v: '175' },
  ];

  return (
    <View style={styles.screen}>
      <OBProgress step={3} total={4} onBack={onBack} onSkip={onSkip} showBack showSkip />
      <View style={styles.stepHeader}>
        <AppText condensed weight="black" size={32} style={{ letterSpacing: 0.5, lineHeight: 36 }}>
          {t('ob_baseline_q')}
        </AppText>
        <AppText size={14} color={colors.textMid} style={{ marginTop: 8, lineHeight: 21 }}>
          {t('ob_baseline_sub')}
        </AppText>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.baselineList}
        showsVerticalScrollIndicator={false}>
        {/* Max HR card */}
        <View style={styles.baseCard}>
          <View style={styles.baseCardHeader}>
            <View style={[styles.baseCardIcon, { backgroundColor: '#200010' }]}>
              <AppText size={18}>❤️</AppText>
            </View>
            <View>
              <AppText condensed weight="bold" size={15}>
                {t('hr_max')}
              </AppText>
              <AppText size={11} color={colors.textDim} style={{ marginTop: 1 }}>
                {t('hr_estimate')}
              </AppText>
            </View>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              value={data.maxHR}
              onChangeText={(v) => setData((d) => ({ ...d, maxHR: v }))}
              placeholder="185"
              placeholderTextColor={colors.textDim}
              keyboardType="numeric"
              style={styles.baseInput}
            />
            <View style={styles.unitBadge}>
              <AppText size={13} weight="bold" color={colors.textMid}>
                {t('unit_bpm')}
              </AppText>
            </View>
          </View>
          <View style={styles.agePresets}>
            {agePresets.map((p) => (
              <Pressable
                key={p.l}
                style={[
                  styles.ageBtn,
                  {
                    borderColor: data.maxHR === p.v ? colors.accent : colors.border,
                    backgroundColor: data.maxHR === p.v ? `${colors.accent}22` : colors.surface,
                  },
                ]}
                onPress={() => setData((d) => ({ ...d, maxHR: p.v }))}>
                <AppText
                  condensed
                  weight="bold"
                  size={11}
                  color={data.maxHR === p.v ? colors.accent : colors.textDim}
                  style={{ textAlign: 'center', lineHeight: 14 }}>
                  {`${t('unit_age')}\n${p.l}`}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* FTP card (only for bike/tri) */}
        {showFTP && (
          <View style={[styles.baseCard, { marginTop: 16 }]}>
            <View style={styles.baseCardHeader}>
              <View style={[styles.baseCardIcon, { backgroundColor: '#1a1400' }]}>
                <AppText size={18}>⚡</AppText>
              </View>
              <View>
                <AppText condensed weight="bold" size={15}>
                  {t('ftp_title')}
                </AppText>
                <AppText size={11} color={colors.textDim} style={{ marginTop: 1 }}>
                  {t('ob_ftp_test')}
                </AppText>
              </View>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                value={data.ftp}
                onChangeText={(v) => setData((d) => ({ ...d, ftp: v }))}
                placeholder="245"
                placeholderTextColor={colors.textDim}
                keyboardType="numeric"
                style={styles.baseInput}
              />
              <View style={styles.unitBadge}>
                <AppText size={13} weight="bold" color={colors.textMid}>
                  W
                </AppText>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomPad, { paddingBottom: insets.bottom + 36 }]}>
        <OBBtn label={t('ob_continue')} onPress={onNext} />
      </View>
    </View>
  );
}

/* ── Screen 5: Ready ── */
function OBReady({
  onFinish,
  onBack,
  data,
  setData,
}: {
  onFinish: (name: string) => void;
  onBack: () => void;
  data: OBData;
  setData: React.Dispatch<React.SetStateAction<OBData>>;
}) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(data.name || '');

  const sportLabels: Record<string, string> = {
    tri: t('ob_sport_tri'),
    run: t('ob_sport_run'),
    bike: t('ob_sport_bike'),
    swim: t('ob_sport_swim'),
    tbd: t('ob_sport_tbd'),
  };
  const raceLabels: Record<string, string> = {
    sprint: t('ob_race_sprint'),
    olympic: t('ob_race_olympic'),
    '703': t('ob_race_703'),
    ironman: t('ob_race_im'),
    marathon: t('ob_race_marathon'),
    hm: t('ob_race_hm'),
    fondo: t('ob_race_fondo'),
  };

  const summaryItems = [
    {
      icon: '🎯',
      label: t('ob_sport_focus'),
      val: data.sports.map((s) => sportLabels[s]).join(' · ') || null,
    },
    {
      icon: '🏁',
      label: t('ob_goal_race'),
      val: data.raceType
        ? `${raceLabels[data.raceType]}${data.raceDate ? ` · ${data.raceDate}` : ''}`
        : null,
    },
    { icon: '❤️', label: t('hr_max'), val: data.maxHR ? `${data.maxHR} bpm` : null },
    { icon: '⚡', label: t('pz_ftp_label'), val: data.ftp ? `${data.ftp} W` : null },
  ];
  const filledItems = summaryItems.filter((i) => i.val !== null);
  const skippedItems = summaryItems.filter((i) => i.val === null);
  const mostlySkipped = filledItems.length <= 1;

  return (
    <View style={styles.screen}>
      <OBProgress step={4} total={4} onBack={onBack} onSkip={() => {}} showBack showSkip={false} />
      <View style={styles.stepHeader}>
        <AppText condensed weight="black" size={32} style={{ letterSpacing: 0.5, lineHeight: 36 }}>
          {mostlySkipped ? t('ob_ready_q_skipped') : t('ob_ready_q')}
        </AppText>
        <AppText size={14} color={colors.textMid} style={{ marginTop: 8 }}>
          {mostlySkipped ? t('ob_ready_sub_skipped') : t('ob_ready_sub')}
        </AppText>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.readyList}
        showsVerticalScrollIndicator={false}>
        {/* Name input */}
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('ep_name')}
          placeholderTextColor={colors.textDim}
          style={[styles.nameInput, { borderColor: name ? colors.accent : colors.border }]}
        />

        {/* Filled summary */}
        {filledItems.length > 0 && (
          <View style={styles.summaryCard}>
            <AppText
              condensed
              weight="bold"
              size={11}
              color={colors.textDim}
              uppercase
              style={{ letterSpacing: 2, padding: 16, paddingBottom: 8 }}>
              {mostlySkipped ? t('ob_ready_set') : t('ob_ready_profile')}
            </AppText>
            {filledItems.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.summaryRow,
                  { borderTopWidth: 1, borderTopColor: colors.borderSub },
                ]}>
                <AppText size={16} style={{ width: 22, textAlign: 'center' }}>
                  {item.icon}
                </AppText>
                <AppText weight="medium" size={13} color={colors.textMid} style={{ flex: 1 }}>
                  {item.label}
                </AppText>
                <AppText
                  condensed
                  weight="bold"
                  size={14}
                  style={{ maxWidth: 160, textAlign: 'right' }}>
                  {item.val}
                </AppText>
              </View>
            ))}
          </View>
        )}

        {/* Skipped nudge */}
        {skippedItems.length > 0 && (
          <View style={styles.skippedCard}>
            <AppText
              condensed
              weight="bold"
              size={11}
              color={colors.textDim}
              uppercase
              style={{ letterSpacing: 2, marginBottom: 10 }}>
              {t('ob_ready_later')}
            </AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {skippedItems.map((item) => (
                <View key={item.label} style={styles.skippedChip}>
                  <AppText size={12} weight="semibold" color={colors.textDim}>
                    {item.icon} {item.label}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Promise */}
        <View
          style={[
            styles.promiseCard,
            { backgroundColor: `${colors.accent}0f`, borderColor: `${colors.accent}22` },
          ]}>
          <AppText size={18}>🏅</AppText>
          <AppText size={13} color={colors.textMid} style={{ flex: 1, lineHeight: 20 }}>
            {t('ob_ready_promise')}
          </AppText>
        </View>
      </ScrollView>

      <View style={[styles.bottomPad, { paddingBottom: insets.bottom + 36 }]}>
        <OBBtn
          label={`${t('ob_lets_go')}${name ? ', ' + name.split(' ')[0] : ''} →`}
          onPress={() => {
            setData((d) => ({ ...d, name }));
            onFinish(name || t('default_athlete'));
          }}
        />
      </View>
    </View>
  );
}

/* ── Onboarding Shell ── */
export function Onboarding({ onComplete, onSkipAll, setLang }: Props) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const t = useT();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<'fwd' | 'bwd'>('fwd');
  const [data, setData] = useState<OBData>({
    sports: [],
    raceType: '',
    raceDate: '',
    maxHR: '',
    ftp: '',
    name: '',
  });

  const isTbd = data.sports[0] === 'tbd';

  const go = (nextStep: number) => {
    setDir(nextStep > step ? 'fwd' : 'bwd');
    setStep(nextStep);
  };
  // Step 2 (GoalRace) is skipped when sport is 'tbd'
  const next = () => go(step === 1 && isTbd ? 3 : step + 1);
  const back = () => go(step === 3 && isTbd ? 1 : step - 1);
  const skip = () => go(step + 1);

  const screens = [
    <OBWelcome key="welcome" onNext={next} onSkipAll={onSkipAll} setLang={setLang} />,
    <OBSportFocus key="sport" onNext={next} onBack={back} data={data} setData={setData} />,
    <OBGoalRace
      key="race"
      onNext={next}
      onBack={back}
      onSkip={skip}
      data={data}
      setData={setData}
    />,
    <OBBaseline
      key="baseline"
      onNext={next}
      onBack={back}
      onSkip={skip}
      data={data}
      setData={setData}
    />,
    <OBReady
      key="ready"
      onFinish={(name) => onComplete({ ...data, name })}
      onBack={back}
      data={data}
      setData={setData}
    />,
  ];

  return (
    <View style={[styles.shell, { backgroundColor: colors.bg }]}>
      <View style={StyleSheet.absoluteFill}>
        <SlideIn key={step} dir={dir}>
          {screens[step]}
        </SlideIn>
      </View>

      {/* "Skip onboarding entirely" floating pill (steps 1–4) */}
      {step > 0 && step < 4 && (
        <View style={[styles.skipAllWrap, { bottom: insets.bottom + 8 }]}>
          <Pressable
            style={[
              styles.skipAllBtn,
              { backgroundColor: `${colors.surface}ee`, borderColor: colors.border },
            ]}
            onPress={onSkipAll}>
            <AppText size={12} color={colors.textDim}>
              {t('ob_skip_all')}
            </AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

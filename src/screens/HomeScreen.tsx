import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { useColors } from '../context/ThemeContext';
import { QUOTES, TODAY_SESSIONS, TOOLS, type Event, type Tool } from '../data';
import { useT } from '../i18n';
import { type ColorPalette, Font, Space, Sports, type SportKey } from '../theme';
import type { Profile } from '../types';

type Props = {
  profile: Profile;
  nextRace: Event | null;
  dateStr: string;
  greeting: string;
  doneSessions: Record<string, boolean>;
  setDoneSessions: Dispatch<SetStateAction<Record<string, boolean>>>;
  qi: number;
  setQi: Dispatch<SetStateAction<number>>;
  onOpenTool: (tool: Tool) => void;
  onOpenPlan: () => void;
};

const QUOTE_HEIGHT = 130;
const QUICK_TOOL_IDS = ['pace', 'cadence', 'hr', 'split'];
const WL_DATA = [
  { sport: 'swim' as const, icon: '🏊', color: Sports.swim.color, val: '3.2h', pct: 65 },
  { sport: 'bike' as const, icon: '🚴', color: Sports.bike.color, val: '5.8h', pct: 88 },
  { sport: 'run' as const, icon: '🏃', color: Sports.run.color, val: '2.4h', pct: 45 },
];
const PLAN_TEMPLATES = [
  {
    icon: '🔱',
    name: 'Ironman 70.3',
    meta: '16 weeks · Intermediate',
    active: true,
    sport: 'tri' as const,
  },
  {
    icon: '🏃',
    name: 'Marathon',
    meta: '18 weeks · Beginner',
    active: false,
    sport: 'run' as const,
  },
  {
    icon: '🚴',
    name: 'Gran Fondo',
    meta: '12 weeks · Advanced',
    active: false,
    sport: 'bike' as const,
  },
];

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    scroll: { flex: 1, backgroundColor: c.bg },
    content: { paddingHorizontal: Space.screen, paddingTop: 16, paddingBottom: 20 },
    greeting: { marginBottom: 16 },
    quoteCard: { marginBottom: 14, backgroundColor: c.surface },
    quoteDots: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    dotsRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
    dot: { height: 6, borderRadius: 3 },
    raceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    raceIcon: { flexShrink: 0 },
    raceDays: { alignItems: 'center', flexShrink: 0 },
    noRaceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 14,
      borderStyle: 'dashed',
    },
    noRaceIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    weeklyLoad: { marginBottom: 4 },
    wlTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    wlBars: { flexDirection: 'row', justifyContent: 'space-around' },
    wlCol: { alignItems: 'center' },
    wlTrack: {
      width: 36,
      height: 80,
      backgroundColor: c.surface,
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
    },
    wlFill: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 2 },
    sectionLabel: { marginTop: 20, marginBottom: 10, letterSpacing: 1 },
    todayPlan: { padding: 0, overflow: 'hidden' },
    tpHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Space.card,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
    },
    emptyPlan: { padding: 28, alignItems: 'center' },
    choosePlanBtn: {
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: `${c.accent}22`,
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
    },
    progressTrack: {
      flex: 1,
      height: 3,
      backgroundColor: c.surface,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: { height: '100%', backgroundColor: c.accent, borderRadius: 2 },
    sessionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
    },
    sessionDone: { opacity: 0.5 },
    sportDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
    sessionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    typeTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    quickToolsRow: { flexDirection: 'row', gap: 10 },
    quickToolBtn: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Space.radius.md,
      padding: 14,
      alignItems: 'center',
      gap: 4,
    },
    planRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
    planRowBorder: { borderBottomWidth: 1, borderBottomColor: c.borderSub },
    planIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    activeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: `${c.accent}22`,
    },
    soonBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: c.surface,
    },
    aiPlanIcon: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: c.border,
    },
  });

function QuoteCard({ qi, setQi }: { qi: number; setQi: Dispatch<SetStateAction<number>> }) {
  const colors = useColors();
  const [cur, setCur] = useState(qi);
  const [slideWidth, setSlideWidth] = useState(300);
  const scrollRef = useRef<ScrollView>(null);

  const goTo = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * slideWidth, animated: true });
    setCur(idx);
    setQi(idx);
  };

  return (
    <Card style={{ marginBottom: 14, backgroundColor: colors.surface }}>
      <View
        style={{ height: QUOTE_HEIGHT, overflow: 'hidden' }}
        onLayout={(e) => setSlideWidth(e.nativeEvent.layout.width)}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          nestedScrollEnabled
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
            setCur(idx);
            setQi(idx);
          }}>
          {QUOTES.map((q, i) => (
            <View key={i} style={{ width: slideWidth, height: QUOTE_HEIGHT }}>
              <AppText
                size={28}
                color={colors.accent}
                style={{ lineHeight: 28, fontFamily: Font.condensedBlack }}>
                "
              </AppText>
              <AppText size={15} style={{ marginTop: 4, lineHeight: 22 }}>
                {q.text}
              </AppText>
              <AppText weight="semibold" size={11} color={colors.textMid} style={{ marginTop: 8 }}>
                — {q.author}
              </AppText>
            </View>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 12,
        }}>
        <Pressable onPress={() => goTo((cur - 1 + QUOTES.length) % QUOTES.length)} hitSlop={8}>
          <AppText size={18} color={colors.textDim}>
            ‹
          </AppText>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          {QUOTES.map((_, i) => (
            <Pressable key={i} onPress={() => goTo(i)} hitSlop={4}>
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  width: i === cur ? 18 : 6,
                  backgroundColor: i === cur ? colors.accent : colors.border,
                }}
              />
            </Pressable>
          ))}
        </View>
        <Pressable onPress={() => goTo((cur + 1) % QUOTES.length)} hitSlop={8}>
          <AppText size={18} color={colors.textDim}>
            ›
          </AppText>
        </Pressable>
      </View>
    </Card>
  );
}

export function HomeScreen({
  profile,
  nextRace,
  dateStr,
  greeting,
  doneSessions,
  setDoneSessions,
  qi,
  setQi,
  onOpenTool,
  onOpenPlan,
}: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const firstName = (profile?.name || 'Athlete').split(' ')[0];
  const quickTools = TOOLS.filter((tool) => QUICK_TOOL_IDS.includes(tool.id));
  const doneCount = TODAY_SESSIONS.filter((s) => doneSessions[s.id]).length;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Greeting */}
      <View style={styles.greeting}>
        <AppText weight="medium" size={13} color={colors.textMid}>
          {dateStr}
        </AppText>
        <AppText condensed weight="black" size={32} style={{ marginTop: 4, lineHeight: 36 }}>
          {greeting},{'\n'}
          <AppText condensed weight="black" size={32} color={colors.accent}>
            {firstName} 👋
          </AppText>
        </AppText>
      </View>

      <QuoteCard qi={qi} setQi={setQi} />

      {/* Race countdown */}
      {nextRace ? (
        <Card style={styles.raceCard}>
          <AppText size={28} style={styles.raceIcon}>
            {Sports[nextRace.sport].icon}
          </AppText>
          <View style={{ flex: 1 }}>
            <AppText condensed weight="bold" size={16}>
              {nextRace.name}
            </AppText>
            <AppText weight="medium" size={12} color={colors.textMid} style={{ marginTop: 2 }}>
              📍 {nextRace.location} · {nextRace.date}
            </AppText>
          </View>
          <View style={styles.raceDays}>
            <AppText condensed weight="black" size={28} color={colors.accent}>
              {nextRace.days}
            </AppText>
            <AppText weight="semibold" size={10} color={colors.textMid} uppercase>
              {t('home_days_to_go')}
            </AppText>
          </View>
        </Card>
      ) : (
        <Card style={styles.noRaceCard}>
          <View style={styles.noRaceIcon}>
            <AppText size={22}>📅</AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText condensed weight="bold" size={15} color={colors.textMid}>
              {t('home_no_race')}
            </AppText>
            <AppText size={12} color={colors.textDim} style={{ marginTop: 2 }}>
              {t('home_no_race_sub')}
            </AppText>
          </View>
        </Card>
      )}

      {/* Weekly load */}
      <Card style={styles.weeklyLoad}>
        <View style={styles.wlTop}>
          <AppText condensed weight="bold" size={15} uppercase style={{ letterSpacing: 1 }}>
            {t('home_this_week')}
          </AppText>
          <AppText weight="semibold" size={12} color={colors.textMid}>
            11.4h {t('home_total')}
          </AppText>
        </View>
        <View style={styles.wlBars}>
          {WL_DATA.map((w) => (
            <View key={w.sport} style={styles.wlCol}>
              <View style={styles.wlTrack}>
                <View
                  style={[
                    styles.wlFill,
                    {
                      height: `${w.pct}%` as `${number}%`,
                      backgroundColor: `${w.color}44`,
                      borderTopColor: w.color,
                    },
                  ]}
                />
              </View>
              <AppText size={18} style={{ marginTop: 6 }}>
                {w.icon}
              </AppText>
              <AppText weight="semibold" size={11} color={w.color} style={{ marginTop: 2 }}>
                {w.val}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      {/* Today's training */}
      <AppText
        condensed
        weight="bold"
        size={12}
        color={colors.textDim}
        uppercase
        style={styles.sectionLabel}>
        {t('home_today')}
      </AppText>
      <Card style={styles.todayPlan}>
        <View style={styles.tpHeader}>
          <AppText condensed weight="bold" size={16} uppercase style={{ letterSpacing: 0.5 }}>
            {t('home_week_plan')}
          </AppText>
          <Pressable onPress={onOpenPlan}>
            <AppText weight="semibold" size={12} color={colors.accent}>
              {t('home_see_plan')}
            </AppText>
          </Pressable>
        </View>
        {TODAY_SESSIONS.length === 0 ? (
          <View style={styles.emptyPlan}>
            <AppText size={32} style={{ marginBottom: 10 }}>
              🗓
            </AppText>
            <AppText
              condensed
              weight="bold"
              size={16}
              color={colors.textMid}
              style={{ marginBottom: 6 }}>
              {t('home_no_sessions')}
            </AppText>
            <AppText
              size={12}
              color={colors.textDim}
              style={{ lineHeight: 18, marginBottom: 16, textAlign: 'center' }}>
              {t('home_no_sessions_sub')}
            </AppText>
            <Pressable style={styles.choosePlanBtn} onPress={onOpenPlan}>
              <AppText
                condensed
                weight="bold"
                size={13}
                color={colors.accent}
                style={{ letterSpacing: 0.5 }}>
                {t('home_choose_plan')}
              </AppText>
            </Pressable>
          </View>
        ) : (
          <>
            {doneCount > 0 && (
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(doneCount / TODAY_SESSIONS.length) * 100}%` as `${number}%` },
                    ]}
                  />
                </View>
                <AppText weight="semibold" size={11} color={colors.textMid}>
                  {doneCount}/{TODAY_SESSIONS.length} done
                </AppText>
              </View>
            )}
            {TODAY_SESSIONS.map((s) => {
              const done = !!doneSessions[s.id];
              const sport = Sports[s.sport as SportKey];
              return (
                <View key={s.id} style={[styles.sessionRow, done && styles.sessionDone]}>
                  <View style={[styles.sportDot, { backgroundColor: sport.color }]} />
                  <View style={{ flex: 1 }}>
                    <AppText
                      weight="semibold"
                      size={14}
                      color={done ? colors.textDim : colors.text}>
                      {s.title}
                    </AppText>
                    <AppText size={12} color={colors.textDim} style={{ marginTop: 2 }}>
                      {s.detail}
                    </AppText>
                  </View>
                  <View style={styles.sessionRight}>
                    <AppText weight="semibold" size={12} color={colors.textMid}>
                      {s.duration}
                    </AppText>
                    <View style={[styles.typeTag, { backgroundColor: `${sport.color}22` }]}>
                      <AppText
                        weight="semibold"
                        size={10}
                        color={sport.color}
                        uppercase
                        style={{ letterSpacing: 0.3 }}>
                        {s.type}
                      </AppText>
                    </View>
                    <Pressable onPress={() => setDoneSessions((d) => ({ ...d, [s.id]: !d[s.id] }))}>
                      <AppText size={20}>{done ? '✅' : '⬜'}</AppText>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </Card>

      {/* Quick tools */}
      <AppText
        condensed
        weight="bold"
        size={12}
        color={colors.textDim}
        uppercase
        style={styles.sectionLabel}>
        {t('home_quick_tools')}
      </AppText>
      <View style={styles.quickToolsRow}>
        {quickTools.map((tool) => (
          <Pressable key={tool.id} style={styles.quickToolBtn} onPress={() => onOpenTool(tool)}>
            <AppText size={22}>{tool.icon}</AppText>
            <AppText
              weight="semibold"
              size={10}
              color={colors.textMid}
              uppercase
              style={{ marginTop: 4, letterSpacing: 0.3, textAlign: 'center' }}>
              {tool.name.split(' ')[0]}
            </AppText>
          </Pressable>
        ))}
      </View>

      {/* Training plans */}
      <AppText
        condensed
        weight="bold"
        size={12}
        color={colors.textDim}
        uppercase
        style={styles.sectionLabel}>
        {t('home_plans')}
      </AppText>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {PLAN_TEMPLATES.map((p, idx) => (
          <Pressable
            key={p.name}
            style={[styles.planRow, idx < PLAN_TEMPLATES.length - 1 && styles.planRowBorder]}
            onPress={onOpenPlan}>
            <View style={[styles.planIcon, { backgroundColor: Sports[p.sport].bg }]}>
              <AppText size={20}>{p.icon}</AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText weight="semibold" size={14}>
                {p.name}
              </AppText>
              <AppText size={12} color={colors.textMid} style={{ marginTop: 2 }}>
                {p.meta}
              </AppText>
            </View>
            {p.active && (
              <View style={styles.activeBadge}>
                <AppText
                  condensed
                  weight="black"
                  size={10}
                  color={colors.accent}
                  uppercase
                  style={{ letterSpacing: 1 }}>
                  {t('plan_active')}
                </AppText>
              </View>
            )}
            <AppText size={14} color={colors.textDim}>
              ›
            </AppText>
          </Pressable>
        ))}
        <Pressable style={styles.planRow}>
          <View style={[styles.planIcon, styles.aiPlanIcon]}>
            <AppText size={20}>✨</AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="semibold" size={14} color={colors.textMid}>
              AI Plan
            </AppText>
            <AppText size={12} color={colors.textDim} style={{ marginTop: 2 }}>
              Personalised · Coming soon
            </AppText>
          </View>
          <View style={styles.soonBadge}>
            <AppText
              condensed
              weight="bold"
              size={10}
              color={colors.textDim}
              uppercase
              style={{ letterSpacing: 0.5 }}>
              SOON
            </AppText>
          </View>
        </Pressable>
      </Card>

      <View style={{ height: 8 }} />
    </ScrollView>
  );
}

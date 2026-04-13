import { useContext, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { LangContext } from '../context/LangContext';
import { useColors } from '../context/ThemeContext';
import { QUOTES, TOOLS, daysUntil, type Event, type Tool } from '../data';
import { useT } from '../i18n';
import { type ColorPalette, Font, Space, Sports } from '../theme';
import type { Profile } from '../types';

type Props = {
  profile: Profile;
  nextRace: Event | null;
  dateStr: string;
  greeting: string;
  onOpenTool: (tool: Tool) => void;
  onOpenPlan: () => void;
};

const QUOTE_HEIGHT = 196;
const QUICK_TOOL_IDS = ['pace', 'cadence', 'hr', 'split'];
const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    scroll: { flex: 1, backgroundColor: c.bg },
    content: { paddingHorizontal: Space.screen, paddingTop: 16, paddingBottom: 20 },
    greeting: { marginBottom: 20 },
    raceCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    raceIcon: { flexShrink: 0 },
    raceDays: { alignItems: 'center', flexShrink: 0 },
    noRaceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
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
    sectionLabel: { marginTop: 20, marginBottom: 10, letterSpacing: 1 },
    quickToolsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    quickToolBtn: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Space.radius.md,
      padding: 14,
      alignItems: 'center',
      gap: 4,
    },
    comingSoonCard: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      padding: 20,
      alignItems: 'center',
    },
    soonBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 14,
    },
    soonFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  });

function QuoteCard() {
  const t = useT();
  const lang = useContext(LangContext);
  const colors = useColors();
  const [cur, setCur] = useState(0);
  const [slideWidth, setSlideWidth] = useState(300);
  const scrollRef = useRef<ScrollView>(null);

  // Index 0 = today, index 1 = yesterday, ..., index 6 = 6 days ago
  const weekQuotes = useMemo(() => {
    const todayDay = Math.floor(Date.now() / 86400000);
    return Array.from({ length: 7 }, (_, i) => {
      const day = todayDay - i;
      const idx = ((day % QUOTES.length) + QUOTES.length) % QUOTES.length;
      return { quote: QUOTES[idx], daysAgo: i };
    });
  }, []);

  const goTo = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * slideWidth, animated: true });
    setCur(idx);
  };

  const isLast = cur === weekQuotes.length - 1;

  return (
    <Card style={{ backgroundColor: colors.surface, padding: 0, overflow: 'hidden' }}>
      <View
        style={{ height: QUOTE_HEIGHT }}
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
          }}>
          {weekQuotes.map((item, i) => {
            const isToday = item.daysAgo === 0;
            return (
              <View
                key={i}
                style={{
                  width: slideWidth,
                  height: QUOTE_HEIGHT,
                  padding: 16,
                  backgroundColor: isToday ? `${colors.accent}12` : 'transparent',
                }}>
                {/* Day badge — today only */}
                {isToday && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 6,
                        backgroundColor: colors.accent,
                      }}>
                      <AppText
                        weight="bold"
                        size={10}
                        color="#1a1a0a"
                        uppercase
                        style={{ letterSpacing: 1.2 }}>
                        {t('quote_today')}
                      </AppText>
                    </View>
                  </View>
                )}
                {/* Quote */}
                <AppText
                  size={isToday ? 38 : 28}
                  color={colors.accent}
                  style={{
                    lineHeight: isToday ? 36 : 26,
                    fontFamily: Font.bodyBold,
                    marginBottom: 2,
                  }}>
                  "
                </AppText>
                <AppText
                  weight="bold"
                  size={isToday ? 18 : 17}
                  style={{ lineHeight: isToday ? 27 : 25, flex: 1, fontStyle: 'italic' }}
                  numberOfLines={4}>
                  {lang === 'uk' ? item.quote.uk : item.quote.en}
                </AppText>
                <AppText
                  weight="semibold"
                  size={13}
                  color={colors.textMid}
                  style={{ marginTop: 6 }}>
                  — {item.quote.author}
                </AppText>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Navigation */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: colors.borderSub,
        }}>
        <Pressable onPress={() => goTo(Math.max(0, cur - 1))} hitSlop={8} style={{ width: 24 }}>
          {cur > 0 && (
            <AppText size={18} color={colors.textDim}>
              ‹
            </AppText>
          )}
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          {weekQuotes.map((_, i) => (
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
        <Pressable
          onPress={() => goTo(Math.min(weekQuotes.length - 1, cur + 1))}
          hitSlop={8}
          style={{ width: 24, alignItems: 'flex-end' }}>
          {!isLast && (
            <AppText size={18} color={colors.textDim}>
              ›
            </AppText>
          )}
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
  onOpenTool,
  onOpenPlan,
}: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const firstName = (profile?.name || 'Athlete').split(' ')[0];
  const quickTools = TOOLS.filter((tool) => QUICK_TOOL_IDS.includes(tool.id));
  const { width: screenWidth } = useWindowDimensions();
  const colCount = screenWidth < 390 ? 2 : 4;
  const btnWidth = (screenWidth - Space.screen * 2 - 10 * (colCount - 1)) / colCount;

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

      <QuoteCard />

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
          <Pressable
            key={tool.id}
            style={[styles.quickToolBtn, { width: btnWidth }]}
            onPress={() => onOpenTool(tool)}>
            <AppText size={22}>{tool.icon}</AppText>
            <AppText
              weight="semibold"
              size={10}
              color={colors.textMid}
              uppercase
              numberOfLines={2}
              style={{ marginTop: 4, letterSpacing: 0.3, textAlign: 'center' }}>
              {t(tool.nameKey)}
            </AppText>
          </Pressable>
        ))}
      </View>

      {/* Race countdown */}
      <AppText
        condensed
        weight="bold"
        size={12}
        color={colors.textDim}
        uppercase
        style={styles.sectionLabel}>
        {t('home_next_race')}
      </AppText>
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
              {daysUntil(nextRace.date)}
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
      <Pressable onPress={onOpenPlan}>
        <Card style={styles.comingSoonCard}>
          <View style={styles.soonBadge}>
            <AppText
              condensed
              weight="bold"
              size={10}
              color={colors.textDim}
              uppercase
              style={{ letterSpacing: 1 }}>
              {t('plans_soon_badge')}
            </AppText>
          </View>
          <AppText size={32} style={{ marginBottom: 10 }}>
            📋
          </AppText>
          <AppText
            condensed
            weight="black"
            size={18}
            style={{ marginBottom: 8, textAlign: 'center' }}>
            {t('plans_soon_title')}
          </AppText>
          <AppText
            size={12}
            color={colors.textMid}
            style={{ textAlign: 'center', lineHeight: 18, marginBottom: 16 }}>
            {t('plans_soon_sub')}
          </AppText>
          {(['plans_soon_feat1', 'plans_soon_feat2', 'plans_soon_feat3'] as const).map((k) => (
            <View key={k} style={styles.soonFeatureRow}>
              <AppText size={13} color={colors.textDim}>
                {t(k)}
              </AppText>
            </View>
          ))}
        </Card>
      </Pressable>
    </ScrollView>
  );
}

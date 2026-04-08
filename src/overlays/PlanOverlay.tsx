import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Overlay } from '../components/Overlay';
import { useColors } from '../context/ThemeContext';
import { PLAN_WEEKS } from '../data';
import { useT } from '../i18n';
import { type ColorPalette, Sports, type SportKey } from '../theme';

type Props = {
  onBack: () => void;
};

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    metaRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 20,
    },
    metaCard: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 8,
      alignItems: 'center',
    },
    weekHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    progressBg: {
      height: 4,
      width: 120,
      backgroundColor: c.surface,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: c.tri,
      borderRadius: 2,
    },
    sessionCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      backgroundColor: c.card,
      borderWidth: 1,
      borderRadius: 16,
      paddingVertical: 14,
      paddingRight: 16,
      overflow: 'hidden',
    },
    stripe: {
      width: 4,
      alignSelf: 'stretch',
      borderRadius: 2,
    },
    sportIcon: {
      width: 38,
      height: 38,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    aiCard: {
      marginTop: 20,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: `${c.accent}22`,
      borderRadius: 18,
      padding: 18,
      alignItems: 'center',
    },
    aiComingSoon: {
      marginTop: 12,
      backgroundColor: `${c.accent}22`,
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 8,
    },
  });

export function PlanOverlay({ onBack }: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const week = PLAN_WEEKS[0];
  const totalWeeks = 16;

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const badge = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <AppText size={15}>🔱</AppText>
      <AppText
        condensed
        weight="black"
        size={11}
        color={colors.tri}
        style={{ letterSpacing: 1.5 }}
        uppercase>
        {t('tools_tab_tri')}
      </AppText>
    </View>
  );

  return (
    <Overlay onBack={onBack} title="Ironman 70.3 Plan" backLabel={t('nav_home')} badge={badge}>
      {/* Plan meta */}
      <View style={styles.metaRow}>
        {[
          { l: t('plan_duration'), v: '16 weeks' },
          { l: t('plan_level'), v: 'Intermediate' },
          { l: t('plan_race'), v: 'June 15' },
        ].map((m) => (
          <View key={m.l} style={styles.metaCard}>
            <AppText
              condensed
              weight="bold"
              size={10}
              color={colors.textDim}
              uppercase
              style={{ letterSpacing: 1.5, marginBottom: 4, textAlign: 'center' }}>
              {m.l}
            </AppText>
            <AppText condensed weight="black" size={15} style={{ textAlign: 'center' }}>
              {m.v}
            </AppText>
          </View>
        ))}
      </View>

      {/* Week header + progress */}
      <View style={styles.weekHeader}>
        <AppText condensed weight="black" size={20}>
          Week 1 of {totalWeeks}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.progressBg}>
            <View
              style={[styles.progressFill, { width: `${(1 / totalWeeks) * 100}%` as `${number}%` }]}
            />
          </View>
          <AppText size={11} color={colors.textDim}>
            1/{totalWeeks}
          </AppText>
        </View>
      </View>

      {/* Sessions */}
      <View style={{ gap: 8 }}>
        {week.sessions.map((s) => {
          const done = !!checked[s.id] || s.done;
          const sport = Sports[s.sport as SportKey];
          return (
            <Pressable
              key={s.id}
              style={[
                styles.sessionCard,
                {
                  borderColor: done ? `${colors.accent}33` : colors.border,
                  opacity: done ? 0.7 : 1,
                },
              ]}
              onPress={() => toggle(s.id)}>
              {/* Sport stripe */}
              <View style={[styles.stripe, { backgroundColor: sport.color }]} />
              {/* Sport icon */}
              <View style={[styles.sportIcon, { backgroundColor: sport.bg }]}>
                <AppText size={18}>{sport.icon}</AppText>
              </View>
              {/* Info */}
              <View style={{ flex: 1 }}>
                <AppText
                  condensed
                  weight="bold"
                  size={15}
                  style={{ textDecorationLine: done ? 'line-through' : 'none' }}>
                  {s.title}
                </AppText>
                <AppText size={12} color={colors.textMid} style={{ marginTop: 2 }}>
                  {s.detail}
                </AppText>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <View
                    style={{
                      backgroundColor: `${sport.color}22`,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 6,
                    }}>
                    <AppText condensed weight="bold" size={11} color={sport.color}>
                      {s.type}
                    </AppText>
                  </View>
                  <AppText weight="semibold" size={11} color={colors.textDim}>
                    {s.duration}
                  </AppText>
                </View>
              </View>
              {/* Checkbox */}
              <AppText size={20}>{done ? '✅' : '⬜'}</AppText>
            </Pressable>
          );
        })}
      </View>

      {/* AI promo */}
      <View style={styles.aiCard}>
        <AppText size={24} style={{ marginBottom: 8 }}>
          ✨
        </AppText>
        <AppText
          condensed
          weight="black"
          size={16}
          style={{ marginBottom: 6, textAlign: 'center' }}>
          {t('plan_ai_title')}
        </AppText>
        <AppText size={12} color={colors.textMid} style={{ lineHeight: 18, textAlign: 'center' }}>
          {t('plan_ai_sub')}
        </AppText>
        <View style={styles.aiComingSoon}>
          <AppText
            condensed
            weight="black"
            size={12}
            color={colors.accent}
            uppercase
            style={{ letterSpacing: 1 }}>
            {t('plan_ai_badge')}
          </AppText>
        </View>
      </View>
    </Overlay>
  );
}

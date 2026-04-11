import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { NumberInput } from '../components/NumberInput';
import { Row } from '../components/Row';
import { Sheet } from '../components/Sheet';
import { Toggle } from '../components/Toggle';
import type { Lang } from '../context/LangContext';
import { useColors } from '../context/ThemeContext';
import { useT } from '../i18n';
import type { LangKey } from '../i18n';
import { STORAGE_KEYS, Storage } from '../storage';
import { type ColorPalette, Font, Space, Sports } from '../theme';
import type { OverlayType, Profile } from '../types';

type Props = {
  setOverlay: (overlay: OverlayType | null) => void;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
  lang: Lang;
  setLang: (v: Lang) => void;
};

type SheetId =
  | 'ftp'
  | 'maxhr'
  | 'goal'
  | 'units'
  | 'hrmethod'
  | 'lang'
  | 'suggest'
  | 'rate'
  | 'logout'
  | 'pb'
  | null;

type PBSport = 'swim' | 'bike' | 'run' | 'tri';

const PB_SPORTS: { id: PBSport; icon: string }[] = [
  { id: 'swim', icon: '🏊' },
  { id: 'bike', icon: '🚴' },
  { id: 'run', icon: '🏃' },
  { id: 'tri', icon: '🔱' },
];

const PB_DISTANCES: Record<PBSport, { id: string; lKey: LangKey }[]> = {
  swim: [
    { id: 'swim_400', lKey: 'pb_swim_400' },
    { id: 'swim_750', lKey: 'pb_swim_750' },
    { id: 'swim_1500', lKey: 'pb_swim_1500' },
    { id: 'swim_1900', lKey: 'pb_swim_1900' },
    { id: 'swim_3800', lKey: 'pb_swim_3800' },
  ],
  bike: [
    { id: 'bike_20', lKey: 'pb_bike_20' },
    { id: 'bike_40', lKey: 'pb_bike_40' },
    { id: 'bike_90', lKey: 'pb_bike_90' },
    { id: 'bike_180', lKey: 'pb_bike_180' },
  ],
  run: [
    { id: 'run_5k', lKey: 'pb_run_5k' },
    { id: 'run_10k', lKey: 'pb_run_10k' },
    { id: 'run_hm', lKey: 'pb_run_hm' },
    { id: 'run_marathon', lKey: 'pb_run_marathon' },
  ],
  tri: [
    { id: 'tri_sprint', lKey: 'pb_tri_sprint' },
    { id: 'tri_olympic', lKey: 'pb_tri_olympic' },
    { id: 'tri_703', lKey: 'pb_tri_703' },
    { id: 'tri_ironman', lKey: 'pb_tri_ironman' },
  ],
};

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    scroll: { flex: 1, backgroundColor: c.bg },
    content: { paddingBottom: 20 },
    hero: {
      backgroundColor: c.surface,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      padding: Space.screen,
      marginBottom: 20,
    },
    heroTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    editBtn: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    avatarWrap: { position: 'relative', flexShrink: 0 },
    proBadge: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      backgroundColor: c.accent,
      borderRadius: 6,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    pbTabBar: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    pbTab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: Space.radius.md,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      gap: 3,
    },
    pbDistRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    pbInput: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontFamily: Font.bodyBold,
      fontSize: 22,
      color: c.text,
      marginBottom: 14,
      textAlign: 'center',
    },
    group: { marginHorizontal: Space.screen, marginBottom: 16 },
    groupLabel: { marginBottom: 8, letterSpacing: 1 },
    groupItems: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Space.radius.card,
      overflow: 'hidden',
    },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    logoutBtn: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      marginHorizontal: Space.screen,
      marginTop: 8,
      paddingVertical: 16,
      borderRadius: Space.radius.md,
      borderWidth: 1,
      borderColor: `${c.heart}44`,
      backgroundColor: `${c.heart}0a`,
    },
    pickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
    },
    langRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingVertical: 18,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
    },
    langRowActive: { backgroundColor: `${c.accent}0a` },
    radioCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioCircleActive: { backgroundColor: c.accent, borderColor: c.accent },
    unitsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
      gap: 14,
    },
    hrMethodRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 14,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
      gap: 14,
    },
    textarea: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 14,
      fontFamily: 'Inter',
      fontSize: 14,
      color: c.text,
      height: 120,
      textAlignVertical: 'top',
      marginBottom: 14,
    },
    starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 16 },
    logoutButtons: { flexDirection: 'row', gap: 10 },
    cancelBtn: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
    },
    confirmLogoutBtn: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      backgroundColor: c.heart,
      alignItems: 'center',
    },
    loggedOutScreen: {
      flex: 1,
      backgroundColor: c.bg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
  });

function PickerRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <Pressable style={styles.pickerRow} onPress={onSelect}>
      <AppText
        weight="medium"
        size={14}
        color={selected ? colors.text : colors.textMid}
        style={{ flex: 1 }}>
        {label}
      </AppText>
      {selected && (
        <AppText size={18} color={colors.accent}>
          ✓
        </AppText>
      )}
    </Pressable>
  );
}

export function AccountScreen({
  setOverlay,
  isDark,
  setIsDark,
  profile,
  setProfile,
  lang,
  setLang,
}: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [notif, setNotif] = useState(true);
  const [ftp, setFtp] = useState(profile.ftp || '245');
  const [maxHR, setMaxHR] = useState(profile.maxHR || '185');
  const [hrMethod, setHrMethod] = useState('Max HR %');
  const [goal, setGoal] = useState(profile.raceType || 'Ironman 70.3');
  const [units, setUnits] = useState('km');
  const [sheet, setSheet] = useState<SheetId>(null);
  const [pbSport, setPbSport] = useState<PBSport>('run');
  const [personalBests, setPersonalBests] = useState<Record<string, string>>({});
  const [pbEditId, setPbEditId] = useState<string>('');
  const [pbInput, setPbInput] = useState('');
  const [suggestText, setSuggestText] = useState('');
  const [suggestSent, setSuggestSent] = useState(false);
  const [stars, setStars] = useState(0);
  const [rated, setRated] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const closeSheet = () => setSheet(null);

  useEffect(() => {
    Storage.get<Record<string, string>>(STORAGE_KEYS.personalBests).then((v) => {
      if (v) setPersonalBests(v);
    });
  }, []);

  useEffect(() => {
    Storage.set(STORAGE_KEYS.personalBests, personalBests);
  }, [personalBests]);

  const handleSetLang = async (id: Lang) => {
    setLang(id);
    await Storage.set(STORAGE_KEYS.lang, id);
    setTimeout(closeSheet, 50);
  };

  const handleToggleDark = async () => {
    const next = !isDark;
    setIsDark(next);
    await Storage.set(STORAGE_KEYS.isDark, next);
  };

  if (loggedOut) {
    return (
      <View style={styles.loggedOutScreen}>
        <AppText size={48} style={{ marginBottom: 16 }}>
          👋
        </AppText>
        <AppText
          condensed
          weight="black"
          size={24}
          style={{ textAlign: 'center', marginBottom: 8 }}>
          {t('account_logged_out')}
        </AppText>
        <AppText size={13} color={colors.textMid} style={{ textAlign: 'center', marginBottom: 24 }}>
          {t('account_logged_out_sub')}
        </AppText>
        <Button
          label={t('account_log_back')}
          onPress={() => setLoggedOut(false)}
          style={{ width: 200 }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <AppText condensed weight="black" size={22} uppercase style={{ letterSpacing: 1 }}>
              {t('account_title')}
            </AppText>
            <Pressable
              style={styles.editBtn}
              onPress={() =>
                setOverlay({
                  type: 'editProfile',
                  profile,
                  onSave: (p) => {
                    setProfile(p);
                    setOverlay(null);
                  },
                })
              }>
              <AppText
                weight="semibold"
                size={12}
                color={colors.accent}
                style={{ letterSpacing: 0.5 }}>
                {t('account_edit')}
              </AppText>
            </Pressable>
          </View>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <AppText size={40}>{profile.avatar}</AppText>
              <View style={styles.proBadge}>
                <AppText
                  condensed
                  weight="black"
                  size={9}
                  color={colors.bg}
                  uppercase
                  style={{ letterSpacing: 0.5 }}>
                  PRO
                </AppText>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <AppText condensed weight="black" size={24} style={{ lineHeight: 28 }}>
                {profile.name}
              </AppText>
              <AppText weight="medium" size={13} color={colors.textMid} style={{ marginTop: 2 }}>
                {profile.focus} · {profile.city} 🇺🇦
              </AppText>
              {profile.raceType ? (
                <AppText size={12} color={colors.textDim} style={{ marginTop: 4 }}>
                  {t('account_goal_label')}: {profile.raceType}
                </AppText>
              ) : null}
            </View>
          </View>
        </View>

        {/* Personal Bests */}
        <View style={styles.group}>
          <AppText
            weight="semibold"
            size={11}
            color={colors.textDim}
            uppercase
            style={styles.groupLabel}>
            {t('pb_title')}
          </AppText>
          {/* Sport tabs */}
          <View style={styles.pbTabBar}>
            {PB_SPORTS.map((s) => {
              const active = pbSport === s.id;
              const color = Sports[s.id].color;
              return (
                <Pressable
                  key={s.id}
                  style={[
                    styles.pbTab,
                    active && { backgroundColor: `${color}18`, borderColor: `${color}55` },
                  ]}
                  onPress={() => setPbSport(s.id)}>
                  <AppText size={18}>{s.icon}</AppText>
                  <AppText
                    weight="semibold"
                    size={10}
                    color={active ? color : colors.textDim}
                    uppercase
                    style={{ letterSpacing: 0.5 }}>
                    {t(`tools_tab_${s.id}` as LangKey)}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          {/* Distance rows */}
          <View style={styles.groupItems}>
            {PB_DISTANCES[pbSport].map((d, idx) => {
              const time = personalBests[d.id];
              const isLast = idx === PB_DISTANCES[pbSport].length - 1;
              return (
                <Pressable
                  key={d.id}
                  style={[
                    styles.pbDistRow,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: colors.borderSub },
                  ]}
                  onPress={() => {
                    setPbEditId(d.id);
                    setPbInput(time ?? '');
                    setSheet('pb');
                  }}>
                  <AppText weight="semibold" size={14} style={{ flex: 1 }}>
                    {t(d.lKey)}
                  </AppText>
                  <AppText
                    weight={time ? 'bold' : 'regular'}
                    size={14}
                    color={time ? Sports[pbSport].color : colors.textDim}
                    style={{ marginRight: 6 }}>
                    {time ?? t('pb_not_set')}
                  </AppText>
                  <AppText size={14} color={colors.textDim}>
                    ›
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Training Profile group */}
        <View style={styles.group}>
          <AppText
            weight="semibold"
            size={11}
            color={colors.textDim}
            uppercase
            style={styles.groupLabel}>
            {t('account_training')}
          </AppText>
          <View style={styles.groupItems}>
            <Row
              icon="⚡"
              iconBg="#1a1400"
              label={t('account_ftp')}
              right={
                <View style={styles.rowRight}>
                  <AppText weight="semibold" size={13} color={colors.textMid}>
                    {ftp} W
                  </AppText>
                  <AppText size={14} color={colors.textDim}>
                    ›
                  </AppText>
                </View>
              }
              onPress={() => setSheet('ftp')}
            />
            <Row
              icon="❤️"
              iconBg="#200010"
              label={t('account_maxhr')}
              right={
                <View style={styles.rowRight}>
                  <AppText weight="semibold" size={13} color={colors.textMid}>
                    {maxHR} {t('unit_bpm')}
                  </AppText>
                  <AppText size={14} color={colors.textDim}>
                    ›
                  </AppText>
                </View>
              }
              onPress={() =>
                setOverlay({
                  type: 'hrZones',
                  maxHR,
                  hrMethod,
                  onSave: (v: unknown) => {
                    const data = v as { maxHR: string; hrMethod: string };
                    setMaxHR(data.maxHR);
                    setHrMethod(data.hrMethod);
                    setOverlay(null);
                  },
                })
              }
            />
            <Row
              icon="🎯"
              iconBg="#001a08"
              label={t('account_goal')}
              right={
                <View style={styles.rowRight}>
                  <AppText
                    weight="semibold"
                    size={13}
                    color={colors.textMid}
                    numberOfLines={1}
                    style={{ maxWidth: 100 }}>
                    {goal}
                  </AppText>
                  <AppText size={14} color={colors.textDim}>
                    ›
                  </AppText>
                </View>
              }
              onPress={() => setSheet('goal')}
            />
          </View>
        </View>

        {/* Preferences group */}
        <View style={styles.group}>
          <AppText
            weight="semibold"
            size={11}
            color={colors.textDim}
            uppercase
            style={styles.groupLabel}>
            {t('account_prefs')}
          </AppText>
          <View style={styles.groupItems}>
            <Row
              icon="🔔"
              iconBg="#001020"
              label={t('account_notif')}
              right={<Toggle on={notif} onToggle={() => setNotif(!notif)} />}
            />
            <Row
              icon="🌙"
              iconBg="#141414"
              label={t('account_dark')}
              right={<Toggle on={isDark} onToggle={handleToggleDark} />}
            />
            <Row
              icon="📏"
              iconBg="#001a08"
              label={t('account_units')}
              right={
                <View style={styles.rowRight}>
                  <AppText weight="semibold" size={13} color={colors.textMid}>
                    {units === 'km' ? t('ac_km_kg') : t('ac_mi_lb')}
                  </AppText>
                  <AppText size={14} color={colors.textDim}>
                    ›
                  </AppText>
                </View>
              }
              onPress={() => setSheet('units')}
            />
            <Row
              icon={t('ac_hr_abbr')}
              iconBg="#0a0a1a"
              label={t('account_hr_method')}
              right={
                <View style={styles.rowRight}>
                  <AppText
                    weight="semibold"
                    size={13}
                    color={colors.textMid}
                    numberOfLines={1}
                    style={{ maxWidth: 120 }}>
                    {hrMethod === 'Max HR %' ? t('ac_max_hr_pct') : hrMethod}
                  </AppText>
                  <AppText size={14} color={colors.textDim}>
                    ›
                  </AppText>
                </View>
              }
              onPress={() => setSheet('hrmethod')}
            />
          </View>
        </View>

        {/* App group */}
        <View style={styles.group}>
          <AppText
            weight="semibold"
            size={11}
            color={colors.textDim}
            uppercase
            style={styles.groupLabel}>
            {t('account_app')}
          </AppText>
          <View style={styles.groupItems}>
            <Row
              icon="💡"
              iconBg="#1a1200"
              label={t('account_suggest')}
              right={
                <AppText size={14} color={colors.textDim}>
                  ›
                </AppText>
              }
              onPress={() => {
                setSuggestSent(false);
                setSuggestText('');
                setSheet('suggest');
              }}
            />
            <Row
              icon="⭐"
              iconBg="#1a1500"
              label={t('account_rate')}
              right={
                <AppText size={14} color={colors.textDim}>
                  ›
                </AppText>
              }
              onPress={() => {
                setRated(false);
                setStars(0);
                setSheet('rate');
              }}
            />
            <Row
              icon="🌐"
              iconBg="#0a1020"
              label={t('lang_title')}
              right={
                <View style={styles.rowRight}>
                  <AppText weight="semibold" size={13} color={colors.textMid}>
                    {lang === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}
                  </AppText>
                  <AppText size={14} color={colors.textDim}>
                    ›
                  </AppText>
                </View>
              }
              onPress={() => setSheet('lang')}
            />
            <Row
              icon="ℹ️"
              iconBg="#0a0a14"
              label={t('account_about')}
              right={
                <View style={styles.rowRight}>
                  <AppText weight="semibold" size={13} color={colors.textMid}>
                    v1.0.0
                  </AppText>
                  <AppText size={14} color={colors.textDim}>
                    ›
                  </AppText>
                </View>
              }
              onPress={() => setOverlay({ type: 'about' })}
            />
          </View>
        </View>

        <Pressable style={styles.logoutBtn} onPress={() => setSheet('logout')}>
          <AppText size={18}>🚪</AppText>
          <AppText weight="semibold" size={14} color={colors.heart}>
            {t('account_logout')}
          </AppText>
        </Pressable>
        <View style={{ height: 8 }} />
      </ScrollView>

      {/* FTP Sheet */}
      {sheet === 'ftp' && (
        <Sheet onClose={closeSheet} title={t('ftp_title')}>
          <NumberInput
            value={ftp}
            onChange={setFtp}
            unit={t('ac_watts')}
            min={50}
            max={500}
            errorMsg={t('ac_ftp_hint')}
            hint={t('ftp_hint')}
          />
          <Button
            label={t('save')}
            onPress={closeSheet}
            disabled={ftp !== '' && (parseFloat(ftp) < 50 || parseFloat(ftp) > 500)}
          />
        </Sheet>
      )}

      {/* Language Sheet */}
      {sheet === 'lang' && (
        <Sheet onClose={closeSheet} title={t('lang_title')}>
          {[
            { id: 'en' as Lang, flag: '🇬🇧', label: t('lang_en') },
            { id: 'uk' as Lang, flag: '🇺🇦', label: t('lang_ua') },
          ].map((l) => (
            <Pressable
              key={l.id}
              style={[styles.langRow, lang === l.id && styles.langRowActive]}
              onPress={() => handleSetLang(l.id)}>
              <AppText size={26}>{l.flag}</AppText>
              <View style={{ flex: 1 }}>
                <AppText
                  weight="semibold"
                  size={15}
                  color={lang === l.id ? colors.text : colors.textMid}>
                  {l.label}
                </AppText>
                {lang === l.id && (
                  <AppText
                    weight="semibold"
                    size={11}
                    color={colors.accent}
                    style={{ marginTop: 2 }}>
                    {t('ac_active_check')}
                  </AppText>
                )}
              </View>
              <View style={[styles.radioCircle, lang === l.id && styles.radioCircleActive]}>
                {lang === l.id && (
                  <AppText size={12} color={colors.bg} style={{ fontFamily: Font.bodyBold }}>
                    ✓
                  </AppText>
                )}
              </View>
            </Pressable>
          ))}
          <AppText
            size={12}
            color={colors.textDim}
            style={{
              marginTop: 14,
              lineHeight: 18,
              borderTopWidth: 1,
              borderTopColor: colors.borderSub,
              paddingTop: 12,
            }}>
            🌐 {t('ac_lang_changing')}
          </AppText>
        </Sheet>
      )}

      {/* Goal Sheet */}
      {sheet === 'goal' && (
        <Sheet onClose={closeSheet} title={t('goal_title')}>
          {[
            { id: 'Sprint Triathlon', label: t('ac_goal_sprint') },
            { id: 'Olympic Triathlon', label: t('ac_goal_olympic') },
            { id: 'Ironman 70.3', label: t('ac_goal_703') },
            { id: 'Ironman', label: t('ac_goal_im') },
            { id: 'Marathon', label: t('ac_goal_marathon') },
            { id: 'Half Marathon', label: t('ac_goal_hm') },
            { id: 'Gran Fondo', label: t('ac_goal_fondo') },
            { id: 'Custom', label: t('ac_goal_custom') },
          ].map((g) => (
            <PickerRow
              key={g.id}
              label={g.label}
              selected={goal === g.id}
              onSelect={() => {
                setGoal(g.id);
                closeSheet();
              }}
            />
          ))}
        </Sheet>
      )}

      {/* Units Sheet */}
      {sheet === 'units' && (
        <Sheet onClose={closeSheet} title={t('units_title')}>
          <AppText size={13} color={colors.textMid} style={{ marginBottom: 16, lineHeight: 19 }}>
            {t('units_sub')}
          </AppText>
          {[
            { id: 'km', label: t('units_metric'), sub: t('units_metric_sub') },
            { id: 'mi', label: t('units_imperial'), sub: t('units_imperial_sub') },
          ].map((u) => (
            <Pressable
              key={u.id}
              style={styles.unitsRow}
              onPress={() => {
                setUnits(u.id);
                closeSheet();
              }}>
              <View style={{ flex: 1 }}>
                <AppText
                  weight="semibold"
                  size={15}
                  color={units === u.id ? colors.text : colors.textMid}>
                  {u.label}
                </AppText>
                <AppText size={12} color={colors.textDim} style={{ marginTop: 2 }}>
                  {u.sub}
                </AppText>
              </View>
              {units === u.id && (
                <AppText size={18} color={colors.accent}>
                  ✓
                </AppText>
              )}
            </Pressable>
          ))}
        </Sheet>
      )}

      {/* HR Method Sheet */}
      {sheet === 'hrmethod' && (
        <Sheet onClose={closeSheet} title={t('hrmethod_title')}>
          <AppText size={13} color={colors.textMid} style={{ marginBottom: 16, lineHeight: 19 }}>
            {t('hrmethod_sub')}
          </AppText>
          {[
            { id: 'Max HR %', label: t('hrmethod_maxhr'), sub: t('hrmethod_maxhr_sub') },
            { id: 'HR Reserve', label: t('hrmethod_hrr'), sub: t('hrmethod_hrr_sub') },
            { id: 'Lactate Threshold', label: t('hrmethod_lt'), sub: t('hrmethod_lt_sub') },
          ].map((m) => (
            <Pressable
              key={m.id}
              style={styles.hrMethodRow}
              onPress={() => {
                setHrMethod(m.id);
                closeSheet();
              }}>
              <View style={{ flex: 1 }}>
                <AppText
                  weight="semibold"
                  size={14}
                  color={hrMethod === m.id ? colors.text : colors.textMid}>
                  {m.label}
                </AppText>
                <AppText size={12} color={colors.textDim} style={{ marginTop: 3, lineHeight: 17 }}>
                  {m.sub}
                </AppText>
              </View>
              {hrMethod === m.id && (
                <AppText size={18} color={colors.accent} style={{ marginTop: 2 }}>
                  ✓
                </AppText>
              )}
            </Pressable>
          ))}
        </Sheet>
      )}

      {/* Suggest Sheet */}
      {sheet === 'suggest' && (
        <Sheet onClose={closeSheet} title={t('suggest_title')}>
          {suggestSent ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <AppText size={48} style={{ marginBottom: 12 }}>
                🚀
              </AppText>
              <AppText condensed weight="black" size={22} style={{ marginBottom: 8 }}>
                {t('suggest_sent')}
              </AppText>
              <AppText
                size={13}
                color={colors.textMid}
                style={{ lineHeight: 20, marginBottom: 24, textAlign: 'center' }}>
                {t('suggest_sent_sub')}
              </AppText>
              <Button label={t('done')} onPress={closeSheet} />
            </View>
          ) : (
            <>
              <AppText
                size={13}
                color={colors.textMid}
                style={{ marginBottom: 14, lineHeight: 19 }}>
                {t('suggest_sub')}
              </AppText>
              <TextInput
                value={suggestText}
                onChangeText={setSuggestText}
                placeholder={t('suggest_ph')}
                placeholderTextColor={colors.textDim}
                multiline
                numberOfLines={4}
                style={styles.textarea}
              />
              <Button
                label={t('suggest_send')}
                onPress={() => {
                  if (suggestText.trim()) setSuggestSent(true);
                }}
                disabled={!suggestText.trim()}
              />
            </>
          )}
        </Sheet>
      )}

      {/* Rate Sheet */}
      {sheet === 'rate' && (
        <Sheet onClose={closeSheet} title={t('rate_title')}>
          {rated ? (
            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              <AppText size={48} style={{ marginBottom: 12 }}>
                🏅
              </AppText>
              <AppText condensed weight="black" size={22} style={{ marginBottom: 8 }}>
                {t('rate_sent')}
              </AppText>
              <AppText
                size={13}
                color={colors.textMid}
                style={{ lineHeight: 20, marginBottom: 24, textAlign: 'center' }}>
                {t('rate_sent_sub_pre')} {stars}⭐ {t('rate_sent_sub_suf')}
              </AppText>
              <Button label={t('done')} onPress={closeSheet} />
            </View>
          ) : (
            <>
              <AppText
                size={13}
                color={colors.textMid}
                style={{ marginBottom: 24, lineHeight: 19 }}>
                {t('rate_sub')}
              </AppText>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Pressable key={s} onPress={() => setStars(s)}>
                    <AppText size={40} style={{ opacity: s <= stars ? 1 : 0.3 }}>
                      ⭐
                    </AppText>
                  </Pressable>
                ))}
              </View>
              {stars > 0 && (
                <AppText
                  condensed
                  weight="black"
                  size={18}
                  style={{ textAlign: 'center', marginBottom: 20 }}>
                  {(t('rate_labels') as unknown as string[])[stars]}
                </AppText>
              )}
              <Button
                label={t('rate_submit')}
                onPress={() => {
                  if (stars > 0) setRated(true);
                }}
                disabled={stars === 0}
              />
            </>
          )}
        </Sheet>
      )}

      {/* PB Edit Sheet */}
      {sheet === 'pb' && (
        <Sheet
          onClose={closeSheet}
          title={t(PB_DISTANCES[pbSport].find((d) => d.id === pbEditId)?.lKey ?? 'pb_edit_title')}>
          <AppText size={13} color={colors.textMid} style={{ marginBottom: 12 }}>
            {t('pb_time_hint')}
          </AppText>
          <TextInput
            value={pbInput}
            onChangeText={setPbInput}
            placeholder="00:00:00"
            placeholderTextColor={colors.textDim}
            keyboardType="numbers-and-punctuation"
            style={styles.pbInput}
            autoFocus
            selectTextOnFocus
          />
          <Button
            label={t('save')}
            onPress={() => {
              if (pbInput.trim()) setPersonalBests((p) => ({ ...p, [pbEditId]: pbInput.trim() }));
              closeSheet();
            }}
          />
          {personalBests[pbEditId] && (
            <Pressable
              style={{ alignItems: 'center', marginTop: 16 }}
              onPress={() => {
                setPersonalBests((p) => {
                  const n = { ...p };
                  delete n[pbEditId];
                  return n;
                });
                closeSheet();
              }}>
              <AppText size={13} color={colors.heart}>
                {t('pb_clear')}
              </AppText>
            </Pressable>
          )}
        </Sheet>
      )}

      {/* Logout Sheet */}
      {sheet === 'logout' && (
        <Sheet onClose={closeSheet} title={t('logout_title')}>
          <AppText size={14} color={colors.textMid} style={{ lineHeight: 22, marginBottom: 24 }}>
            {t('account_logout_confirm')}
          </AppText>
          <View style={styles.logoutButtons}>
            <Pressable style={styles.cancelBtn} onPress={closeSheet}>
              <AppText
                condensed
                weight="black"
                size={16}
                color={colors.textMid}
                uppercase
                style={{ letterSpacing: 1 }}>
                {t('cancel')}
              </AppText>
            </Pressable>
            <Pressable
              style={styles.confirmLogoutBtn}
              onPress={() => {
                closeSheet();
                setLoggedOut(true);
              }}>
              <AppText
                condensed
                weight="black"
                size={16}
                color="#fff"
                uppercase
                style={{ letterSpacing: 1 }}>
                {t('account_logout')}
              </AppText>
            </Pressable>
          </View>
        </Sheet>
      )}
    </View>
  );
}

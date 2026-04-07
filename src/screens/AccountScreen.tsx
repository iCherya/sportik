import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { NumberInput } from '../components/NumberInput';
import { Row } from '../components/Row';
import { Sheet } from '../components/Sheet';
import { Toggle } from '../components/Toggle';
import type { Lang } from '../context/LangContext';
import { useT } from '../i18n';
import { STORAGE_KEYS, Storage } from '../storage';
import { Colors, Font, Space, Sports } from '../theme';
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
  | null;

// ─── PickerRow ───────────────────────────────────────────────────────────────

function PickerRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable style={styles.pickerRow} onPress={onSelect}>
      <AppText
        weight="medium"
        size={14}
        color={selected ? Colors.text : Colors.textMid}
        style={{ flex: 1 }}>
        {label}
      </AppText>
      {selected && (
        <AppText size={18} color={Colors.accent}>
          ✓
        </AppText>
      )}
    </Pressable>
  );
}

// ─── AccountScreen ───────────────────────────────────────────────────────────

const PR_DATA = [
  { sport: 'swim' as const, icon: '🏊', val: '28:42', label: '1.5km Swim' },
  { sport: 'bike' as const, icon: '🚴', val: '1:02h', label: '40km Bike' },
  { sport: 'run' as const, icon: '🏃', val: '42:10', label: '10km Run' },
  { sport: 'tri' as const, icon: '🔱', val: '4:38h', label: 'Olympic Tri' },
];

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
  const [notif, setNotif] = useState(true);
  const [ftp, setFtp] = useState(profile.ftp || '245');
  const [maxHR, setMaxHR] = useState(profile.maxHR || '185');
  const [hrMethod, setHrMethod] = useState('Max HR %');
  const [goal, setGoal] = useState(profile.raceType || 'Ironman 70.3');
  const [units, setUnits] = useState('km');
  const [sheet, setSheet] = useState<SheetId>(null);
  const [suggestText, setSuggestText] = useState('');
  const [suggestSent, setSuggestSent] = useState(false);
  const [stars, setStars] = useState(0);
  const [rated, setRated] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const closeSheet = () => setSheet(null);

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
        <AppText size={13} color={Colors.textMid} style={{ textAlign: 'center', marginBottom: 24 }}>
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
              color={Colors.accent}
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
                color={Colors.bg}
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
            <AppText weight="medium" size={13} color={Colors.textMid} style={{ marginTop: 2 }}>
              {profile.focus} · {profile.city} 🇺🇦
            </AppText>
            <AppText size={12} color={Colors.textDim} style={{ marginTop: 4 }}>
              {profile.raceType
                ? `${t('account_goal_label')}: ${profile.raceType} · ${t('account_active_plan')}`
                : t('account_no_plan')}
            </AppText>
          </View>
        </View>

        {/* PR boxes */}
        <View style={styles.prRow}>
          {PR_DATA.map((p) => (
            <Pressable
              key={p.label}
              style={styles.prBox}
              onPress={() =>
                setOverlay({ type: 'pr', pr: { sport: p.sport, label: p.label, val: p.val } })
              }>
              <AppText size={18}>{p.icon}</AppText>
              <AppText
                condensed
                weight="black"
                size={16}
                color={Sports[p.sport].color}
                style={{ marginTop: 4 }}>
                {p.val}
              </AppText>
              <AppText
                size={9}
                color={Colors.textDim}
                style={{ textAlign: 'center', marginTop: 2 }}>
                {p.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Training Profile group */}
      <View style={styles.group}>
        <AppText
          weight="semibold"
          size={11}
          color={Colors.textDim}
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
                <AppText weight="semibold" size={13} color={Colors.textMid}>
                  {ftp} W
                </AppText>
                <AppText size={14} color={Colors.textDim}>
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
                <AppText weight="semibold" size={13} color={Colors.textMid}>
                  {maxHR} bpm
                </AppText>
                <AppText size={14} color={Colors.textDim}>
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
                  color={Colors.textMid}
                  numberOfLines={1}
                  style={{ maxWidth: 100 }}>
                  {goal}
                </AppText>
                <AppText size={14} color={Colors.textDim}>
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
          color={Colors.textDim}
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
                <AppText weight="semibold" size={13} color={Colors.textMid}>
                  {units === 'km' ? 'km · kg · °C' : 'mi · lb · °F'}
                </AppText>
                <AppText size={14} color={Colors.textDim}>
                  ›
                </AppText>
              </View>
            }
            onPress={() => setSheet('units')}
          />
          <Row
            icon="HR"
            iconBg="#0a0a1a"
            label={t('account_hr_method')}
            right={
              <View style={styles.rowRight}>
                <AppText
                  weight="semibold"
                  size={13}
                  color={Colors.textMid}
                  numberOfLines={1}
                  style={{ maxWidth: 120 }}>
                  {hrMethod}
                </AppText>
                <AppText size={14} color={Colors.textDim}>
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
          color={Colors.textDim}
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
              <AppText size={14} color={Colors.textDim}>
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
              <AppText size={14} color={Colors.textDim}>
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
                <AppText weight="semibold" size={13} color={Colors.textMid}>
                  {lang === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}
                </AppText>
                <AppText size={14} color={Colors.textDim}>
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
                <AppText weight="semibold" size={13} color={Colors.textMid}>
                  v1.0.0
                </AppText>
                <AppText size={14} color={Colors.textDim}>
                  ›
                </AppText>
              </View>
            }
            onPress={() => setOverlay({ type: 'about' })}
          />
        </View>
      </View>

      {/* Log Out */}
      <Pressable style={styles.logoutBtn} onPress={() => setSheet('logout')}>
        <AppText size={18}>🚪</AppText>
        <AppText weight="semibold" size={14} color={Colors.heart}>
          {t('account_logout')}
        </AppText>
      </Pressable>
      <View style={{ height: 8 }} />

      {/* ── Sheets ────────────────────────────────────────────── */}

      {/* FTP */}
      {sheet === 'ftp' && (
        <Sheet onClose={closeSheet} title={t('ftp_title')}>
          <NumberInput
            value={ftp}
            onChange={setFtp}
            unit="Watts"
            min={50}
            max={500}
            errorMsg="FTP is typically between 50W and 500W"
            hint={t('ftp_hint')}
          />
          <Button
            label={t('save')}
            onPress={closeSheet}
            disabled={ftp !== '' && (parseFloat(ftp) < 50 || parseFloat(ftp) > 500)}
          />
        </Sheet>
      )}

      {/* Language */}
      {sheet === 'lang' && (
        <Sheet onClose={closeSheet} title={t('lang_title')}>
          {[
            { id: 'en' as Lang, flag: '🇬🇧', label: 'English' },
            { id: 'uk' as Lang, flag: '🇺🇦', label: 'Українська' },
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
                  color={lang === l.id ? Colors.text : Colors.textMid}>
                  {l.label}
                </AppText>
                {lang === l.id && (
                  <AppText
                    weight="semibold"
                    size={11}
                    color={Colors.accent}
                    style={{ marginTop: 2 }}>
                    ✓ Active
                  </AppText>
                )}
              </View>
              <View style={[styles.radioCircle, lang === l.id && styles.radioCircleActive]}>
                {lang === l.id && (
                  <AppText size={12} color={Colors.bg} style={{ fontFamily: Font.condensedBlack }}>
                    ✓
                  </AppText>
                )}
              </View>
            </Pressable>
          ))}
          <AppText
            size={12}
            color={Colors.textDim}
            style={{
              marginTop: 14,
              lineHeight: 18,
              borderTopWidth: 1,
              borderTopColor: Colors.borderSub,
              paddingTop: 12,
            }}>
            🌐 {'Changing language updates all screens instantly.'}
          </AppText>
        </Sheet>
      )}

      {/* Season Goal */}
      {sheet === 'goal' && (
        <Sheet onClose={closeSheet} title={t('goal_title')}>
          {[
            'Sprint Triathlon',
            'Olympic Triathlon',
            'Ironman 70.3',
            'Ironman',
            'Marathon',
            'Half Marathon',
            'Gran Fondo',
            'Custom',
          ].map((g) => (
            <PickerRow
              key={g}
              label={g}
              selected={goal === g}
              onSelect={() => {
                setGoal(g);
                closeSheet();
              }}
            />
          ))}
        </Sheet>
      )}

      {/* Units */}
      {sheet === 'units' && (
        <Sheet onClose={closeSheet} title={t('units_title')}>
          <AppText size={13} color={Colors.textMid} style={{ marginBottom: 16, lineHeight: 19 }}>
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
                  color={units === u.id ? Colors.text : Colors.textMid}>
                  {u.label}
                </AppText>
                <AppText size={12} color={Colors.textDim} style={{ marginTop: 2 }}>
                  {u.sub}
                </AppText>
              </View>
              {units === u.id && (
                <AppText size={18} color={Colors.accent}>
                  ✓
                </AppText>
              )}
            </Pressable>
          ))}
        </Sheet>
      )}

      {/* HR Method */}
      {sheet === 'hrmethod' && (
        <Sheet onClose={closeSheet} title={t('hrmethod_title')}>
          <AppText size={13} color={Colors.textMid} style={{ marginBottom: 16, lineHeight: 19 }}>
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
                  color={hrMethod === m.id ? Colors.text : Colors.textMid}>
                  {m.label}
                </AppText>
                <AppText size={12} color={Colors.textDim} style={{ marginTop: 3, lineHeight: 17 }}>
                  {m.sub}
                </AppText>
              </View>
              {hrMethod === m.id && (
                <AppText size={18} color={Colors.accent} style={{ marginTop: 2 }}>
                  ✓
                </AppText>
              )}
            </Pressable>
          ))}
        </Sheet>
      )}

      {/* Suggest a Feature */}
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
                color={Colors.textMid}
                style={{ lineHeight: 20, marginBottom: 24, textAlign: 'center' }}>
                {t('suggest_sent_sub')}
              </AppText>
              <Button label={t('done')} onPress={closeSheet} />
            </View>
          ) : (
            <>
              <AppText
                size={13}
                color={Colors.textMid}
                style={{ marginBottom: 14, lineHeight: 19 }}>
                {t('suggest_sub')}
              </AppText>
              <TextInput
                value={suggestText}
                onChangeText={setSuggestText}
                placeholder={t('suggest_ph')}
                placeholderTextColor={Colors.textDim}
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

      {/* Rate Sportik */}
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
                color={Colors.textMid}
                style={{ lineHeight: 20, marginBottom: 24, textAlign: 'center' }}>
                {t('rate_sent_sub_pre')} {stars}⭐ {t('rate_sent_sub_suf')}
              </AppText>
              <Button label={t('done')} onPress={closeSheet} />
            </View>
          ) : (
            <>
              <AppText
                size={13}
                color={Colors.textMid}
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

      {/* Log Out */}
      {sheet === 'logout' && (
        <Sheet onClose={closeSheet} title={t('logout_title')}>
          <AppText size={14} color={Colors.textMid} style={{ lineHeight: 22, marginBottom: 24 }}>
            {t('account_logout_confirm')}
          </AppText>
          <View style={styles.logoutButtons}>
            <Pressable style={styles.cancelBtn} onPress={closeSheet}>
              <AppText
                condensed
                weight="black"
                size={16}
                color={Colors.textMid}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: 20 },

  // Hero
  hero: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: Colors.accent,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  prRow: { flexDirection: 'row', gap: 8, marginTop: 18 },
  prBox: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },

  // Groups
  group: { marginHorizontal: Space.screen, marginBottom: 16 },
  groupLabel: { marginBottom: 8, letterSpacing: 1 },
  groupItems: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Space.radius.card,
    overflow: 'hidden',
  },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  // Logout
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
    borderColor: `${Colors.heart}44`,
    backgroundColor: `${Colors.heart}0a`,
  },

  // Sheet rows
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSub,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSub,
  },
  langRowActive: { backgroundColor: `${Colors.accent}0a` },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  unitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSub,
    gap: 14,
  },
  hrMethodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSub,
    gap: 14,
  },
  textarea: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    fontFamily: 'Barlow',
    fontSize: 14,
    color: Colors.text,
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
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  confirmLogoutBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.heart,
    alignItems: 'center',
  },
  loggedOutScreen: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
});

import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Overlay } from '../components/Overlay';
import { Sheet } from '../components/Sheet';
import { useColors } from '../context/ThemeContext';
import { EVENTS_DATA, type Event } from '../data';
import { useT } from '../i18n';
import { type ColorPalette, Space, Sports, type SportKey } from '../theme';

type Props = {
  favs: number[];
  setFavs: Dispatch<SetStateAction<number[]>>;
  personalEvents: Event[];
  setPersonalEvents: Dispatch<SetStateAction<Event[]>>;
};

type TabId = 'discover' | 'my';
type FilterId = SportKey | 'all';

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { paddingHorizontal: Space.screen, paddingTop: 20, paddingBottom: 0 },
    tabRow: {
      flexDirection: 'row',
      marginTop: 14,
      backgroundColor: c.surface,
      borderRadius: 14,
      padding: 4,
    },
    etab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
    etabActive: { backgroundColor: c.card },
    list: { flex: 1 },
    listContent: { padding: Space.screen, paddingTop: 14 },
    filterChips: { flexDirection: 'row', gap: 8 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    chipActive: { borderColor: c.accent, backgroundColor: `${c.accent}15` },
    eventCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      marginBottom: 8,
      overflow: 'hidden',
      paddingVertical: 12,
      paddingRight: 14,
    },
    eventCardArchived: { opacity: 0.6 },
    eventStripe: { width: 4, alignSelf: 'stretch', marginRight: 10 },
    eventIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginRight: 10,
    },
    eventInfo: { flex: 1 },
    eventNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    myBadge: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: `${c.accent}22`,
    },
    eventRight: { alignItems: 'center', gap: 6, marginLeft: 10 },
    daysWrap: { alignItems: 'center' },
    dashedBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
      paddingVertical: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: c.border,
    },
    sectionLabel: { marginBottom: 10, marginTop: 4, letterSpacing: 1 },
    archiveToggle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 8,
    },
    emptyMy: { alignItems: 'center', paddingVertical: 40 },
    detailHero: {
      borderRadius: Space.radius.lg,
      padding: 28,
      marginBottom: 16,
      alignItems: 'center',
      gap: 4,
    },
    detailInfoCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Space.radius.card,
      overflow: 'hidden',
    },
    detailInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSub,
    },
    communityNote: {
      marginTop: 16,
      padding: 14,
      backgroundColor: c.surface,
      borderRadius: Space.radius.md,
    },
    textInput: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Space.radius.md,
      padding: 14,
      color: c.text,
      fontSize: 14,
      fontFamily: 'Barlow',
      marginBottom: 10,
    },
    inputError: { borderColor: c.heart },
    fieldLabel: { marginBottom: 4, marginTop: 4 },
    twoCol: { flexDirection: 'row', gap: 8 },
    sportPicker: { flexDirection: 'row', gap: 6, marginBottom: 12 },
    sportPickerBtn: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
      paddingVertical: 10,
      borderRadius: Space.radius.sm,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
  });

function EventCard({
  ev,
  isFav,
  onToggleFav,
  onPress,
  archived = false,
}: {
  ev: Event;
  isFav: boolean;
  onToggleFav: () => void;
  onPress: () => void;
  archived?: boolean;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const sport = Sports[ev.sport];
  return (
    <Pressable style={[styles.eventCard, archived && styles.eventCardArchived]} onPress={onPress}>
      <View
        style={[styles.eventStripe, { backgroundColor: archived ? colors.textDim : sport.color }]}
      />
      <View style={[styles.eventIconWrap, { backgroundColor: `${sport.color}22` }]}>
        <AppText size={22}>{sport.icon}</AppText>
      </View>
      <View style={styles.eventInfo}>
        <View style={styles.eventNameRow}>
          <AppText
            condensed
            weight="bold"
            size={16}
            color={archived ? colors.textMid : colors.text}
            style={{ flex: 1, textDecorationLine: archived ? 'line-through' : 'none' }}>
            {ev.name}
          </AppText>
          {!ev.global && (
            <View style={styles.myBadge}>
              <AppText condensed weight="bold" size={9} color={colors.accent} uppercase>
                MY
              </AppText>
            </View>
          )}
        </View>
        <AppText size={12} color={colors.textDim} style={{ marginTop: 3 }}>
          📍 {ev.location}
        </AppText>
        <AppText weight="medium" size={11} color={colors.textMid} style={{ marginTop: 2 }}>
          {ev.date} · {ev.dist}
        </AppText>
      </View>
      <View style={styles.eventRight}>
        <Pressable onPress={onToggleFav} hitSlop={8}>
          <AppText size={18}>{isFav ? '⭐' : '☆'}</AppText>
        </Pressable>
        {ev.days > 0 ? (
          <View style={styles.daysWrap}>
            <AppText
              condensed
              weight="black"
              size={22}
              color={archived ? colors.textDim : sport.color}>
              {ev.days}
            </AppText>
            <AppText weight="semibold" size={9} color={colors.textDim} uppercase>
              days
            </AppText>
          </View>
        ) : (
          <View style={styles.daysWrap}>
            <AppText weight="semibold" size={10} color={colors.textDim}>
              PAST
            </AppText>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function EventDetail({
  ev,
  isFav,
  onToggleFav,
  onBack,
}: {
  ev: Event;
  isFav: boolean;
  onToggleFav: () => void;
  onBack: () => void;
}) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const sport = Sports[ev.sport];
  const infoRows = [
    { icon: '📅', label: 'Date', value: ev.date },
    { icon: '📍', label: 'Location', value: ev.location },
    { icon: '📏', label: 'Distance', value: ev.dist },
    { icon: '🏅', label: 'Sport', value: sport.label },
  ];
  if (ev.notes) infoRows.push({ icon: '📝', label: 'Notes', value: ev.notes });

  return (
    <Overlay onBack={onBack} title={ev.name}>
      <View style={[styles.detailHero, { backgroundColor: `${sport.color}15` }]}>
        <AppText size={48} style={{ textAlign: 'center' }}>
          {sport.icon}
        </AppText>
        {ev.days > 0 ? (
          <>
            <AppText
              condensed
              weight="black"
              size={64}
              color={sport.color}
              style={{ textAlign: 'center', lineHeight: 68 }}>
              {ev.days}
            </AppText>
            <AppText
              condensed
              weight="bold"
              size={16}
              color={colors.textMid}
              uppercase
              style={{ textAlign: 'center', letterSpacing: 2 }}>
              {t('home_days_to_go')}
            </AppText>
          </>
        ) : (
          <AppText
            condensed
            weight="bold"
            size={20}
            color={colors.textMid}
            uppercase
            style={{ textAlign: 'center', letterSpacing: 2 }}>
            PAST EVENT
          </AppText>
        )}
      </View>
      <View style={styles.detailInfoCard}>
        {infoRows.map((row) => (
          <View key={row.label} style={styles.detailInfoRow}>
            <AppText size={16} style={{ width: 24 }}>
              {row.icon}
            </AppText>
            <AppText weight="medium" size={13} color={colors.textMid} style={{ width: 80 }}>
              {row.label}
            </AppText>
            <AppText weight="semibold" size={13} style={{ flex: 1 }}>
              {row.value}
            </AppText>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          label={isFav ? 'Unsave' : t('save')}
          onPress={onToggleFav}
          variant={isFav ? 'ghost' : 'accent'}
        />
      </View>
      {!ev.global && (
        <View style={styles.communityNote}>
          <AppText size={12} color={colors.textDim} style={{ lineHeight: 18, textAlign: 'center' }}>
            ℹ️ This is a community-sourced event. Verify details with the official source.
          </AppText>
        </View>
      )}
    </Overlay>
  );
}

type EventForm = {
  name: string;
  sport: SportKey;
  dist: string;
  date: string;
  location: string;
  notes: string;
};

function AddEventSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (ev: Event) => void }) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [form, setForm] = useState<EventForm>({
    name: '',
    sport: 'tri',
    dist: '',
    date: '',
    location: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EventForm, string>>>({});

  const validate = () => {
    const errs: Partial<Record<keyof EventForm, string>> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.date) errs.date = 'Required';
    if (!form.location.trim()) errs.location = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const days = Math.ceil((new Date(form.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    onAdd({
      id: Date.now(),
      name: form.name.trim(),
      sport: form.sport,
      dist: form.dist || 'Custom',
      location: form.location.trim(),
      date: form.date,
      notes: form.notes.trim(),
      days,
      fav: false,
      global: false,
    });
    onClose();
  };

  const sportOptions: SportKey[] = ['tri', 'run', 'bike', 'swim'];
  return (
    <Sheet onClose={onClose} title={t('events_add_title')}>
      <AppText weight="medium" size={13} color={colors.textMid} style={{ marginBottom: 4 }}>
        {t('events_name')}
      </AppText>
      <TextInput
        value={form.name}
        onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
        placeholder="Event name..."
        placeholderTextColor={colors.textDim}
        style={[styles.textInput, errors.name ? styles.inputError : null]}
      />
      <AppText weight="medium" size={13} color={colors.textMid} style={styles.fieldLabel}>
        {t('events_sport')}
      </AppText>
      <View style={styles.sportPicker}>
        {sportOptions.map((s) => (
          <Pressable
            key={s}
            style={[
              styles.sportPickerBtn,
              form.sport === s && {
                backgroundColor: `${Sports[s].color}22`,
                borderColor: Sports[s].color,
              },
            ]}
            onPress={() => setForm((f) => ({ ...f, sport: s }))}>
            <AppText size={18}>{Sports[s].icon}</AppText>
            <AppText
              weight="semibold"
              size={11}
              color={form.sport === s ? Sports[s].color : colors.textMid}>
              {Sports[s].label}
            </AppText>
          </Pressable>
        ))}
      </View>
      <View style={styles.twoCol}>
        <View style={{ flex: 1 }}>
          <AppText weight="medium" size={13} color={colors.textMid} style={{ marginBottom: 4 }}>
            {t('events_dist')}
          </AppText>
          <TextInput
            value={form.dist}
            onChangeText={(v) => setForm((f) => ({ ...f, dist: v }))}
            placeholder="e.g. 70.3km"
            placeholderTextColor={colors.textDim}
            style={styles.textInput}
          />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="medium" size={13} color={colors.textMid} style={{ marginBottom: 4 }}>
            {t('events_date')}
          </AppText>
          <TextInput
            value={form.date}
            onChangeText={(v) => setForm((f) => ({ ...f, date: v }))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textDim}
            style={[styles.textInput, errors.date ? styles.inputError : null]}
          />
        </View>
      </View>
      <AppText weight="medium" size={13} color={colors.textMid} style={styles.fieldLabel}>
        {t('events_location')}
      </AppText>
      <TextInput
        value={form.location}
        onChangeText={(v) => setForm((f) => ({ ...f, location: v }))}
        placeholder="City, Country"
        placeholderTextColor={colors.textDim}
        style={[styles.textInput, errors.location ? styles.inputError : null]}
      />
      <AppText weight="medium" size={13} color={colors.textMid} style={styles.fieldLabel}>
        {t('events_notes')}
      </AppText>
      <TextInput
        value={form.notes}
        onChangeText={(v) => setForm((f) => ({ ...f, notes: v }))}
        placeholder={t('events_notes_ph')}
        placeholderTextColor={colors.textDim}
        multiline
        numberOfLines={3}
        style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
      />
      <View style={{ marginTop: 8 }}>
        <Button label={t('events_submit')} onPress={submit} />
      </View>
    </Sheet>
  );
}

type SuggestForm = {
  name: string;
  sport: SportKey;
  location: string;
  date: string;
  dist: string;
  desc: string;
};

function SuggestSheet({ onClose }: { onClose: () => void }) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [form, setForm] = useState<SuggestForm>({
    name: '',
    sport: 'tri',
    location: '',
    date: '',
    dist: '',
    desc: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SuggestForm, string>>>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs: Partial<Record<keyof SuggestForm, string>> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.location.trim()) errs.location = 'Required';
    if (!form.date) errs.date = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  if (sent) {
    return (
      <Sheet onClose={onClose} title={t('events_suggest_title')}>
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <AppText size={48} style={{ marginBottom: 12 }}>
            🚀
          </AppText>
          <AppText
            condensed
            weight="black"
            size={22}
            style={{ marginBottom: 8, textAlign: 'center' }}>
            {t('events_suggest_sent')}
          </AppText>
          <AppText
            size={13}
            color={colors.textMid}
            style={{ lineHeight: 20, marginBottom: 24, textAlign: 'center' }}>
            {t('events_suggest_sent_sub')}
          </AppText>
          <Button label={t('done')} onPress={onClose} />
        </View>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose} title={t('events_suggest_title')}>
      <AppText size={13} color={colors.textMid} style={{ marginBottom: 14, lineHeight: 19 }}>
        {t('events_suggest_sub')}
      </AppText>
      <TextInput
        value={form.name}
        onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
        placeholder="Event name..."
        placeholderTextColor={colors.textDim}
        style={[styles.textInput, errors.name ? styles.inputError : null]}
      />
      <View style={styles.twoCol}>
        <View style={{ flex: 1 }}>
          <TextInput
            value={form.location}
            onChangeText={(v) => setForm((f) => ({ ...f, location: v }))}
            placeholder="City, Country"
            placeholderTextColor={colors.textDim}
            style={[styles.textInput, errors.location ? styles.inputError : null]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            value={form.date}
            onChangeText={(v) => setForm((f) => ({ ...f, date: v }))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textDim}
            style={[styles.textInput, errors.date ? styles.inputError : null]}
          />
        </View>
      </View>
      <TextInput
        value={form.desc}
        onChangeText={(v) => setForm((f) => ({ ...f, desc: v }))}
        placeholder="Tell us about the event..."
        placeholderTextColor={colors.textDim}
        multiline
        numberOfLines={3}
        style={[styles.textInput, { height: 80, textAlignVertical: 'top', marginBottom: 12 }]}
      />
      <Button
        label={t('events_submit')}
        onPress={() => {
          if (validate()) setSent(true);
        }}
      />
    </Sheet>
  );
}

export function EventsScreen({ favs, setFavs, personalEvents, setPersonalEvents }: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [tab, setTab] = useState<TabId>('discover');
  const [filter, setFilter] = useState<FilterId>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);

  const allEvents = [...EVENTS_DATA.filter((e) => e.global), ...personalEvents];
  const toggleFav = (id: number) =>
    setFavs((fs) => (fs.includes(id) ? fs.filter((f) => f !== id) : [...fs, id]));

  const discoverEvents = allEvents.filter((e) => filter === 'all' || e.sport === filter);
  const myEvents = allEvents.filter((e) => favs.includes(e.id));
  const upcoming = myEvents.filter((e) => e.days > 0).sort((a, b) => a.days - b.days);
  const archived = myEvents.filter((e) => e.days <= 0);

  const filterTabs: { id: FilterId; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '⚡' },
    { id: 'tri', label: Sports['tri'].label, icon: Sports['tri'].icon },
    { id: 'run', label: Sports['run'].label, icon: Sports['run'].icon },
    { id: 'bike', label: Sports['bike'].label, icon: Sports['bike'].icon },
    { id: 'swim', label: Sports['swim'].label, icon: Sports['swim'].icon },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText condensed weight="black" size={34} uppercase style={{ letterSpacing: 1 }}>
          {t('events_title')}
        </AppText>
        <View style={styles.tabRow}>
          {(['discover', 'my'] as TabId[]).map((id) => (
            <Pressable
              key={id}
              style={[styles.etab, tab === id && styles.etabActive]}
              onPress={() => setTab(id)}>
              <AppText
                weight="semibold"
                size={13}
                color={tab === id ? colors.text : colors.textMid}>
                {id === 'discover' ? t('events_discover') : t('events_my')}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {tab === 'discover' ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 14 }}>
              <View style={styles.filterChips}>
                {filterTabs.map((f) => {
                  const active = filter === f.id;
                  return (
                    <Pressable
                      key={f.id}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => setFilter(f.id)}>
                      <AppText size={14}>{f.icon}</AppText>
                      <AppText
                        weight="semibold"
                        size={12}
                        color={active ? colors.text : colors.textMid}>
                        {f.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
            {discoverEvents.map((ev) => (
              <EventCard
                key={ev.id}
                ev={ev}
                isFav={favs.includes(ev.id)}
                onToggleFav={() => toggleFav(ev.id)}
                onPress={() => setDetailEvent(ev)}
              />
            ))}
            <Pressable style={styles.dashedBtn} onPress={() => setShowSuggest(true)}>
              <AppText size={16}>📬</AppText>
              <AppText weight="semibold" size={13} color={colors.textMid}>
                {t('events_suggest')}
              </AppText>
            </Pressable>
          </>
        ) : (
          <>
            {upcoming.length === 0 && archived.length === 0 ? (
              <View style={styles.emptyMy}>
                <AppText size={40} style={{ marginBottom: 12 }}>
                  ⭐
                </AppText>
                <AppText
                  condensed
                  weight="black"
                  size={20}
                  color={colors.textMid}
                  style={{ marginBottom: 8 }}>
                  {t('events_no_events')}
                </AppText>
                <AppText
                  size={13}
                  color={colors.textDim}
                  style={{ lineHeight: 20, textAlign: 'center', marginBottom: 20 }}>
                  {t('events_no_events_sub')}
                </AppText>
                <Button
                  label={t('events_browse')}
                  onPress={() => setTab('discover')}
                  variant="surface"
                />
              </View>
            ) : (
              <>
                {upcoming.length > 0 && (
                  <>
                    <AppText
                      condensed
                      weight="bold"
                      size={12}
                      color={colors.textDim}
                      uppercase
                      style={styles.sectionLabel}>
                      {t('events_upcoming')} · {upcoming.length}
                    </AppText>
                    {upcoming.map((ev) => (
                      <EventCard
                        key={ev.id}
                        ev={ev}
                        isFav
                        onToggleFav={() => toggleFav(ev.id)}
                        onPress={() => setDetailEvent(ev)}
                      />
                    ))}
                  </>
                )}
                {archived.length > 0 && (
                  <>
                    <Pressable
                      style={styles.archiveToggle}
                      onPress={() => setShowArchived(!showArchived)}>
                      <AppText
                        condensed
                        weight="bold"
                        size={12}
                        color={colors.textDim}
                        uppercase
                        style={{ letterSpacing: 1 }}>
                        {t('events_past')} · {archived.length}
                      </AppText>
                      <AppText size={14} color={colors.textDim}>
                        {showArchived ? '▾' : '▸'}
                      </AppText>
                    </Pressable>
                    {showArchived &&
                      archived.map((ev) => (
                        <EventCard
                          key={ev.id}
                          ev={ev}
                          isFav
                          onToggleFav={() => toggleFav(ev.id)}
                          onPress={() => setDetailEvent(ev)}
                          archived
                        />
                      ))}
                  </>
                )}
              </>
            )}
            <Pressable style={styles.dashedBtn} onPress={() => setShowAddEvent(true)}>
              <AppText size={16}>＋</AppText>
              <AppText weight="semibold" size={13} color={colors.textMid}>
                {t('events_add_personal')}
              </AppText>
            </Pressable>
          </>
        )}
      </ScrollView>

      {showAddEvent && (
        <AddEventSheet
          onClose={() => setShowAddEvent(false)}
          onAdd={(ev) => setPersonalEvents((evs) => [ev, ...evs])}
        />
      )}
      {showSuggest && <SuggestSheet onClose={() => setShowSuggest(false)} />}
      {detailEvent && (
        <EventDetail
          ev={detailEvent}
          isFav={favs.includes(detailEvent.id)}
          onToggleFav={() => toggleFav(detailEvent.id)}
          onBack={() => setDetailEvent(null)}
        />
      )}
    </View>
  );
}

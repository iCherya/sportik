import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { DateField } from '../components/DateField';
import { Overlay } from '../components/Overlay';
import { Sheet } from '../components/Sheet';
import { useColors } from '../context/ThemeContext';
import { daysUntil, type Event } from '../data';
import { useT } from '../i18n';
import { type ColorPalette, Space, Sports, type SportKey } from '../theme';

type Props = {
  personalEvents: Event[];
  setPersonalEvents: Dispatch<SetStateAction<Event[]>>;
};

type FilterId = SportKey | 'all';

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { paddingHorizontal: Space.screen, paddingTop: 20, paddingBottom: 0 },
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
    eventRight: { alignItems: 'center', marginLeft: 10 },
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
    emptyState: { alignItems: 'center', paddingVertical: 48 },
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
    textInput: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Space.radius.md,
      padding: 14,
      color: c.text,
      fontSize: 14,
      fontFamily: 'Inter',
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
  onPress,
  archived = false,
}: {
  ev: Event;
  onPress: () => void;
  archived?: boolean;
}) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const sport = Sports[ev.sport];
  const days = daysUntil(ev.date);
  return (
    <Pressable style={[styles.eventCard, archived && styles.eventCardArchived]} onPress={onPress}>
      <View
        style={[styles.eventStripe, { backgroundColor: archived ? colors.textDim : sport.color }]}
      />
      <View style={[styles.eventIconWrap, { backgroundColor: `${sport.color}22` }]}>
        <AppText size={22}>{sport.icon}</AppText>
      </View>
      <View style={styles.eventInfo}>
        <AppText
          condensed
          weight="bold"
          size={16}
          color={archived ? colors.textMid : colors.text}
          style={{ textDecorationLine: archived ? 'line-through' : 'none' }}>
          {ev.name}
        </AppText>
        <AppText size={12} color={colors.textDim} style={{ marginTop: 3 }}>
          📍 {ev.location}
        </AppText>
        <AppText weight="medium" size={11} color={colors.textMid} style={{ marginTop: 2 }}>
          {ev.date} · {ev.dist}
        </AppText>
      </View>
      <View style={styles.eventRight}>
        {days > 0 ? (
          <View style={styles.daysWrap}>
            <AppText
              condensed
              weight="black"
              size={22}
              color={archived ? colors.textDim : sport.color}>
              {days}
            </AppText>
            <AppText weight="semibold" size={9} color={colors.textDim} uppercase>
              {t('events_days')}
            </AppText>
          </View>
        ) : (
          <AppText weight="semibold" size={10} color={colors.textDim}>
            {t('events_past')}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

function EventDetail({
  ev,
  onBack,
  onEdit,
  onDelete,
}: {
  ev: Event;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const sport = Sports[ev.sport];
  const days = daysUntil(ev.date);
  const infoRows = [
    { icon: '📅', label: t('ev_date_label'), value: ev.date },
    { icon: '📍', label: t('ev_location_label'), value: ev.location },
    { icon: '📏', label: t('ev_distance_label'), value: ev.dist },
    { icon: '🏅', label: t('ev_sport_label'), value: sport.label },
  ];
  if (ev.notes) infoRows.push({ icon: '📝', label: t('ev_notes_label'), value: ev.notes });

  return (
    <Overlay onBack={onBack} title={ev.name}>
      <View style={[styles.detailHero, { backgroundColor: `${sport.color}15` }]}>
        <AppText size={48} style={{ textAlign: 'center' }}>
          {sport.icon}
        </AppText>
        {days > 0 ? (
          <>
            <AppText
              condensed
              weight="black"
              size={64}
              color={sport.color}
              style={{ textAlign: 'center', lineHeight: 68 }}>
              {days}
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
            {t('ev_past_event')}
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
      <View style={{ marginTop: 20, gap: 10 }}>
        <Button label={t('account_edit')} onPress={onEdit} />
        <Button label={t('ev_delete')} onPress={onDelete} variant="ghost" />
      </View>
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

function AddEventSheet({
  onClose,
  onAdd,
  initial,
}: {
  onClose: () => void;
  onAdd: (ev: Event) => void;
  initial?: Event;
}) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [form, setForm] = useState<EventForm>({
    name: initial?.name ?? '',
    sport: initial?.sport ?? 'tri',
    dist: initial?.dist ?? '',
    date: initial?.date ?? '',
    location: initial?.location ?? '',
    notes: initial?.notes ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EventForm, string>>>({});

  const validate = () => {
    const errs: Partial<Record<keyof EventForm, string>> = {};
    if (!form.name.trim()) errs.name = t('required');
    if (!form.date) errs.date = t('required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onAdd({
      id: initial?.id ?? Date.now(),
      name: form.name.trim(),
      sport: form.sport,
      dist: form.dist || t('ev_custom'),
      location: form.location.trim(),
      date: form.date,
      notes: form.notes.trim(),
    });
    onClose();
  };

  const sportOptions: SportKey[] = ['tri', 'run', 'bike', 'swim'];
  return (
    <Sheet
      onClose={onClose}
      title={initial ? t('account_edit') : t('events_add_title')}
      maxHeight="93%">
      <View style={{ flexDirection: 'row', gap: 2, marginBottom: 4 }}>
        <AppText weight="medium" size={13} color={colors.textMid}>
          {t('events_name')}
        </AppText>
        <AppText weight="bold" size={13} color={colors.heart}>
          *
        </AppText>
      </View>
      <TextInput
        value={form.name}
        onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
        placeholder={t('ev_name_ph')}
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
              {
                (
                  {
                    tri: t('sport_tri'),
                    run: t('sport_run'),
                    bike: t('sport_bike'),
                    swim: t('sport_swim'),
                    all: t('sport_all'),
                  } as Record<string, string>
                )[s]
              }
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
            placeholder={t('ev_dist_ph')}
            placeholderTextColor={colors.textDim}
            style={styles.textInput}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 2, marginBottom: 4 }}>
            <AppText weight="medium" size={13} color={colors.textMid}>
              {t('events_date')}
            </AppText>
            <AppText weight="bold" size={13} color={colors.heart}>
              *
            </AppText>
          </View>
          <DateField
            value={form.date}
            onChange={(v) => {
              setForm((f) => ({ ...f, date: v }));
              setErrors((e) => ({ ...e, date: undefined }));
            }}
            error={!!errors.date}
            placeholder={t('ev_date_ph')}
          />
        </View>
      </View>
      <AppText weight="medium" size={13} color={colors.textMid} style={styles.fieldLabel}>
        {t('events_location')}
      </AppText>
      <TextInput
        value={form.location}
        onChangeText={(v) => setForm((f) => ({ ...f, location: v }))}
        placeholder={t('ev_loc_ph')}
        placeholderTextColor={colors.textDim}
        style={styles.textInput}
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
      <AppText size={11} color={colors.textDim} style={{ marginTop: 4, marginBottom: 12 }}>
        <AppText size={11} color={colors.heart}>
          *{' '}
        </AppText>
        {t('required')}
      </AppText>
      <Button label={initial ? t('save') : t('events_add_personal')} onPress={submit} />
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
    if (!form.name.trim()) errs.name = t('required');
    if (!form.location.trim()) errs.location = t('required');
    if (!form.date) errs.date = t('required');
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
        placeholder={t('ev_name_ph')}
        placeholderTextColor={colors.textDim}
        style={[styles.textInput, errors.name ? styles.inputError : null]}
      />
      <View style={styles.twoCol}>
        <View style={{ flex: 1 }}>
          <TextInput
            value={form.location}
            onChangeText={(v) => setForm((f) => ({ ...f, location: v }))}
            placeholder={t('ev_loc_ph')}
            placeholderTextColor={colors.textDim}
            style={[styles.textInput, errors.location ? styles.inputError : null]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            value={form.date}
            onChangeText={(v) => setForm((f) => ({ ...f, date: v }))}
            placeholder={t('ev_date_ph')}
            placeholderTextColor={colors.textDim}
            style={[styles.textInput, errors.date ? styles.inputError : null]}
          />
        </View>
      </View>
      <TextInput
        value={form.desc}
        onChangeText={(v) => setForm((f) => ({ ...f, desc: v }))}
        placeholder={t('ev_suggest_note_ph')}
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

export function EventsScreen({ personalEvents, setPersonalEvents }: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [filter, setFilter] = useState<FilterId>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const withDays = personalEvents.map((e) => ({ event: e, days: daysUntil(e.date) }));
  const filtered = withDays.filter(({ event: e }) => filter === 'all' || e.sport === filter);
  const upcoming = filtered
    .filter(({ days }) => days > 0)
    .sort((a, b) => a.days - b.days)
    .map(({ event }) => event);
  const archived = filtered
    .filter(({ days }) => days <= 0)
    .sort((a, b) => b.days - a.days)
    .map(({ event }) => event);

  const filterTabs: { id: FilterId; label: string; icon: string }[] = [
    { id: 'all', label: t('sport_all'), icon: '⚡' },
    { id: 'tri', label: t('sport_tri'), icon: Sports['tri'].icon },
    { id: 'run', label: t('sport_run'), icon: Sports['run'].icon },
    { id: 'bike', label: t('sport_bike'), icon: Sports['bike'].icon },
    { id: 'swim', label: t('sport_swim'), icon: Sports['swim'].icon },
  ];

  const deleteEvent = (id: number) => {
    setPersonalEvents((evs) => evs.filter((e) => e.id !== id));
    setDetailEvent(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText condensed weight="black" size={34} uppercase style={{ letterSpacing: 1 }}>
          {t('events_title')}
        </AppText>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
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

        {personalEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <AppText size={48} style={{ marginBottom: 12 }}>
              🏁
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
              label={t('events_add_personal')}
              onPress={() => setShowAddEvent(true)}
              variant="accent"
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
                  <EventCard key={ev.id} ev={ev} onPress={() => setDetailEvent(ev)} />
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
                    <EventCard key={ev.id} ev={ev} onPress={() => setDetailEvent(ev)} archived />
                  ))}
              </>
            )}

            {upcoming.length === 0 && archived.length === 0 && (
              <View style={styles.emptyState}>
                <AppText size={32} style={{ marginBottom: 8 }}>
                  🔍
                </AppText>
                <AppText size={13} color={colors.textDim} style={{ textAlign: 'center' }}>
                  {t('events_no_events')}
                </AppText>
              </View>
            )}
          </>
        )}

        <Pressable
          style={[styles.dashedBtn, personalEvents.length > 0 && { marginTop: 16 }]}
          onPress={() => setShowAddEvent(true)}>
          <AppText size={16}>＋</AppText>
          <AppText weight="semibold" size={13} color={colors.textMid}>
            {t('events_add_personal')}
          </AppText>
        </Pressable>
        <Pressable style={styles.dashedBtn} onPress={() => setShowSuggest(true)}>
          <AppText size={16}>📬</AppText>
          <AppText weight="semibold" size={13} color={colors.textMid}>
            {t('events_suggest')}
          </AppText>
        </Pressable>
      </ScrollView>

      {(showAddEvent || editEvent) && (
        <AddEventSheet
          onClose={() => {
            setShowAddEvent(false);
            setEditEvent(null);
          }}
          initial={editEvent ?? undefined}
          onAdd={(ev) => {
            if (editEvent) {
              setPersonalEvents((evs) => evs.map((e) => (e.id === editEvent.id ? ev : e)));
              setDetailEvent(ev);
            } else {
              setPersonalEvents((evs) => [ev, ...evs]);
            }
          }}
        />
      )}
      {showSuggest && <SuggestSheet onClose={() => setShowSuggest(false)} />}
      {detailEvent && !editEvent && (
        <EventDetail
          ev={detailEvent}
          onBack={() => setDetailEvent(null)}
          onEdit={() => setEditEvent(detailEvent)}
          onDelete={() => deleteEvent(detailEvent.id)}
        />
      )}
    </View>
  );
}

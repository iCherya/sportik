import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Overlay } from '../components/Overlay';
import { useT } from '../i18n';
import { STORAGE_KEYS, Storage } from '../storage';
import { Colors, Sports, type SportKey } from '../theme';
import type { PRData } from '../types';

type HistoryEntry = {
  date: string;
  event: string;
  time: string;
  best: boolean;
};

type Props = {
  pr: PRData;
  onBack: () => void;
};

export function PRDetail({ pr, onBack }: Props) {
  const t = useT();
  const sport = Sports[pr.sport as SportKey];
  const [showLog, setShowLog] = useState(false);
  const [logTime, setLogTime] = useState('');
  const [logEvent, setLogEvent] = useState('');
  const defaultHistory: HistoryEntry[] = [
    { date: '2025-02-10', event: 'Training', time: pr.val, best: true },
  ];
  const [history, setHistory] = useState<HistoryEntry[]>(defaultHistory);

  useEffect(() => {
    Storage.get<Record<string, HistoryEntry[]>>(STORAGE_KEYS.prHistory).then((all) => {
      const saved = all?.[pr.label];
      if (saved && saved.length > 0) setHistory(saved);
    });
  }, [pr.label]);

  const saveHistory = (next: HistoryEntry[]) => {
    Storage.get<Record<string, HistoryEntry[]>>(STORAGE_KEYS.prHistory).then((all) => {
      Storage.set(STORAGE_KEYS.prHistory, { ...all, [pr.label]: next });
    });
  };

  const handleLog = () => {
    if (!logTime.trim()) return;
    const newEntry: HistoryEntry = {
      date: new Date().toISOString().split('T')[0],
      event: logEvent.trim() || 'Training',
      time: logTime.trim(),
      best: false,
    };
    const next = [newEntry, ...history];
    setHistory(next);
    saveHistory(next);
    setLogTime('');
    setLogEvent('');
    setShowLog(false);
  };

  const badge = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <AppText size={15}>{sport.icon}</AppText>
      <AppText
        condensed
        weight="black"
        size={11}
        color={sport.color}
        style={{ letterSpacing: 1.5 }}
        uppercase>
        {sport.label}
      </AppText>
    </View>
  );

  return (
    <Overlay onBack={onBack} title={`${pr.label} PR`} backLabel={t('nav_account')} badge={badge}>
      {/* Hero */}
      <View
        style={[
          styles.hero,
          {
            backgroundColor: sport.bg,
            borderColor: `${sport.color}33`,
          },
        ]}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={sport.color}
          uppercase
          style={{ letterSpacing: 2, marginBottom: 4 }}>
          {t('account_pr_best')}
        </AppText>
        <AppText condensed weight="black" size={48} color={sport.color}>
          {pr.val}
        </AppText>
        <AppText size={12} color={Colors.textMid} style={{ marginTop: 4 }}>
          Set on Feb 10, 2025 · Training
        </AppText>
      </View>

      {/* History header */}
      <AppText
        condensed
        weight="bold"
        size={13}
        color={Colors.textDim}
        uppercase
        style={{ letterSpacing: 2, marginBottom: 10 }}>
        {t('account_pr_history')}
      </AppText>

      {/* History list or empty state */}
      {history.length === 1 ? (
        <View style={styles.emptyCard}>
          <AppText size={28} style={{ marginBottom: 8 }}>
            📊
          </AppText>
          <AppText
            condensed
            weight="black"
            size={16}
            color={Colors.textMid}
            style={{ marginBottom: 6 }}>
            {t('account_pr_only_one')}
          </AppText>
          <AppText size={12} color={Colors.textDim} style={{ lineHeight: 18, textAlign: 'center' }}>
            {t('account_pr_only_one_sub')}
          </AppText>
        </View>
      ) : (
        <View style={styles.historyCard}>
          {history.map((h, i) => (
            <View
              key={i}
              style={[
                styles.historyRow,
                i < history.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.borderSub,
                },
                h.best && { backgroundColor: `${sport.color}08` },
              ]}>
              <View style={{ flex: 1 }}>
                <AppText weight="semibold" size={14}>
                  {h.event}
                </AppText>
                <AppText size={12} color={Colors.textMid} style={{ marginTop: 2 }}>
                  {h.date}
                </AppText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <AppText
                  condensed
                  weight="black"
                  size={16}
                  color={h.best ? sport.color : Colors.text}>
                  {h.time}
                </AppText>
                {h.best && (
                  <View
                    style={{
                      backgroundColor: `${sport.color}22`,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 5,
                    }}>
                    <AppText condensed weight="black" size={10} color={sport.color} uppercase>
                      BEST
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Log form or button */}
      {showLog ? (
        <View style={styles.logCard}>
          <AppText condensed weight="black" size={16} style={{ marginBottom: 14 }}>
            {t('account_log_result')}
          </AppText>
          <AppText
            condensed
            weight="bold"
            size={11}
            color={Colors.textDim}
            uppercase
            style={{ letterSpacing: 2, marginBottom: 6 }}>
            {t('account_log_time')}
          </AppText>
          <TextInput
            value={logTime}
            onChangeText={setLogTime}
            placeholder={pr.val}
            placeholderTextColor={Colors.textDim}
            style={[styles.logTimeInput, { borderColor: logTime ? sport.color : Colors.border }]}
          />
          <AppText
            condensed
            weight="bold"
            size={11}
            color={Colors.textDim}
            uppercase
            style={{ letterSpacing: 2, marginBottom: 6 }}>
            {t('account_log_event')}
          </AppText>
          <TextInput
            value={logEvent}
            onChangeText={setLogEvent}
            placeholder={t('account_log_ph')}
            placeholderTextColor={Colors.textDim}
            style={styles.logEventInput}
          />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              style={styles.cancelBtn}
              onPress={() => {
                setShowLog(false);
                setLogTime('');
                setLogEvent('');
              }}>
              <AppText condensed weight="bold" size={14} color={Colors.textMid}>
                {t('cancel')}
              </AppText>
            </Pressable>
            <Pressable
              style={[styles.saveBtn, { backgroundColor: logTime ? Colors.accent : '#333' }]}
              onPress={handleLog}>
              <AppText condensed weight="black" size={14} color={logTime ? '#000' : Colors.textDim}>
                {t('account_save_result')}
              </AppText>
            </Pressable>
          </View>
        </View>
      ) : (
        <Button
          label={t('account_log_result')}
          variant="accent"
          onPress={() => setShowLog(true)}
          style={{ marginTop: 8 }}
        />
      )}
    </Overlay>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  logTimeInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontFamily: 'BarlowCondensedBlack',
    fontSize: 22,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  logEventInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontFamily: 'Barlow',
    fontWeight: '500',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 14,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  saveBtn: {
    flex: 2,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});

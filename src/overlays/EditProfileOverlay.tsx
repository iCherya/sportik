import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Overlay } from '../components/Overlay';
import { useT } from '../i18n';
import { Colors } from '../theme';
import type { Profile } from '../types';

type Props = {
  profile: Profile;
  onSave: (p: Profile) => void;
  onBack: () => void;
};

const EMOJIS = ['🧑', '👩', '🏊', '🚴', '🏃', '🔱', '💪', '🦾', '🏅', '⚡'];

export function EditProfileOverlay({ profile, onSave, onBack }: Props) {
  const t = useT();
  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city);
  const [focus, setFocus] = useState(profile.focus);
  const [avatar, setAvatar] = useState(profile.avatar);

  const focusOptions = [
    t('ob_sport_tri'),
    t('ob_sport_run'),
    t('ob_sport_bike'),
    t('ob_sport_swim'),
    t('ob_sport_tbd'),
  ];

  return (
    <Overlay onBack={onBack} title={t('ep_title')} backLabel={t('nav_account')}>
      {/* Avatar picker */}
      <View style={styles.section}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={Colors.textDim}
          uppercase
          style={styles.sectionLabel}>
          {t('ep_avatar')}
        </AppText>
        <View style={styles.emojiGrid}>
          {EMOJIS.map((e) => {
            const active = avatar === e;
            return (
              <Pressable
                key={e}
                style={[
                  styles.emojiBtn,
                  {
                    borderColor: active ? Colors.accent : Colors.border,
                    backgroundColor: active ? `${Colors.accent}22` : Colors.card,
                  },
                ]}
                onPress={() => setAvatar(e)}>
                <AppText size={24}>{e}</AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Name */}
      <View style={styles.section}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={Colors.textDim}
          uppercase
          style={styles.sectionLabel}>
          {t('ep_name')}
        </AppText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholderTextColor={Colors.textDim}
          style={styles.input}
        />
      </View>

      {/* City */}
      <View style={styles.section}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={Colors.textDim}
          uppercase
          style={styles.sectionLabel}>
          {t('ep_city')}
        </AppText>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholderTextColor={Colors.textDim}
          style={styles.input}
        />
      </View>

      {/* Sport focus */}
      <View style={[styles.section, { marginBottom: 24 }]}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={Colors.textDim}
          uppercase
          style={styles.sectionLabel}>
          {t('ep_focus')}
        </AppText>
        <View style={styles.focusGrid}>
          {focusOptions.map((f) => {
            const active = focus === f;
            return (
              <Pressable
                key={f}
                style={[
                  styles.focusBtn,
                  {
                    borderColor: active ? Colors.accent : Colors.border,
                    backgroundColor: active ? `${Colors.accent}22` : Colors.surface,
                  },
                ]}
                onPress={() => setFocus(f)}>
                <AppText
                  weight="semibold"
                  size={13}
                  color={active ? Colors.accent : Colors.textMid}>
                  {f}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Button
        label={t('ep_save')}
        variant="accent"
        onPress={() => onSave({ ...profile, name, city, focus, avatar })}
      />
    </Overlay>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    letterSpacing: 2,
    marginBottom: 10,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'BarlowSemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  focusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  focusBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
});

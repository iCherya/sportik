import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Overlay } from '../components/Overlay';
import { useColors } from '../context/ThemeContext';
import { useT } from '../i18n';
import { type ColorPalette } from '../theme';
import type { Profile } from '../types';

type Props = {
  profile: Profile;
  onSave: (p: Profile) => void;
  onBack: () => void;
};

const EMOJIS = ['🧑', '👩', '🏊', '🚴', '🏃', '🔱', '💪', '🦾', '🏅', '⚡'];

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
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
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontFamily: 'InterSemiBold',
      fontSize: 16,
      color: c.text,
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

export function EditProfileOverlay({ profile, onSave, onBack }: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
          color={colors.textDim}
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
                    borderColor: active ? colors.accent : colors.border,
                    backgroundColor: active ? `${colors.accent}22` : colors.card,
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
          color={colors.textDim}
          uppercase
          style={styles.sectionLabel}>
          {t('ep_name')}
        </AppText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.textDim}
          style={styles.input}
        />
      </View>

      {/* City */}
      <View style={styles.section}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase
          style={styles.sectionLabel}>
          {t('ep_city')}
        </AppText>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholderTextColor={colors.textDim}
          style={styles.input}
        />
      </View>

      {/* Sport focus */}
      <View style={[styles.section, { marginBottom: 24 }]}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
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
                    borderColor: active ? colors.accent : colors.border,
                    backgroundColor: active ? `${colors.accent}22` : colors.surface,
                  },
                ]}
                onPress={() => setFocus(f)}>
                <AppText
                  weight="semibold"
                  size={13}
                  color={active ? colors.accent : colors.textMid}>
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

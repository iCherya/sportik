import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { useT } from '../i18n';
import { Space } from '../theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { useColors } from '../context/ThemeContext';

type Props = {
  value: string;
  onChange: (date: string) => void;
  error?: boolean;
  placeholder?: string;
};

export function DateField({ value, onChange, error, placeholder }: Props) {
  const t = useT();
  const colors = useColors();
  const [open, setOpen] = useState(false);

  const pickerDate = value ? new Date(`${value}T12:00:00`) : new Date();

  const handleChange = (_: unknown, selected?: Date) => {
    if (Platform.OS === 'android') setOpen(false);
    if (selected) {
      const y = selected.getFullYear();
      const m = String(selected.getMonth() + 1).padStart(2, '0');
      const d = String(selected.getDate()).padStart(2, '0');
      onChange(`${y}-${m}-${d}`);
    }
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          error && styles.fieldError,
          { borderColor: error ? colors.heart : colors.border, backgroundColor: colors.card },
        ]}>
        <AppText size={14} color={value ? colors.text : colors.textDim}>
          {value || placeholder || 'YYYY-MM-DD'}
        </AppText>
        <AppText size={16}>📅</AppText>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
            onPress={() => setOpen(false)}
          />
          <View
            onStartShouldSetResponder={() => true}
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}>
            <DateTimePicker
              value={pickerDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
            <View style={{ marginTop: 8 }}>
              <Button label={t('done')} onPress={() => setOpen(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: Space.radius.md,
    padding: 14,
    marginBottom: 10,
  },
  fieldError: {},
});

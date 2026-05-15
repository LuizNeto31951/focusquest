import React, { useMemo, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { CalendarClock, X } from 'lucide-react-native';
import { Typography } from '@/presentation/components/Typography';
import { Icon } from '@/presentation/components/Icon';
import { useTheme } from '@/presentation/providers';
import { createStyles } from './DateTimeField.styles';
import type { DateTimeFieldProps } from './DateTimeField.types';

type AndroidStep = 'date' | 'time';

export function DateTimeField({
  label,
  value,
  onChange,
  helperText,
  errorText,
  mode = 'datetime',
  placeholder = 'Toque para definir',
}: DateTimeFieldProps) {
  const theme = useTheme();
  const hasError = Boolean(errorText);
  const styles = useMemo(() => createStyles(theme, hasError), [theme, hasError]);
  const isAndroid = Platform.OS === 'android';

  const [iosVisible, setIosVisible] = useState(false);
  const [androidStep, setAndroidStep] = useState<AndroidStep | null>(null);
  const [androidDraft, setAndroidDraft] = useState<Date | null>(null);

  const currentDate = value ? new Date(value) : new Date();

  function open() {
    if (isAndroid) {
      setAndroidDraft(currentDate);
      setAndroidStep(mode === 'datetime' ? 'date' : 'date');
    } else {
      setIosVisible(true);
    }
  }

  function handleIosChange(_: DateTimePickerEvent, selected?: Date) {
    if (selected) onChange(selected.toISOString());
  }

  function handleAndroidChange(event: DateTimePickerEvent, selected?: Date) {
    if (event.type === 'dismissed') {
      setAndroidStep(null);
      setAndroidDraft(null);
      return;
    }
    if (!selected) {
      setAndroidStep(null);
      return;
    }
    if (androidStep === 'date') {
      if (mode === 'datetime') {
        setAndroidDraft(selected);
        setAndroidStep('time');
      } else {
        onChange(selected.toISOString());
        setAndroidStep(null);
      }
    } else if (androidStep === 'time' && androidDraft) {
      const combined = new Date(androidDraft);
      combined.setHours(selected.getHours());
      combined.setMinutes(selected.getMinutes());
      combined.setSeconds(0, 0);
      onChange(combined.toISOString());
      setAndroidStep(null);
      setAndroidDraft(null);
    }
  }

  const display = value ? formatLabel(value, mode) : placeholder;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Typography variant="label" color="secondary">
          {label}
        </Typography>
      ) : null}
      <View style={styles.row}>
        <Pressable accessibilityRole="button" onPress={open} style={styles.input}>
          <Icon
            name={CalendarClock}
            size={18}
            color={value ? theme.colors.textPrimary : theme.colors.textDisabled}
          />
          <Typography
            variant="body"
            color={value ? 'primary' : 'disabled'}
            style={{ flex: 1 }}
          >
            {display}
          </Typography>
        </Pressable>
        {value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar prazo"
            onPress={() => onChange(undefined)}
            style={styles.clearButton}
            hitSlop={8}
          >
            <Icon name={X} size={20} color={theme.colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      {errorText ? (
        <Typography variant="caption" color="danger">
          {errorText}
        </Typography>
      ) : helperText ? (
        <Typography variant="caption" color="secondary">
          {helperText}
        </Typography>
      ) : null}

      {!isAndroid && iosVisible ? (
        <DateTimePicker
          value={currentDate}
          mode={mode}
          display="spinner"
          onChange={handleIosChange}
          themeVariant={theme.mode}
        />
      ) : null}
      {isAndroid && androidStep ? (
        <DateTimePicker
          value={androidStep === 'time' && androidDraft ? androidDraft : currentDate}
          mode={androidStep}
          is24Hour
          onChange={handleAndroidChange}
        />
      ) : null}
    </View>
  );
}

function formatLabel(iso: string, mode: 'date' | 'datetime'): string {
  try {
    const d = new Date(iso);
    if (mode === 'date') {
      return d.toLocaleDateString('pt-BR');
    }
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

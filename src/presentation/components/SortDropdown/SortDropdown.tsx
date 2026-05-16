import React, { useMemo, useState } from 'react';
import { Modal, Pressable, View, type ViewStyle } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { Icon } from '@/presentation/components/Icon';
import { Typography } from '@/presentation/components/Typography';
import { useTheme } from '@/presentation/providers';
import { createStyles } from './SortDropdown.styles';

export interface SortOption<T extends string> {
  value: T;
  label: string;
}

export interface SortDropdownProps<T extends string> {
  label?: string;
  value: T;
  options: readonly SortOption<T>[];
  onChange: (value: T) => void;
  style?: ViewStyle;
}

export function SortDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  style,
}: SortDropdownProps<T>) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [open, setOpen] = useState(false);

  const current = options.find((o) => o.value === value) ?? options[0];

  function handleSelect(next: T) {
    onChange(next);
    setOpen(false);
  }

  return (
    <View style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label ?? 'Ordenar'}: ${current?.label}`}
        onPress={() => setOpen(true)}
        style={styles.trigger}
      >
        <View style={styles.triggerText}>
          {label ? (
            <Typography variant="caption" color="secondary">
              {label}
            </Typography>
          ) : null}
          <Typography variant="label">{current?.label ?? ''}</Typography>
        </View>
        <Icon
          name={ChevronDown}
          size={18}
          color={theme.colors.textSecondary}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          onPress={() => setOpen(false)}
        />
        <View style={styles.sheet}>
          {label ? (
            <Typography
              variant="label"
              color="secondary"
              style={styles.sheetTitle}
            >
              {label}
            </Typography>
          ) : null}
          {options.map((option) => {
            const active = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                onPress={() => handleSelect(option.value)}
                style={({ pressed }) => [
                  styles.item,
                  active && styles.itemActive,
                  pressed && styles.itemPressed,
                ]}
              >
                <Typography
                  variant="body"
                  style={
                    active ? { color: theme.colors.accent } : undefined
                  }
                >
                  {option.label}
                </Typography>
                {active ? (
                  <Icon
                    name={Check}
                    size={18}
                    color={theme.colors.accent}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}

import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';
import { Icon } from '@/presentation/components/Icon';
import { Button } from '@/presentation/components/Button';

interface EmptyStateAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

interface EmptyStateProps {
  icon: ComponentType<LucideProps>;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Icon name={icon} size={40} color={theme.colors.textDisabled} />
      <Typography variant="h3" align="center" color="secondary">
        {title}
      </Typography>
      {description ? (
        <Typography variant="body" align="center" color="secondary">
          {description}
        </Typography>
      ) : null}
      {action ? (
        <View style={styles.actions}>
          <Button
            label={action.label}
            onPress={action.onPress}
            variant={action.variant ?? 'primary'}
          />
          {secondaryAction ? (
            <Button
              label={secondaryAction.label}
              onPress={secondaryAction.onPress}
              variant={secondaryAction.variant ?? 'ghost'}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  actions: {
    marginTop: 8,
    gap: 8,
    alignItems: 'center',
  },
});

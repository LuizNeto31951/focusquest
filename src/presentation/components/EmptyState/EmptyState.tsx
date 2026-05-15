import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';
import { Icon } from '@/presentation/components/Icon';

interface EmptyStateProps {
  icon: ComponentType<LucideProps>;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
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
});

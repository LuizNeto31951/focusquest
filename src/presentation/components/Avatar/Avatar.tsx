import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Typography } from '@/presentation/components/Typography';
import { useTheme } from '@/presentation/providers';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
}

export function Avatar({ name, uri, size = 56 }: AvatarProps) {
  const theme = useTheme();
  const initials = useMemo(() => computeInitials(name), [name]);
  const styles = useMemo(() => createStyles(theme, size), [theme, size]);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={styles.image}
        accessibilityLabel={`Foto de ${name}`}
      />
    );
  }

  return (
    <View style={styles.fallback} accessibilityLabel={`Avatar de ${name}`}>
      <Typography
        variant="h3"
        style={{ color: theme.colors.textOnAccent }}
      >
        {initials}
      </Typography>
    </View>
  );
}

function computeInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function createStyles(theme: ReturnType<typeof useTheme>, size: number) {
  return StyleSheet.create({
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.colors.surfaceMuted,
    },
    fallback: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

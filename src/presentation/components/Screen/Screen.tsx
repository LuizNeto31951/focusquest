import React, { useMemo } from 'react';
import { View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '@/presentation/providers';
import { createStyles } from './Screen.styles';
import type { ScreenProps } from './Screen.types';

export function Screen({
  scroll = false,
  scrollProps,
  padding = 'lg',
  style,
  children,
  ...rest
}: ScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, padding), [theme, padding]);

  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      {scroll ? (
        <ScrollView
          {...scrollProps}
          contentContainerStyle={[styles.scrollContent, scrollProps?.contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View {...rest} style={styles.content}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

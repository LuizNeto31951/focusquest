import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { Typography } from '@/presentation/components/Typography';
import { useTheme } from '@/presentation/providers';

export interface ActivityCalendarCell {
  dayKey: string;
  count: number;
}

interface ActivityCalendarProps {
  data: readonly ActivityCalendarCell[];
  todayKey: string;
  weeks?: number;
  accentColor?: string;
}

const ROWS = 7;
const CELL = 14;
const GAP = 3;
const LEFT_LABEL = 28;
const TOP_PADDING = 4;
const VIEW_BOX_WIDTH_BASE = LEFT_LABEL + 12 * (CELL + GAP);
const VIEW_BOX_HEIGHT = TOP_PADDING + ROWS * (CELL + GAP);

const ROW_LABELS: Record<number, string> = {
  1: 'Seg',
  3: 'Qua',
  5: 'Sex',
};

const LEVEL_ALPHAS = [0, 0.3, 0.55, 0.8, 1] as const;

function thresholdLevel(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
}

function applyAlpha(hex: string, alpha: number): string {
  if (!hex.startsWith('#')) return hex;
  const value = hex.slice(1);
  const normalized =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value.slice(0, 6);
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ActivityCalendar({
  data,
  todayKey,
  weeks = 12,
  accentColor,
}: ActivityCalendarProps) {
  const theme = useTheme();
  const accent = accentColor ?? theme.colors.accent;
  const totalDays = weeks * ROWS;
  const viewBoxWidth = LEFT_LABEL + weeks * (CELL + GAP);

  const cells = useMemo(() => {
    if (data.length !== totalDays) return null;
    const result: { x: number; y: number; fill: string; isToday: boolean }[] = [];
    for (let i = 0; i < totalDays; i++) {
      const col = Math.floor(i / ROWS);
      const row = i % ROWS;
      const x = LEFT_LABEL + col * (CELL + GAP);
      const y = TOP_PADDING + row * (CELL + GAP);
      const cell = data[i]!;
      const level = thresholdLevel(cell.count);
      const isFuture = cell.dayKey > todayKey;
      const isToday = cell.dayKey === todayKey;
      const baseFill =
        level === 0
          ? theme.colors.surfaceMuted
          : applyAlpha(accent, LEVEL_ALPHAS[level]!);
      const fill = isFuture
        ? applyAlpha(theme.colors.surfaceMuted, 0.4)
        : baseFill;
      result.push({ x, y, fill, isToday });
    }
    return result;
  }, [data, todayKey, totalDays, accent, theme]);

  return (
    <View style={styles.wrapper}>
      <Svg
        viewBox={`0 0 ${viewBoxWidth} ${VIEW_BOX_HEIGHT}`}
        width="100%"
        height={VIEW_BOX_HEIGHT}
      >
        {Object.entries(ROW_LABELS).map(([rowStr, label]) => {
          const row = Number(rowStr);
          const y = TOP_PADDING + row * (CELL + GAP) + CELL * 0.75;
          return (
            <SvgText
              key={row}
              x={0}
              y={y}
              fontSize={10}
              fill={theme.colors.textSecondary}
            >
              {label}
            </SvgText>
          );
        })}
        {cells?.map((cell, idx) => (
          <Rect
            key={idx}
            x={cell.x}
            y={cell.y}
            width={CELL}
            height={CELL}
            rx={3}
            fill={cell.fill}
            stroke={cell.isToday ? theme.colors.textPrimary : 'none'}
            strokeWidth={cell.isToday ? 1.5 : 0}
          />
        ))}
      </Svg>

      <View style={styles.legend}>
        <Typography variant="caption" color="secondary">
          Menos
        </Typography>
        {LEVEL_ALPHAS.map((alpha, i) => (
          <View
            key={i}
            style={[
              styles.legendCell,
              {
                backgroundColor:
                  alpha === 0
                    ? theme.colors.surfaceMuted
                    : applyAlpha(accent, alpha),
              },
            ]}
          />
        ))}
        <Typography variant="caption" color="secondary">
          Mais
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});

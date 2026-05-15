import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { Typography } from '@/presentation/components/Typography';
import { useTheme } from '@/presentation/providers';

export interface WeeklyChartDataPoint {
  label: string;
  value: number;
  highlight?: boolean;
}

interface WeeklyChartProps {
  title: string;
  total?: string;
  data: readonly WeeklyChartDataPoint[];
  color?: string;
  unit?: string;
}

const VIEW_BOX_WIDTH = 320;
const CHART_HEIGHT = 120;
const LABEL_AREA = 28;
const VALUE_AREA = 14;
const TOTAL_HEIGHT = CHART_HEIGHT + LABEL_AREA + VALUE_AREA;
const BAR_GAP = 6;
const SIDE_PADDING = 8;
const BAR_RADIUS = 4;

export function WeeklyChart({
  title,
  total,
  data,
  color,
  unit = '',
}: WeeklyChartProps) {
  const theme = useTheme();
  const accent = color ?? theme.colors.accent;
  const maxValue = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value));
    return max <= 0 ? 1 : max;
  }, [data]);

  const usableWidth = VIEW_BOX_WIDTH - SIDE_PADDING * 2;
  const barWidth = (usableWidth - BAR_GAP * (data.length - 1)) / data.length;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Typography variant="label" color="secondary">
          {title}
        </Typography>
        {total ? (
          <Typography variant="bodyEmphasis" color="primary">
            {total}
          </Typography>
        ) : null}
      </View>

      <Svg
        viewBox={`0 0 ${VIEW_BOX_WIDTH} ${TOTAL_HEIGHT}`}
        width="100%"
        height={TOTAL_HEIGHT}
      >
        {data.map((point, index) => {
          const barHeight = (point.value / maxValue) * CHART_HEIGHT;
          const x = SIDE_PADDING + index * (barWidth + BAR_GAP);
          const y = VALUE_AREA + CHART_HEIGHT - barHeight;
          const fillColor = point.highlight
            ? accent
            : applyAlpha(accent, 0.4);
          return (
            <React.Fragment key={`${point.label}-${index}`}>
              {point.value > 0 ? (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 2}
                  fontSize={10}
                  fontWeight="600"
                  fill={theme.colors.textSecondary}
                  textAnchor="middle"
                >
                  {Math.round(point.value)}
                  {unit}
                </SvgText>
              ) : null}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, point.value > 0 ? 4 : 2)}
                rx={BAR_RADIUS}
                fill={fillColor}
              />
              <SvgText
                x={x + barWidth / 2}
                y={CHART_HEIGHT + VALUE_AREA + 16}
                fontSize={11}
                fill={
                  point.highlight
                    ? theme.colors.textPrimary
                    : theme.colors.textSecondary
                }
                textAnchor="middle"
              >
                {point.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
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

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
